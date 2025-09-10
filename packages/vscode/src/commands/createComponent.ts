import * as vscode from 'vscode';
import * as path from 'path';

export async function createComponent(): Promise<void> {
  // Get component name from user
  const componentName = await vscode.window.showInputBox({
    prompt: 'Enter component name (e.g., CustomCard, UserAvatar)',
    placeholder: 'ComponentName',
    validateInput: (value: string) => {
      if (!value || value.trim().length === 0) {
        return 'Component name is required';
      }
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(value.trim())) {
        return 'Component name must start with uppercase letter and contain only letters and numbers';
      }
      return null;
    }
  });

  if (!componentName) {
    return; // User cancelled
  }

  // Ask for component type
  const componentType = await vscode.window.showQuickPick([
    {
      label: 'Functional Component',
      description: 'Standard React functional component',
      value: 'functional'
    },
    {
      label: 'Visual RN Component',
      description: 'Component with Visual RN metadata for visual editing',
      value: 'vrn'
    }
  ], {
    placeHolder: 'Select component type'
  });

  if (!componentType) {
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
    value: 'src/components',
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
      name: 'Visual RN - Create Component',
      cwd: workspaceRoot
    });

    terminal.sendText(`visual-rn create component ${componentName} --directory "${outputDir}"`);
    terminal.show();

    // Show success message after a delay
    setTimeout(() => {
      vscode.window.showInformationMessage(
        `Component ${componentName} created successfully!`,
        'Open File'
      ).then(selection => {
        if (selection === 'Open File') {
          // Open the created component file
          const componentFile = path.join(workspaceRoot, outputDir, `${componentName}.js`);
          vscode.workspace.openTextDocument(componentFile).then(doc => {
            vscode.window.showTextDocument(doc);
          });
        }
      });
    }, 2000);

  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create component: ${error.message}`);
  }
}