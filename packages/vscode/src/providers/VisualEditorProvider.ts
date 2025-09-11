import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class VisualEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'visual-rn.editor';

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly getServerPort: () => number,
    private readonly getAuthToken: () => string
  ) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial webview options
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.context.extensionUri, 'webview')
      ]
    };

    // Set the webview's initial html content
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document);

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: 'update',
        text: document.getText(),
        filePath: document.uri.fsPath,
      });
    }

    // Hook up event handlers
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    // Handle messages from the webview
    webviewPanel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'ready':
          // Webview is ready, send initial content
          updateWebview();
          break;

        case 'edit':
          // Handle edit from visual editor
          await this.handleEdit(document, message.edit);
          break;

        case 'save':
          // Save the document
          await document.save();
          break;

        case 'openLogicFile':
          // Open corresponding logic file
          await this.openLogicFile(document.uri);
          break;

        case 'createComponent':
          // Create new component
          await this.createComponent(message.componentType, message.name);
          break;
      }
    });

    // Make sure we get rid of the listener when our editor is closed
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Send initial content
    updateWebview();
  }

  private getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): string {
    try {
      // Try to use the webpack-generated HTML
      const htmlPath = path.join(this.context.extensionPath, 'webview', 'index.html');
      
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf-8');
        
        // Replace template variables
        html = html.replace(/<%= htmlWebpackPlugin\.options\.filePath %>/g, document.uri.fsPath);
        html = html.replace(/<%= htmlWebpackPlugin\.options\.serverPort %>/g, this.getServerPort().toString());
        html = html.replace(/<%= htmlWebpackPlugin\.options\.authToken %>/g, this.getAuthToken());
        
        // Update CSP and convert URIs
        const scriptMatches = html.match(/src="([^"]+\.js)"/g) || [];
        const styleMatches = html.match(/href="([^"]+\.css)"/g) || [];
        
        scriptMatches.forEach(match => {
          const src = match.match(/src="([^"]+)"/)?.[1];
          if (src) {
            const scriptUri = webview.asWebviewUri(
              vscode.Uri.joinPath(this.context.extensionUri, 'webview', src)
            );
            html = html.replace(match, `src="${scriptUri}"`);
          }
        });
        
        styleMatches.forEach(match => {
          const href = match.match(/href="([^"]+)"/)?.[1];
          if (href) {
            const styleUri = webview.asWebviewUri(
              vscode.Uri.joinPath(this.context.extensionUri, 'webview', href)
            );
            html = html.replace(match, `href="${styleUri}"`);
          }
        });
        
        // Update CSP - Remove unsafe-inline and unsafe-eval
        const nonce = this.getNonce();
        html = html.replace(
          /content="[^"]*"/,
          `content="default-src 'none'; style-src ${webview.cspSource}; script-src ${webview.cspSource} 'nonce-${nonce}'; connect-src ws://localhost:* wss://localhost:* http://localhost:* https://localhost:*; img-src ${webview.cspSource} data: https:;"`
        );
        
        // Add nonce to inline scripts
        html = html.replace(/<script>/g, `<script nonce="${nonce}">`);
        html = html.replace(/<script ([^>]*?)>/g, `<script nonce="${nonce}" $1>`);
        
        // Replace inline script variables with data attributes
        html = html.replace(
          /window\.filePath\s*=\s*['"][^'"]*['"]/g,
          ''
        );
        html = html.replace(
          /window\.serverPort\s*=\s*['"][^'"]*['"]/g,
          ''
        );
        html = html.replace(
          /window\.authToken\s*=\s*['"][^'"]*['"]/g,
          ''
        );
        
        // Add data attributes to body
        html = html.replace(
          /<body([^>]*)>/,
          `<body$1 data-file-path="${this.escapeHtml(document.uri.fsPath)}" data-server-port="${this.getServerPort()}" data-auth-token="${this.escapeHtml(this.getAuthToken())}">`
        );
        
        return html;
      }
    } catch (error) {
      console.error('Failed to load webpack-generated HTML, falling back to manual HTML:', error);
    }
    
    // Fallback to manual HTML generation
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'index.js')
    );

    const nonce = this.getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src ${webview.cspSource} 'nonce-${nonce}'; connect-src ws://localhost:* wss://localhost:* http://localhost:* https://localhost:*; img-src ${webview.cspSource} data: https:;">
    <title>Visual RN Editor</title>
    <style>
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            gap: 16px;
            font-family: 'Segoe UI', sans-serif;
        }
        .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #333;
            border-top: 3px solid #007acc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        .loading-text {
            color: #888;
        }
    </style>
</head>
<body data-file-path="${this.escapeHtml(document.uri.fsPath)}" data-server-port="${this.getServerPort()}" data-auth-token="${this.escapeHtml(this.getAuthToken())}">
    <div id="root">
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Loading Visual Editor...</p>
        </div>
    </div>

    <script nonce="${nonce}">
        window.vscode = acquireVsCodeApi();
        // Get data from body attributes instead of inline variables
        const body = document.body;
        window.filePath = body.getAttribute('data-file-path');
        window.serverPort = body.getAttribute('data-server-port');
        window.authToken = body.getAttribute('data-auth-token');
        window.pendingMessages = [];
        
        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (window.visualRNEditor) {
                window.visualRNEditor.handleMessage(message);
            } else {
                window.pendingMessages.push(message);
            }
        });
    </script>
    
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  private async handleEdit(document: vscode.TextDocument, edit: any): Promise<void> {
    const workspaceEdit = new vscode.WorkspaceEdit();

    // Apply the edit to the document
    if (edit.type === 'replace') {
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );
      workspaceEdit.replace(document.uri, fullRange, edit.content);
    } else if (edit.type === 'insert') {
      const position = document.positionAt(edit.offset);
      workspaceEdit.insert(document.uri, position, edit.content);
    } else if (edit.type === 'delete') {
      const startPos = document.positionAt(edit.start);
      const endPos = document.positionAt(edit.end);
      const range = new vscode.Range(startPos, endPos);
      workspaceEdit.delete(document.uri, range);
    }

    // Apply the workspace edit
    await vscode.workspace.applyEdit(workspaceEdit);
  }

  private async openLogicFile(vrnUri: vscode.Uri): Promise<void> {
    // Convert HomeScreen.view.vrn -> HomeScreen.logic.js
    const basePath = vrnUri.fsPath.replace(/\.view\.vrn$/, '');
    const logicPath = basePath + '.logic.js';

    try {
      const logicUri = vscode.Uri.file(logicPath);
      const document = await vscode.workspace.openTextDocument(logicUri);
      await vscode.window.showTextDocument(document, {
        viewColumn: vscode.ViewColumn.Beside
      });
    } catch (error) {
      // Try .ts extension
      const tsLogicPath = basePath + '.logic.ts';
      try {
        const logicUri = vscode.Uri.file(tsLogicPath);
        const document = await vscode.workspace.openTextDocument(logicUri);
        await vscode.window.showTextDocument(document, {
          viewColumn: vscode.ViewColumn.Beside
        });
      } catch (tsError) {
        vscode.window.showErrorMessage(`No logic file found for ${path.basename(vrnUri.fsPath)}`);
      }
    }
  }

  private async createComponent(componentType: string, name: string): Promise<void> {
    try {
      // Use the CLI command to create component
      const terminal = vscode.window.createTerminal('Visual RN');
      terminal.sendText(`visual-rn create ${componentType} ${name}`);
      terminal.show();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create ${componentType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}