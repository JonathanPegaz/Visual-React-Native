import * as vscode from 'vscode';
import { VisualEditorProvider } from './providers/VisualEditorProvider';
import { VRNLanguageServer } from './server/VRNLanguageServer';
import { openVisualEditor } from './commands/openVisualEditor';
import { createScreen } from './commands/createScreen';
import { createComponent } from './commands/createComponent';

let languageServer: VRNLanguageServer | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Visual RN Editor extension is now active');

    // Initialize language server for .vrn files
    languageServer = new VRNLanguageServer(context);
    languageServer.start();

    // Register custom editor provider for .view.vrn files
    const editorProvider = new VisualEditorProvider(
        context, 
        () => languageServer?.getPort() || 0
    );
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            VisualEditorProvider.viewType,
            editorProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                    enableScripts: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('visual-rn.openEditor', openVisualEditor),
        vscode.commands.registerCommand('visual-rn.createScreen', createScreen),
        vscode.commands.registerCommand('visual-rn.createComponent', createComponent)
    );

    // Register file watchers
    const vrnWatcher = vscode.workspace.createFileSystemWatcher('**/*.view.vrn');
    const logicWatcher = vscode.workspace.createFileSystemWatcher('**/*.logic.{js,ts}');

    vrnWatcher.onDidChange((uri) => {
        languageServer?.handleFileChange(uri, 'change');
    });

    vrnWatcher.onDidCreate((uri) => {
        languageServer?.handleFileChange(uri, 'create');
    });

    vrnWatcher.onDidDelete((uri) => {
        languageServer?.handleFileChange(uri, 'delete');
    });

    logicWatcher.onDidChange((uri) => {
        languageServer?.handleLogicFileChange(uri);
    });

    context.subscriptions.push(vrnWatcher, logicWatcher);

    // Add to status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(paintcan) Visual RN';
    statusBarItem.tooltip = 'Visual React Native Editor';
    statusBarItem.command = 'visual-rn.openEditor';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
    if (languageServer) {
        languageServer.stop();
        languageServer = undefined;
    }
}