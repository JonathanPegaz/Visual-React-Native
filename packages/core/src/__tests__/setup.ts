import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeProvider';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios' as const,
    select: jest.fn((obj: Record<string, unknown>) => obj['ios'] || obj['default']),
  },
  StyleSheet: {
    create: jest.fn((styles: Record<string, unknown>) => styles),
    flatten: jest.fn((styles: Record<string, unknown>) => styles),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  View: (props: any) => React.createElement('View', props, props.children),
  Text: (props: any) => React.createElement('Text', props, props.children),
  TouchableOpacity: (props: any) => React.createElement('TouchableOpacity', props, props.children),
  TextInput: (props: any) => React.createElement('TextInput', props),
  ScrollView: (props: any) => React.createElement('ScrollView', props, props.children),
  Image: (props: any) => React.createElement('Image', props),
  KeyboardAvoidingView: (props: any) => React.createElement('KeyboardAvoidingView', props, props.children),
  ActivityIndicator: (props: any) => React.createElement('ActivityIndicator', props),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: (props: any) => React.createElement('SafeAreaView', props, props.children),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

afterEach(() => {
  jest.clearAllMocks();
});

// Import React Native components from mock for tests
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Re-export for tests
export { View, Text, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, ActivityIndicator, SafeAreaView };

// Custom render utility
export const customRender = (ui: React.ReactElement, options = {}) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(ThemeProvider, null, children);
  };
  
  return render(ui, { wrapper: AllTheProviders, ...options });
};