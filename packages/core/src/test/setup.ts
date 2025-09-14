/// <reference types="jest" />
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../theme/ThemeProvider';

// Mock React Native completely with DOM elements
jest.mock('react-native', () => {
  const React = require('react');
  
  // Create wrapper components that handle RN props properly
  const View = React.forwardRef((props: any, ref: any) => {
    const { children, style, testID, contentContainerStyle, showsVerticalScrollIndicator, showsHorizontalScrollIndicator, ...rest } = props;
    return React.createElement('div', { ...rest, ref, style, 'data-testid': testID }, children);
  });

  const Text = React.forwardRef((props: any, ref: any) => {
    const { children, style, testID, numberOfLines, ...rest } = props;
    return React.createElement('span', { 
      ...rest, 
      ref, 
      style: { ...style, ...(numberOfLines === 1 && { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }) }, 
      'data-testid': testID 
    }, children);
  });

  const TouchableOpacity = React.forwardRef((props: any, ref: any) => {
    const { children, style, testID, onPress, activeOpacity, disabled, ...rest } = props;
    return React.createElement('button', { 
      ...rest, 
      ref, 
      style, 
      'data-testid': testID,
      onClick: onPress,
      disabled
    }, children);
  });

  const TextInput = React.forwardRef((props: any, ref: any) => {
    const { 
      style, testID, value, onChangeText, placeholder, secureTextEntry, keyboardType, 
      multiline, numberOfLines, editable, placeholderTextColor, autoCorrect, autoCapitalize,
      ...rest 
    } = props;
    const inputType = secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'email' : keyboardType === 'numeric' ? 'number' : 'text';
    
    // Filter out React Native specific props that don't belong on DOM elements
    const { activeOpacity, ...domProps } = rest;
    
    return React.createElement(multiline ? 'textarea' : 'input', { 
      ...domProps, 
      ref, 
      style, 
      'data-testid': testID,
      type: multiline ? undefined : inputType,
      value,
      placeholder,
      disabled: !editable,
      onChange: (e: any) => onChangeText?.(e.target.value),
      rows: multiline ? numberOfLines : undefined,
      autoCapitalize: autoCapitalize === 'none' ? 'off' : undefined,
      autoCorrect: autoCorrect ? 'on' : 'off'
    });
  });

  const Image = React.forwardRef((props: any, ref: any) => {
    const { style, testID, source, onLoad, onError, accessible, accessibilityLabel, ...rest } = props;
    const src = typeof source === 'object' ? source.uri : source;
    
    return React.createElement('img', { 
      ...rest, 
      ref, 
      style, 
      'data-testid': testID,
      src,
      alt: accessible ? accessibilityLabel : undefined,
      onLoad,
      onError
    });
  });

  const ActivityIndicator = React.forwardRef((props: any, ref: any) => {
    const { style, testID, ...rest } = props;
    return React.createElement('div', { 
      ...rest, 
      ref, 
      style, 
      'data-testid': testID,
      role: 'status',
      className: 'loading spinner'
    }, 'Loading...');
  });

  return {
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
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView: View,
    Image,
    KeyboardAvoidingView: View,
    ActivityIndicator,
  };
});

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