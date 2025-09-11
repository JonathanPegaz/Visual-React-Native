// Mock VSCode API for testing
const jest = require('jest');

export const workspace = {
  getConfiguration: jest.fn(() => ({
    get: jest.fn(),
    update: jest.fn(),
  })),
  workspaceFolders: [],
  onDidChangeConfiguration: jest.fn(),
};

export const window = {
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  showInformationMessage: jest.fn(),
  createOutputChannel: jest.fn(() => ({
    append: jest.fn(),
    appendLine: jest.fn(),
    show: jest.fn(),
    dispose: jest.fn(),
  })),
};

export const commands = {
  registerCommand: jest.fn(),
  executeCommand: jest.fn(),
};

export const Uri = {
  file: jest.fn((path: string) => ({ fsPath: path, path })),
  parse: jest.fn(),
};

export const ViewColumn = {
  One: 1,
  Two: 2,
  Three: 3,
};

export const WebviewPanel = jest.fn();

export const Disposable = {
  from: jest.fn(),
};

export const ExtensionContext = jest.fn();

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3,
}