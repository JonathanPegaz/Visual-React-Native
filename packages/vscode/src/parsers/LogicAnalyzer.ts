import * as babel from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as vscode from 'vscode';
import * as fs from 'fs';

export interface LogicState {
  name: string;
  type: string;
  defaultValue?: any;
  description?: string;
}

export interface LogicAction {
  name: string;
  type: string;
  parameters: Array<{
    name: string;
    type: string;
    optional?: boolean;
  }>;
  returnType?: string;
  description?: string;
}

export interface ParsedLogicFile {
  hookName: string;
  states: LogicState[];
  actions: LogicAction[];
  dependencies: string[];
  exports: string[];
  filePath: string;
}

export class LogicAnalyzer {
  private watchers: Map<string, vscode.FileSystemWatcher> = new Map();

  async analyzeFile(filePath: string): Promise<ParsedLogicFile> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parseLogicContent(content, filePath);
    } catch (error) {
      throw new Error(`Failed to analyze logic file ${filePath}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  parseLogicContent(content: string, filePath: string): ParsedLogicFile {
    const ast = babel.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const dependencies: string[] = [];
    const exports: string[] = [];
    let hookName = '';
    let states: LogicState[] = [];
    let actions: LogicAction[] = [];

    traverse(ast, {
      ImportDeclaration: (path) => {
        dependencies.push(path.node.source.value);
      },

      ExportNamedDeclaration: (path) => {
        if (path.node.declaration) {
          if (t.isFunctionDeclaration(path.node.declaration)) {
            const funcName = path.node.declaration.id?.name;
            if (funcName?.startsWith('use') && funcName.endsWith('Logic')) {
              hookName = funcName;
              exports.push(funcName);
              
              const analysis = this.analyzHook(path.node.declaration);
              states = analysis.states;
              actions = analysis.actions;
            }
          }
        }
      },

      FunctionDeclaration: (path) => {
        if (path.node.id?.name?.startsWith('use') && path.node.id.name.endsWith('Logic')) {
          hookName = path.node.id.name;
          
          const analysis = this.analyzHook(path.node);
          states = analysis.states;
          actions = analysis.actions;
        }
      },
    });

    return {
      hookName,
      states,
      actions,
      dependencies,
      exports,
      filePath,
    };
  }

  private analyzHook(func: t.FunctionDeclaration): { states: LogicState[]; actions: LogicAction[] } {
    const states: LogicState[] = [];
    const actions: LogicAction[] = [];
    const stateVariables = new Set<string>();

    // First pass: find all useState calls
    traverse(func as any, {
      CallExpression: (path) => {
        if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'useState') {
          const parent = path.parent;
          if (t.isVariableDeclarator(parent) && t.isArrayPattern(parent.id)) {
            const [stateVar, ] = parent.id.elements;
            if (t.isIdentifier(stateVar)) {
              const stateName = stateVar.name;
              stateVariables.add(stateName);
              
              const defaultValue = path.node.arguments[0];
              const type = this.inferType(defaultValue);
              
              states.push({
                name: stateName,
                type,
                defaultValue: this.extractValue(defaultValue),
                description: this.extractCommentDescription(path.node),
              });
            }
          }
        }
      },

      VariableDeclarator: (path) => {
        // Find function declarations that might be actions
        if (t.isIdentifier(path.node.id) && 
            (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init))) {
          const funcName = path.node.id.name;
          const func = path.node.init;
          
          // Skip state setters
          if (funcName.startsWith('set') && 
              stateVariables.has(funcName.slice(3).toLowerCase())) {
            return;
          }

          actions.push({
            name: funcName,
            type: 'function',
            parameters: this.extractParameters(func),
            returnType: this.inferReturnType(func),
            description: this.extractCommentDescription(path.node),
          });
        }
      },

      FunctionDeclaration: (path) => {
        if (path.node.id?.name && path.parent === func.body) {
          const funcName = path.node.id.name;
          
          actions.push({
            name: funcName,
            type: 'function',
            parameters: this.extractParameters(path.node),
            returnType: this.inferReturnType(path.node),
            description: this.extractCommentDescription(path.node),
          });
        }
      },
    });

    return { states, actions };
  }

  private inferType(node: t.Node | null | undefined): string {
    if (!node) return 'any';

    if (t.isStringLiteral(node)) return 'string';
    if (t.isNumericLiteral(node)) return 'number';
    if (t.isBooleanLiteral(node)) return 'boolean';
    if (t.isArrayExpression(node)) {
      if (node.elements.length > 0) {
        const firstType = this.inferType(node.elements[0]);
        return `${firstType}[]`;
      }
      return 'any[]';
    }
    if (t.isObjectExpression(node)) return 'object';
    if (t.isNullLiteral(node)) return 'null';

    return 'any';
  }

  private extractValue(node: t.Node | null | undefined): any {
    if (!node) return undefined;

    if (t.isStringLiteral(node)) return node.value;
    if (t.isNumericLiteral(node)) return node.value;
    if (t.isBooleanLiteral(node)) return node.value;
    if (t.isNullLiteral(node)) return null;
    if (t.isArrayExpression(node)) {
      return node.elements.map(el => this.extractValue(el));
    }

    return undefined;
  }

  private extractParameters(func: t.Function): Array<{ name: string; type: string; optional?: boolean }> {
    return func.params.map(param => {
      if (t.isIdentifier(param)) {
        return {
          name: param.name,
          type: 'any', // Would need TypeScript analysis for better types
        };
      }
      if (t.isAssignmentPattern(param) && t.isIdentifier(param.left)) {
        return {
          name: param.left.name,
          type: this.inferType(param.right),
          optional: true,
        };
      }
      return {
        name: 'unknown',
        type: 'any',
      };
    });
  }

  private inferReturnType(func: t.Function): string {
    // Simple heuristic - look for return statements
    let hasAsyncKeyword = false;
    if (t.isFunctionDeclaration(func) || t.isFunctionExpression(func)) {
      hasAsyncKeyword = func.async || false;
    } else if (t.isArrowFunctionExpression(func)) {
      hasAsyncKeyword = func.async || false;
    }

    if (hasAsyncKeyword) {
      return 'Promise<void>';
    }

    return 'void';
  }

  private extractCommentDescription(node: t.Node): string | undefined {
    const comments = (node as any).leadingComments;
    if (comments && comments.length > 0) {
      const comment = comments[0];
      if (comment.type === 'CommentLine') {
        return comment.value.trim();
      } else if (comment.type === 'CommentBlock') {
        return comment.value
          .split('\n')
          .map((line: string) => line.replace(/^\s*\*?\s?/, ''))
          .join(' ')
          .trim();
      }
    }
    return undefined;
  }

  watchFile(filePath: string, callback: (analysis: ParsedLogicFile) => void): void {
    if (this.watchers.has(filePath)) {
      return;
    }

    const watcher = vscode.workspace.createFileSystemWatcher(filePath);
    
    watcher.onDidChange(async () => {
      try {
        const analysis = await this.analyzeFile(filePath);
        callback(analysis);
      } catch (error) {
        console.error(`Failed to re-analyze logic file ${filePath}:`, error);
      }
    });

    this.watchers.set(filePath, watcher);
  }

  stopWatching(filePath: string): void {
    const watcher = this.watchers.get(filePath);
    if (watcher) {
      watcher.dispose();
      this.watchers.delete(filePath);
    }
  }

  dispose(): void {
    for (const watcher of this.watchers.values()) {
      watcher.dispose();
    }
    this.watchers.clear();
  }

  findCorrespondingLogicFile(vrnFilePath: string): string | null {
    // Convert HomeScreen.view.vrn -> HomeScreen.logic.js
    const basePath = vrnFilePath.replace(/\.view\.vrn$/, '');
    
    // Try different extensions
    const possibleExtensions = ['.logic.js', '.logic.ts'];
    
    for (const ext of possibleExtensions) {
      const logicPath = basePath + ext;
      if (fs.existsSync(logicPath)) {
        return logicPath;
      }
    }

    return null;
  }
}