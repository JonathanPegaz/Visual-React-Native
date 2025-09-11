import React, { useEffect } from 'react';
import { useEditorStore } from '../store';
import { Header } from './Header';
import { ComponentsPanel } from './ComponentsPanel';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { Footer } from './Footer';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const VisualEditor: React.FC = () => {
  const {
    connect,
    loadFile,
    isLoading,
    error,
    setError,
  } = useEditorStore();

  useEffect(() => {
    // Get initial data from window (set by extension) or body data attributes
    let serverPort = window.serverPort;
    let authToken = window.authToken;
    let filePath = window.filePath;

    // Fallback to data attributes if window variables are not set (for security)
    if (!serverPort || !authToken || !filePath) {
      const body = document.body;
      serverPort = serverPort || body.getAttribute('data-server-port');
      authToken = authToken || body.getAttribute('data-auth-token');
      filePath = filePath || body.getAttribute('data-file-path');
    }

    if (serverPort && authToken && parseInt(serverPort)) {
      connect(parseInt(serverPort), authToken);
    }

    // Connect to VSCode API
    if (window.vscode) {
      window.visualRNEditor = {
        handleMessage: (message: any) => {
          switch (message.type) {
            case 'loadFile':
              if (message.filePath) {
                loadFile(message.filePath);
              }
              break;
            case 'error':
              setError(message.message);
              break;
            default:
              console.log('Unknown message:', message);
          }
        }
      };

      // Process pending messages
      if (window.pendingMessages?.length) {
        window.pendingMessages.forEach(message => {
          window.visualRNEditor.handleMessage(message);
        });
        window.pendingMessages = [];
      }

      // Load initial file
      if (filePath) {
        loadFile(filePath);
      }
    }
  }, []);

  if (error) {
    return <ErrorMessage message={error} onDismiss={() => setError(null)} />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading visual editor..." />;
  }

  return (
    <div className="visual-editor">
      <Header />
      <div className="editor-body">
        <ComponentsPanel />
        <Canvas />
        <PropertiesPanel />
      </div>
      <Footer />
    </div>
  );
};

// Extend window interface
declare global {
  interface Window {
    vscode: any;
    visualRNEditor: any;
    filePath: string;
    serverPort: string;
    authToken: string;
    pendingMessages: any[];
  }
}