// Shared types for webview components
// These types mirror the main schemas but are specifically for the webview context

export interface VRNComponent {
  id: string;
  type: 'Screen' | 'Stack' | 'HStack' | 'Grid' | 'Text' | 'Button' | 'Input' | 'Image' | 'Avatar' | 'Card' | 'Divider';
  props?: Record<string, unknown>;
  children?: VRNComponent[];
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface ComponentDefinition {
  name: string;
  category: 'Layout' | 'Typography' | 'Inputs' | 'Media' | 'Containers';
  icon: string;
  props: Record<string, {
    type: string;
    default?: unknown;
    required?: boolean;
    options?: unknown[];
  }>;
  bindable?: string[];
}

export interface LogicBindings {
  state: Record<string, {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    value?: unknown;
  }>;
  actions: Record<string, {
    name: string;
    type: 'function';
    parameters?: { name: string; type: string }[];
  }>;
}

export interface VRNFileState {
  filePath: string;
  tree: VRNComponent | null;
  bindings: LogicBindings;
  logicFile?: {
    state: Record<string, { type: string; value?: unknown }>;
    actions: Record<string, { type: 'function'; parameters?: { name: string; type: string }[] }>;
  };
  lastModified: number;
}

export interface EditorState {
  // Connection
  socket: any | null; // Socket type from socket.io-client
  isConnected: boolean;
  serverPort: number | null;
  authToken: string | null;
  
  // File state
  currentFile: VRNFileState | null;
  
  // Editor state
  selectedComponentId: string | null;
  availableComponents: ComponentDefinition[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  connect: (port: number, authToken: string) => void;
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