import { Socket } from 'socket.io-client';
export interface VRNComponent {
    id: string;
    type: string;
    props: Record<string, any>;
    children?: VRNComponent[];
    position?: {
        x: number;
        y: number;
    };
    size?: {
        width: number;
        height: number;
    };
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
    socket: Socket | null;
    isConnected: boolean;
    serverPort: number | null;
    authToken: string | null;
    currentFile: VRNFileState | null;
    selectedComponentId: string | null;
    availableComponents: ComponentDefinition[];
    isLoading: boolean;
    error: string | null;
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
export declare const useEditorStore: import("zustand").UseBoundStore<import("zustand").StoreApi<EditorState>>;
//# sourceMappingURL=store.d.ts.map