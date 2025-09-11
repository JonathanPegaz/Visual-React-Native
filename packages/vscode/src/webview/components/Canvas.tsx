import React from 'react';
import { useEditorStore } from '../store';
import { ComponentRenderer } from './ComponentRenderer';

function generateId(): string {
  return `vrn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const Canvas: React.FC = () => {
  const { 
    currentFile, 
    selectedComponentId, 
    selectComponent,
    addComponent,
    isConnected 
  } = useEditorStore();

  if (!currentFile) {
    return (
      <main className="canvas-area">
        <div className="canvas">
          <div className="canvas-placeholder">
            <h2>No file loaded</h2>
            <p>Open a .view.vrn file to start editing</p>
          </div>
        </div>
      </main>
    );
  }

  if (!currentFile.tree) {
    return (
      <main className="canvas-area">
        <div className="canvas">
          <div className="canvas-placeholder">
            <h2>Empty file</h2>
            <p>Add components from the left panel to get started</p>
            <p className="file-info">File: {currentFile.filePath}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="canvas-area">
      <div className="canvas-toolbar">
        <div className="toolbar-left">
          <span className="device-selector">
            <select defaultValue="iPhone 14">
              <option>iPhone 14</option>
              <option>iPhone 14 Pro</option>
              <option>Samsung Galaxy S23</option>
              <option>iPad Pro</option>
            </select>
          </span>
        </div>
        <div className="toolbar-right">
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
      </div>
      
      <div 
        className="canvas"
        onClick={(e) => {
          // Deselect when clicking on empty canvas
          if (e.target === e.currentTarget) {
            selectComponent(null);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const data = e.dataTransfer.getData('application/json');
          if (data) {
            try {
              const dropData = JSON.parse(data);
              if (dropData.type === 'component' && dropData.componentDefinition) {
                const componentDef = dropData.componentDefinition;
                const newComponent = {
                  id: generateId(),
                  type: componentDef.name as any,
                  props: { ...componentDef.props },
                  children: [],
                };
                // Add to root if no tree exists, otherwise don't add (will be handled by ComponentRenderer)
                if (!currentFile?.tree) {
                  addComponent(newComponent);
                }
              }
            } catch (error) {
              console.error('Failed to parse drop data:', error);
            }
          }
        }}
      >
        <div className="device-frame">
          <ComponentRenderer 
            component={currentFile.tree}
            isSelected={selectedComponentId === currentFile.tree?.id}
            onSelect={() => selectComponent(currentFile.tree?.id || '')}
          />
        </div>
      </div>
    </main>
  );
};