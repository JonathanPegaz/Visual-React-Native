/// <reference types="jest" />
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../theme/ThemeProvider';

// Mock React Native completely with DOM elements
jest.mock('react-native', () => ({
  Platform: {
    OS: 'web',
    select: (specifics: any) => specifics.web || specifics.default,
  },
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: (style: any) => style,
  },
  Dimensions: {
    get: () => ({ width: 375, height: 812 }),
  },
  View: 'div',
  Text: 'span',
  TouchableOpacity: 'button',
  TextInput: 'input',
  ScrollView: 'div',
  Image: 'img',
  KeyboardAvoidingView: 'div',
  ActivityIndicator: 'div',
}));

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: 'div',
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Cleanup
afterEach(() => {
  jest.clearAllMocks();
});

// Custom render utility
export const customRender = (ui: React.ReactElement, options = {}) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(ThemeProvider, null, children);
  };
  
  return render(ui, { wrapper: AllTheProviders, ...options });
};