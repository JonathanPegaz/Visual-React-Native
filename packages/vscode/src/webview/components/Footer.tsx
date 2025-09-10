import React from 'react';
import { useEditorStore } from '../store';

export const Footer: React.FC = () => {
  const { 
    isConnected, 
    currentFile, 
    error,
    selectedComponentId 
  } = useEditorStore();

  const getStatus = () => {
    if (error) return { text: `Error: ${error}`, className: 'error' };
    if (!isConnected) return { text: 'Disconnected from server', className: 'disconnected' };
    if (!currentFile) return { text: 'No file loaded', className: 'info' };
    if (selectedComponentId) return { text: `Selected: ${selectedComponentId}`, className: 'info' };
    return { text: 'Ready', className: 'ready' };
  };

  const status = getStatus();

  return (
    <footer className="editor-footer">
      <div className="footer-content">
        <div className={`status ${status.className}`}>
          {status.text}
        </div>
        
        <div className="footer-info">
          {currentFile && (
            <>
              <span className="file-info">
                {currentFile.filePath.split('/').pop()}
              </span>
              <span className="separator">•</span>
              <span className="modified-info">
                Modified: {new Date(currentFile.lastModified).toLocaleTimeString()}
              </span>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};