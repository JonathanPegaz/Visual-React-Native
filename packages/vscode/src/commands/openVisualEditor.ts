import * as vscode from 'vscode';
import { VisualEditorProvider } from '../providers/VisualEditorProvider';

export async function openVisualEditor(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  
  if (!activeEditor) {
    vscode.window.showErrorMessage('No active file to open in Visual Editor');
    return;
  }

  const document = activeEditor.document;
  const fileName = document.fileName;

  // Check if this is a .vrn file
  if (!fileName.endsWith('.view.vrn')) {
    vscode.window.showErrorMessage('Visual Editor only supports .view.vrn files');
    return;
  }

  try {
    // Open the file with our custom editor
    await vscode.commands.executeCommand(
      'vscode.openWith',
      document.uri,
      VisualEditorProvider.viewType
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open Visual Editor: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}