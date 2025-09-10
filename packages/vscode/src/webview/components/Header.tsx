import React from 'react';
import { useEditorStore } from '../store';

export const Header: React.FC = () => {
  const {
    currentFile,
    isConnected,
    saveFile,
  } = useEditorStore();

  const handleSave = () => {
    if (window.vscode) {
      window.vscode.postMessage({ type: 'save' });
    }
    saveFile();
  };

  const handleOpenLogic = () => {
    if (window.vscode) {
      window.vscode.postMessage({ type: 'openLogicFile' });
    }
  };

  return (
    <header className="editor-header">
      <div className="editor-title">
        <h1>Visual RN Editor</h1>
        {currentFile && (
          <span className="file-path">{currentFile.filePath}</span>
        )}
      </div>
      
      <div className="editor-actions">
        <button 
          className="btn btn-secondary" 
          onClick={handleOpenLogic}
          disabled={!currentFile}
        >
          Open Logic
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={!currentFile || !isConnected}
        >
          Save
        </button>
      </div>
    </header>
  );
};