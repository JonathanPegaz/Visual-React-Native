import * as vscode from 'vscode';
import * as http from 'http';
import { Server as SocketServer } from 'socket.io';
import * as path from 'path';
import * as fs from 'fs';
import { randomBytes } from 'crypto';
import { VRNParser, ParsedVRNFile } from '../parsers/VRNParser';
import { LogicAnalyzer, ParsedLogicFile } from '../parsers/LogicAnalyzer';
import { validateComponentProps } from '../schemas/VRNSchemas';

export interface VRNServerMessage {
  type: string;
  payload: any;
  timestamp: number;
}

export interface VRNFileState {
  vrnFile: ParsedVRNFile;
  logicFile?: ParsedLogicFile;
  lastModified: number;
}

export class VRNLanguageServer {
  private server: http.Server | null = null;
  private io: SocketServer | null = null;
  private port: number = 0;
  private parser = new VRNParser();
  private logicAnalyzer = new LogicAnalyzer();
  private fileStates: Map<string, VRNFileState> = new Map();
  private isRunning = false;
  private authToken: string = '';
  private connectedClients: Set<string> = new Set();

  constructor(context: vscode.ExtensionContext) {
    // Context stored for potential future use
    void context;
  }

  async start(): Promise<number> {
    if (this.isRunning) {
      return this.port;
    }

    return new Promise((resolve, reject) => {
      // Generate secure authentication token
      this.authToken = randomBytes(32).toString('hex');
      
      this.server = http.createServer();
      this.io = new SocketServer(this.server, {
        cors: {
          origin: 'vscode-webview://*',
          methods: ['GET', 'POST'],
          credentials: true
        }
      });

      this.server.listen(0, () => {
        const address = this.server?.address();
        if (address && typeof address !== 'string') {
          this.port = address.port;
          this.isRunning = true;
          this.setupSocketHandlers();
          console.log(`VRN Language Server started on port ${this.port}`);
          resolve(this.port);
        } else {
          reject(new Error('Failed to start language server'));
        }
      });

      this.server.on('error', (error) => {
        console.error('Language server error:', error);
        reject(error);
      });
    });
  }

