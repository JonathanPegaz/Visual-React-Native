import * as vscode from 'vscode';
import * as path from 'path';

export async function createScreen(): Promise<void> {
  // Get screen name from user
  const screenName = await vscode.window.showInputBox({
    prompt: 'Enter screen name (e.g., Login, Profile, Settings)',
    placeholder: 'ScreenName',
    validateInput: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'Screen name is required';
      }
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value.trim())) {
        return 'Screen name must start with uppercase letter and contain only letters and numbers';
      }
      return null;
    }
  });

  if (!screenName) {
    return; // User cancelled
  }

  // Get current workspace folder
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;

  // Ask for output directory
  const outputDir = await vscode.window.showInputBox({
    prompt: 'Choose output directory',
    value: path.join('src', 'screens', screenName),
    validateInput: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'Output directory is required';
      }
      return null;
    }
  });

  if (!outputDir) {
    return; // User cancelled
  }

  try {
    // Use terminal to run the CLI command
    const terminal = vscode.window.createTerminal({
      name: 'Visual RN - Create Screen',
      cwd: workspaceRoot
    });

    terminal.sendText(`visual-rn create screen ${screenName} --directory "${outputDir}"`);
    terminal.show();

    // Show success message after a delay
    setTimeout(() => {
      vscode.window.showInformationMessage(
        `Screen ${screenName} created successfully!`,
        'Open Files'
      ).then(selection => {
        if (selection === 'Open Files') {
          // Open the created files
          const basePath = path.join(workspaceRoot, outputDir);
          const vrnFile = path.join(basePath, `${screenName}.view.vrn`);
          const logicFile = path.join(basePath, `${screenName}.logic.js`);

          vscode.workspace.openTextDocument(vrnFile).then(doc => {
            vscode.window.showTextDocument(doc);
          });

          // Open logic file in second column
          setTimeout(() => {
            vscode.workspace.openTextDocument(logicFile).then(doc => {
              vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
            });
          }, 500);
        }
      });
    }, 2000);

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create screen: ${error.message}`);
  }
}