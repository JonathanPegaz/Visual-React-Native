import * as vscode from 'vscode';
import * as path from 'path';

export class VisualEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'visual-rn.editor';

  constructor(private readonly context: vscode.ExtensionContext) {}

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
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'index.js')
    );

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'webview', 'index.css')
    );

    // Get nonce for security
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}' 'unsafe-eval'; connect-src ws://localhost:*;">
    <link href="${styleUri}" rel="stylesheet">
    <title>Visual RN Editor</title>
</head>
<body>
    <div id="root">
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading Visual Editor...</p>
        </div>
    </div>

    <script nonce="${nonce}">
        window.vscode = acquireVsCodeApi();
        window.filePath = '${document.uri.fsPath}';
        
        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (window.visualRNEditor) {
                window.visualRNEditor.handleMessage(message);
            } else {
                // Store messages until editor is ready
                window.pendingMessages = window.pendingMessages || [];
                window.pendingMessages.push(message);
            }
        });

        // Notify extension that webview is ready
        window.vscode.postMessage({ type: 'ready' });
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
      vscode.window.showErrorMessage(`Failed to create ${componentType}: ${error.message}`);
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
}