  private setupSocketHandlers(): void {
    if (!this.io) return;

    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth['token'];
      if (token === this.authToken) {
        this.connectedClients.add(socket.id);
        next();
      } else {
        console.error('Socket.IO: Authentication failed', { 
          providedToken: token ? 'present' : 'missing',
          socketId: socket.id 
        });
        next(new Error('Authentication failed'));
      }
    });

    // Rate limiting middleware
    const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
    const RATE_LIMIT = 100; // requests per minute
    const RATE_WINDOW = 60 * 1000; // 1 minute

    this.io.use((socket, next) => {
      const now = Date.now();
      const clientId = socket.id;
      const clientLimit = rateLimitMap.get(clientId);

      if (!clientLimit || now > clientLimit.resetTime) {
        rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
        next();
      } else if (clientLimit.count < RATE_LIMIT) {
        clientLimit.count++;
        next();
      } else {
        console.warn('Socket.IO: Rate limit exceeded', { socketId: clientId });
        next(new Error('Rate limit exceeded'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Visual editor connected and authenticated', { socketId: socket.id });

      // Send initial project state
      socket.emit('project:loaded', {
        files: Array.from(this.fileStates.keys()),
        components: this.getAvailableComponents(),
      });

      // Handle file operations
      socket.on('file:open', async (filePath: string) => {
        try {
          const state = await this.loadFile(filePath);
          socket.emit('file:loaded', {
            filePath,
            ...state,
          });
        } catch (error) {
          socket.emit('error:parse', {
            filePath,
            message: error instanceof Error ? error.message : 'Parse error',
          });
        }
      });

      socket.on('file:update', async (data: {
        filePath: string;
        nodeId: string;
        updates: any;
      }) => {
        try {
          await this.updateFile(data.filePath, data.nodeId, data.updates);
          socket.emit('file:updated', {
            filePath: data.filePath,
            success: true,
          });
          
          // Broadcast to other clients
          socket.broadcast.emit('file:changed', {
            filePath: data.filePath,
            nodeId: data.nodeId,
            updates: data.updates,
          });
        } catch (error) {
          socket.emit('error:update', {
            filePath: data.filePath,
            message: error instanceof Error ? error.message : 'Update error',
          });
        }
      });

      socket.on('file:save', async (filePath: string) => {
        try {
          await this.saveFile(filePath);
          socket.emit('file:saved', { filePath, success: true });
        } catch (error) {
          socket.emit('error:save', {
            filePath,
            message: error instanceof Error ? error.message : 'Save error',
          });
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('Visual editor disconnected', { socketId: socket.id, reason });
        this.connectedClients.delete(socket.id);
        rateLimitMap.delete(socket.id);
      });
    });
  }

  private async loadFile(filePath: string): Promise<VRNFileState> {
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const vrnFile = this.parser.parse(content);

    // Validate the parsed VRN file
    const validation = this.parser.validateFile({
      tree: vrnFile.tree,
      bindings: vrnFile.bindings,
      raw: content,
      imports: vrnFile.imports,
      exports: vrnFile.exports,
    });

    if (!validation.success) {
      console.warn(`VRN file validation warnings for ${filePath}:`, validation.errors);
      // Continue processing but log warnings
    }

    // Find corresponding logic file
    const logicFilePath = this.logicAnalyzer.findCorrespondingLogicFile(absolutePath);
    let logicFile: ParsedLogicFile | undefined;

    if (logicFilePath) {
      try {
        logicFile = await this.logicAnalyzer.analyzeFile(logicFilePath);
      } catch (error) {
        console.warn(`Failed to analyze logic file ${logicFilePath}:`, error instanceof Error ? error.message : 'Analysis error');
      }
    }

    const state: VRNFileState = {
      vrnFile,
      logicFile,
      lastModified: Date.now(),
    };

    this.fileStates.set(absolutePath, state);
    return state;
  }

  private async updateFile(filePath: string, nodeId: string, updates: any): Promise<void> {
    const state = this.fileStates.get(path.resolve(filePath));
    if (!state) {
      throw new Error(`File not loaded: ${filePath}`);
    }

    // Validate updates if they contain props
    if (updates.props && updates.type) {
      const propsValidation = validateComponentProps(updates.type, updates.props);
      if (!propsValidation.success) {
        throw new Error(`Invalid props for ${updates.type}: ${propsValidation.errors.join(', ')}`);
      }
    }

    // Update the tree
    const updatedTree = this.parser.updateNode(state.vrnFile.tree, nodeId, updates);
    
    // Validate the updated component
    const componentValidation = this.parser.validateComponent({
      id: nodeId,
      type: updates.type || state.vrnFile.tree.type,
      props: updates.props || {},
      children: [],
    });

    if (!componentValidation.success) {
      console.warn(`Component validation failed during update:`, componentValidation.errors);
      // Continue but log warning
    }

    state.vrnFile.tree = updatedTree;
    state.lastModified = Date.now();

    // Regenerate the code
    const newCode = this.parser.serialize(updatedTree, state.vrnFile.bindings);
    state.vrnFile.raw = newCode;
  }

  private async saveFile(filePath: string): Promise<void> {
    const state = this.fileStates.get(path.resolve(filePath));
    if (!state) {
      throw new Error(`File not loaded: ${filePath}`);
    }

    // Write the updated content to disk
    fs.writeFileSync(path.resolve(filePath), state.vrnFile.raw, 'utf-8');
  }

  handleFileChange(uri: vscode.Uri, changeType: 'create' | 'change' | 'delete'): void {
    const filePath = uri.fsPath;

    switch (changeType) {
      case 'change':
        this.reloadFile(filePath);
        break;
      case 'delete':
        this.fileStates.delete(filePath);
        this.broadcastMessage('file:deleted', { filePath });
        break;
      case 'create':
        this.broadcastMessage('file:created', { filePath });
        break;
    }
  }

  handleLogicFileChange(uri: vscode.Uri): void {
    const logicFilePath = uri.fsPath;
    
    // Find corresponding VRN file
    const vrnFilePath = logicFilePath.replace(/\.logic\.(js|ts)$/, '.view.vrn');
    const state = this.fileStates.get(vrnFilePath);

    if (state) {
      // Reload logic analysis
      this.logicAnalyzer.analyzeFile(logicFilePath)
        .then(logicFile => {
          state.logicFile = logicFile;
          state.lastModified = Date.now();
          
          this.broadcastMessage('logic:updated', {
            vrnFilePath,
            logicFile,
          });
        })
        .catch(error => {
          console.error(`Failed to reload logic file ${logicFilePath}:`, error);
          this.broadcastMessage('error:logic', {
            logicFilePath,
            message: error instanceof Error ? error.message : 'Logic reload error',
          });
        });
    }
  }

  private async reloadFile(filePath: string): Promise<void> {
    try {
      const state = await this.loadFile(filePath);
      this.broadcastMessage('file:reloaded', {
        filePath,
        ...state,
      });
    } catch (error) {
      console.error(`Failed to reload file ${filePath}:`, error);
      this.broadcastMessage('error:reload', {
        filePath,
        message: error instanceof Error ? error.message : 'Reload error',
      });
    }
  }

  private broadcastMessage(type: string, payload: any): void {
    if (this.io) {
      this.io.emit(type, payload);
    }
  }

  private getAvailableComponents(): any[] {
    // Return list of available Visual RN components
    return [
      {
        name: 'Screen',
        category: 'Layout',
        props: ['safe', 'scroll', 'bg', 'p'],
      },
      {
        name: 'Stack',
        category: 'Layout',
        props: ['spacing', 'align', 'justify', 'p'],
      },
      {
        name: 'HStack',
        category: 'Layout',
        props: ['spacing', 'align', 'justify'],
      },
      {
        name: 'Text',
        category: 'Typography',
        props: ['variant', 'color', 'align'],
      },
      {
        name: 'Button',
        category: 'Inputs',
        props: ['variant', 'size', 'fullWidth', 'onPress'],
      },
      {
        name: 'Input',
        category: 'Inputs',
        props: ['type', 'placeholder', 'value', 'onChangeText'],
      },
      // Add more components...
    ];
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    if (this.io) {
      this.io.close();
      this.io = null;
    }
    this.logicAnalyzer.dispose();
    this.fileStates.clear();
    this.isRunning = false;
    console.log('VRN Language Server stopped');
  }

  getPort(): number {
    return this.port;
  }

  getAuthToken(): string {
    return this.authToken;
  }

  isServerRunning(): boolean {
    return this.isRunning;
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}