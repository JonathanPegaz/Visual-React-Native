import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface VRNComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: VRNComponent[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface ComponentDefinition {
  name: string;
  category: string;
  icon: string;
  props: Record<string, any>;
  bindable?: Record<string, any>;
}

export interface VRNFileState {
  filePath: string;
  tree: VRNComponent | null;
  bindings: Record<string, any>;
  logicFile?: {
    state: Record<string, any>;
    actions: Record<string, any>;
  };
  lastModified: number;
}

export interface EditorState {
  // Connection
  socket: Socket | null;
  isConnected: boolean;
  serverPort: number | null;
  
  // File state
  currentFile: VRNFileState | null;
  
  // Editor state
  selectedComponentId: string | null;
  availableComponents: ComponentDefinition[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connect: (port: number) => void;
  disconnect: () => void;
  loadFile: (filePath: string) => void;
  updateComponent: (componentId: string, updates: Partial<VRNComponent>) => void;
  addComponent: (component: VRNComponent, parentId?: string) => void;
  removeComponent: (componentId: string) => void;
  selectComponent: (componentId: string | null) => void;
  saveFile: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  serverPort: null,
  currentFile: null,
  selectedComponentId: null,
  availableComponents: [],
  isLoading: false,
  error: null,

  // Connection actions
  connect: (port: number) => {
    const socket = io(`http://localhost:${port}`);
    
    socket.on('connect', () => {
      console.log('Connected to VRN Language Server');
      set({ isConnected: true, serverPort: port });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from VRN Language Server');
      set({ isConnected: false });
    });

    socket.on('project:loaded', (data) => {
      set({ availableComponents: data.components || [] });
    });

    socket.on('file:loaded', (data) => {
      const fileState: VRNFileState = {
        filePath: data.filePath,
        tree: data.vrnFile?.tree || null,
        bindings: data.vrnFile?.bindings || {},
        logicFile: data.logicFile,
        lastModified: data.lastModified,
      };
      set({ currentFile: fileState, isLoading: false });
    });

    socket.on('file:updated', (data) => {
      if (data.success) {
        console.log('File updated successfully');
      }
    });

    socket.on('file:saved', (data) => {
      if (data.success) {
        console.log('File saved successfully');
      }
    });

    socket.on('file:changed', (data) => {
      // Handle external file changes
      const { currentFile } = get();
      if (currentFile && currentFile.filePath === data.filePath) {
        get().loadFile(data.filePath);
      }
    });

    socket.on('error:parse', (data) => {
      set({ error: `Parse error: ${data.message}`, isLoading: false });
    });

    socket.on('error:update', (data) => {
      set({ error: `Update error: ${data.message}` });
    });

    socket.on('error:save', (data) => {
      set({ error: `Save error: ${data.message}` });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, serverPort: null });
    }
  },

  // File actions
  loadFile: (filePath: string) => {
    const { socket } = get();
    if (!socket) return;
    
    set({ isLoading: true, error: null });
    socket.emit('file:open', filePath);
  },

  updateComponent: (componentId: string, updates: Partial<VRNComponent>) => {
    const { socket, currentFile } = get();
    if (!socket || !currentFile) return;

    socket.emit('file:update', {
      filePath: currentFile.filePath,
      nodeId: componentId,
      updates,
    });

    // Optimistically update local state
    const updatedTree = updateComponentInTree(currentFile.tree, componentId, updates);
    if (updatedTree) {
      set({
        currentFile: {
          ...currentFile,
          tree: updatedTree,
          lastModified: Date.now(),
        }
      });
    }
  },

  addComponent: (component: VRNComponent, parentId?: string) => {
    const { currentFile } = get();
    if (!currentFile) return;

    // Add component to tree
    const updatedTree = addComponentToTree(currentFile.tree, component, parentId);
    if (updatedTree) {
      set({
        currentFile: {
          ...currentFile,
          tree: updatedTree,
          lastModified: Date.now(),
        }
      });

      // Update component on server
      get().updateComponent(component.id, component);
    }
  },

  removeComponent: (componentId: string) => {
    const { currentFile } = get();
    if (!currentFile) return;

    const updatedTree = removeComponentFromTree(currentFile.tree, componentId);
    if (updatedTree !== currentFile.tree) {
      set({
        currentFile: {
          ...currentFile,
          tree: updatedTree,
          lastModified: Date.now(),
        },
        selectedComponentId: null,
      });
    }
  },

  selectComponent: (componentId: string | null) => {
    set({ selectedComponentId: componentId });
  },

  saveFile: () => {
    const { socket, currentFile } = get();
    if (!socket || !currentFile) return;

    socket.emit('file:save', currentFile.filePath);
  },

  // UI actions
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

// Helper functions
function updateComponentInTree(
  tree: VRNComponent | null,
  componentId: string,
  updates: Partial<VRNComponent>
): VRNComponent | null {
  if (!tree) return null;

  if (tree.id === componentId) {
    return { ...tree, ...updates };
  }

  if (tree.children) {
    const updatedChildren = tree.children.map(child =>
      updateComponentInTree(child, componentId, updates)
    ).filter(Boolean) as VRNComponent[];

    return { ...tree, children: updatedChildren };
  }

  return tree;
}

function addComponentToTree(
  tree: VRNComponent | null,
  component: VRNComponent,
  parentId?: string
): VRNComponent | null {
  if (!tree) {
    return component;
  }

  if (parentId === tree.id) {
    return {
      ...tree,
      children: [...(tree.children || []), component]
    };
  }

  if (tree.children) {
    const updatedChildren = tree.children.map(child =>
      addComponentToTree(child, component, parentId)
    ).filter(Boolean) as VRNComponent[];

    return { ...tree, children: updatedChildren };
  }

  return tree;
}

function removeComponentFromTree(
  tree: VRNComponent | null,
  componentId: string
): VRNComponent | null {
  if (!tree) return null;

  if (tree.id === componentId) {
    return null;
  }

  if (tree.children) {
    const updatedChildren = tree.children
      .map(child => removeComponentFromTree(child, componentId))
      .filter(Boolean) as VRNComponent[];

    return { ...tree, children: updatedChildren };
  }

  return tree;
}