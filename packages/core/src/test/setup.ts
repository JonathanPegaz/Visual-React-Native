/// <reference types="jest" />
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeProvider';

// Mock React Native completely to avoid Flow import issues
jest.mock('react-native', () => {
  const React = require('react');
  
  const mockComponent = (name: string) => {
    const Component = (props: any) => {
      const { children, ...rest } = props;
      return React.createElement('div', { 
        ...rest, 
        'data-testid': name.toLowerCase(),
        className: name
      }, children);
    };
    Component.displayName = name;
    return Component;
  };

  return {
    Platform: {
      OS: 'ios',
      select: (specifics: any) => specifics.ios || specifics.default,
    },
    StyleSheet: {
      create: (identity: any) => identity,
      flatten: (identity: any) => identity,
    },
    Dimensions: {
      get: () => ({ width: 375, height: 812 }),
    },
    View: mockComponent('View'),
    Text: mockComponent('Text'),
    TouchableOpacity: mockComponent('TouchableOpacity'),
    TextInput: mockComponent('TextInput'),
    ScrollView: mockComponent('ScrollView'),
    Image: mockComponent('Image'),
    KeyboardAvoidingView: mockComponent('KeyboardAvoidingView'),
    ActivityIndicator: mockComponent('ActivityIndicator'),
  };
});

// Mock React Native animated helper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: (props: any) => {
      const { children, ...rest } = props;
      return React.createElement('div', {
        ...rest,
        'data-testid': 'safeareaview',
        className: 'SafeAreaView'
      }, children);
    },
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

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