import * as vscode from 'vscode';
import * as http from 'http';
import { Server as SocketServer } from 'socket.io';
import * as path from 'path';
import * as fs from 'fs';
import { VRNParser, ParsedVRNFile } from '../parsers/VRNParser';
import { LogicAnalyzer, ParsedLogicFile } from '../parsers/LogicAnalyzer';

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

  constructor(private context: vscode.ExtensionContext) {}

  async start(): Promise<number> {
    if (this.isRunning) {
      return this.port;
    }

    return new Promise((resolve, reject) => {
      this.server = http.createServer();
      this.io = new SocketServer(this.server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
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

    this.io.on('connection', (socket) => {
      console.log('Visual editor connected');

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
            message: error.message,
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
            message: error.message,
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
            message: error.message,
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Visual editor disconnected');
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

    // Find corresponding logic file
    const logicFilePath = this.logicAnalyzer.findCorrespondingLogicFile(absolutePath);
    let logicFile: ParsedLogicFile | undefined;

    if (logicFilePath) {
      try {
        logicFile = await this.logicAnalyzer.analyzeFile(logicFilePath);
      } catch (error) {
        console.warn(`Failed to analyze logic file ${logicFilePath}:`, error.message);
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

    // Update the tree
    const updatedTree = this.parser.updateNode(state.vrnFile.tree, nodeId, updates);
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
            message: error.message,
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
        message: error.message,
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

  isServerRunning(): boolean {
    return this.isRunning;
  }
}