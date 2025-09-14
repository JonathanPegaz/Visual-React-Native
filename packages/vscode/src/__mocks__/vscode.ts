// Mock VSCode API for production build (Jest not available)
export const workspace = {
  getConfiguration: () => ({
    get: () => {},
    update: () => {},
  }),
  workspaceFolders: [],
  onDidChangeConfiguration: () => {},
};

export const window = {
  showErrorMessage: () => {},
  showWarningMessage: () => {},
  showInformationMessage: () => {},
  createOutputChannel: () => ({
    append: () => {},
    appendLine: () => {},
    show: () => {},
    dispose: () => {},
  }),
};

export const commands = {
  registerCommand: () => {},
  executeCommand: () => {},
};

export const Uri = {
  file: (path: string) => ({ fsPath: path, path }),
  parse: () => {},
};

export const ViewColumn = {
  One: 1,
  Two: 2,
  Three: 3,
};

export const WebviewPanel = () => {};

export const Disposable = {
  from: () => {},
};

export const ExtensionContext = () => {};

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3,
}