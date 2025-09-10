// Basic webview interface for the Visual Editor
// This will be expanded in the next phase with React

declare global {
  interface Window {
    vscode: any;
    visualRNEditor: any;
    filePath: string;
    pendingMessages: any[];
  }
}

class VisualRNEditor {
  private container: HTMLElement;
  private currentTree: any = null;
  private serverPort: number | null = null;
  private socket: any = null;

  constructor() {
    this.container = document.getElementById('root')!;
    this.init();
  }

  private async init() {
    // Initialize the basic UI
    this.container.innerHTML = `
      <div class="editor-layout">
        <header class="editor-header">
          <h1>Visual RN Editor</h1>
          <div class="editor-actions">
            <button id="save-btn" class="btn btn-primary">Save</button>
            <button id="logic-btn" class="btn btn-secondary">Open Logic</button>
          </div>
        </header>
        
        <div class="editor-body">
          <aside class="components-panel">
            <h3>Components</h3>
            <div class="component-list" id="component-list">
              <div class="loading">Loading components...</div>
            </div>
          </aside>
          
          <main class="canvas-area">
            <div class="canvas" id="canvas">
              <div class="canvas-placeholder">
                <p>Loading visual editor...</p>
                <p class="canvas-info">File: ${window.filePath}</p>
              </div>
            </div>
          </main>
          
          <aside class="properties-panel">
            <h3>Properties</h3>
            <div class="properties-content" id="properties">
              <p>Select a component to edit properties</p>
            </div>
          </aside>
        </div>
        
        <footer class="editor-footer">
          <div class="status">Ready</div>
        </footer>
      </div>
    `;

    // Setup event listeners
    this.setupEventListeners();

    // Connect to language server
    await this.connectToServer();

    // Process any pending messages
    if (window.pendingMessages) {
      for (const message of window.pendingMessages) {
        this.handleMessage(message);
      }
      window.pendingMessages = [];
    }
  }

  private setupEventListeners() {
    // Save button
    document.getElementById('save-btn')?.addEventListener('click', () => {
      this.save();
    });

    // Logic button
    document.getElementById('logic-btn')?.addEventListener('click', () => {
      this.openLogicFile();
    });
  }

  private async connectToServer() {
    try {
      // For now, just simulate connection
      // In the real implementation, this would connect to the WebSocket server
      console.log('Connecting to Visual RN Language Server...');
      
      // Simulate loading components
      setTimeout(() => {
        this.loadComponents();
      }, 1000);
      
      // Update status
      const statusEl = document.querySelector('.status');
      if (statusEl) {
        statusEl.textContent = 'Connected to Language Server';
      }
    } catch (error) {
      console.error('Failed to connect to language server:', error);
      
      const statusEl = document.querySelector('.status');
      if (statusEl) {
        statusEl.textContent = 'Failed to connect to Language Server';
      }
    }
  }

  private loadComponents() {
    const componentList = document.getElementById('component-list');
    if (!componentList) return;

    const components = [
      { name: 'Screen', category: 'Layout', icon: '🖼️' },
      { name: 'Stack', category: 'Layout', icon: '📚' },
      { name: 'HStack', category: 'Layout', icon: '➡️' },
      { name: 'Text', category: 'Typography', icon: '📝' },
      { name: 'Button', category: 'Inputs', icon: '🔘' },
      { name: 'Input', category: 'Inputs', icon: '📝' },
      { name: 'Card', category: 'Containers', icon: '🃏' },
      { name: 'Avatar', category: 'Media', icon: '👤' },
      { name: 'Image', category: 'Media', icon: '🖼️' },
      { name: 'Divider', category: 'Layout', icon: '—' },
    ];

    const groupedComponents = components.reduce((acc, comp) => {
      if (!acc[comp.category]) {
        acc[comp.category] = [];
      }
      acc[comp.category].push(comp);
      return acc;
    }, {} as Record<string, typeof components>);

    componentList.innerHTML = Object.entries(groupedComponents)
      .map(([category, components]) => `
        <div class="component-category">
          <h4>${category}</h4>
          <div class="component-items">
            ${components.map(comp => `
              <div class="component-item" data-component="${comp.name}">
                <span class="component-icon">${comp.icon}</span>
                <span class="component-name">${comp.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

    // Add drag listeners (simplified for now)
    componentList.querySelectorAll('.component-item').forEach(item => {
      item.addEventListener('click', () => {
        const componentName = item.getAttribute('data-component');
        this.addComponent(componentName!);
      });
    });
  }

  private addComponent(componentName: string) {
    console.log(`Adding component: ${componentName}`);
    // This would integrate with the tree structure
    
    const canvas = document.getElementById('canvas');
    if (canvas) {
      // Simple placeholder implementation
      const placeholder = canvas.querySelector('.canvas-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="component-preview">
            <h3>Component: ${componentName}</h3>
            <p>Visual editing will be available in the next phase</p>
          </div>
        `;
      }
    }
  }

  public handleMessage(message: any) {
    switch (message.type) {
      case 'update':
        this.handleFileUpdate(message.text, message.filePath);
        break;
      
      case 'tree':
        this.handleTreeUpdate(message.tree);
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleFileUpdate(content: string, filePath: string) {
    console.log('File updated:', filePath);
    
    // Update the canvas with file info
    const canvas = document.getElementById('canvas');
    if (canvas) {
      const infoEl = canvas.querySelector('.canvas-info');
      if (infoEl) {
        infoEl.textContent = `File: ${filePath} (${content.length} chars)`;
      }
    }
  }

  private handleTreeUpdate(tree: any) {
    this.currentTree = tree;
    console.log('Tree updated:', tree);
    
    // Update the visual representation
    this.renderTree(tree);
  }

  private renderTree(tree: any) {
    // Simplified tree rendering
    const canvas = document.getElementById('canvas');
    if (canvas && tree) {
      canvas.innerHTML = `
        <div class="tree-view">
          <h3>Component Tree</h3>
          <pre>${JSON.stringify(tree, null, 2)}</pre>
        </div>
      `;
    }
  }

  private save() {
    window.vscode.postMessage({
      type: 'save'
    });
    
    const statusEl = document.querySelector('.status');
    if (statusEl) {
      statusEl.textContent = 'Saving...';
      setTimeout(() => {
        statusEl.textContent = 'Saved';
      }, 1000);
    }
  }

  private openLogicFile() {
    window.vscode.postMessage({
      type: 'openLogicFile'
    });
  }
}

// Initialize the editor when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.visualRNEditor = new VisualRNEditor();
  });
} else {
  window.visualRNEditor = new VisualRNEditor();
}