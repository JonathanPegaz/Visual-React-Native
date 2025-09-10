import { ReactNode } from 'react';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type Shadow = 'none' | 'sm' | 'md' | 'lg';

export interface UtilityProps {
  // Margin
  m?: Spacing;
  mt?: Spacing;
  mr?: Spacing;
  mb?: Spacing;
  ml?: Spacing;
  mx?: Spacing;
  my?: Spacing;
  
  // Padding
  p?: Spacing;
  pt?: Spacing;
  pr?: Spacing;
  pb?: Spacing;
  pl?: Spacing;
  px?: Spacing;
  py?: Spacing;
  
  // Size
  w?: number | string;
  h?: number | string;
  minW?: number | string;
  maxW?: number | string;
  minH?: number | string;
  maxH?: number | string;
  
  // Flex
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  
  // Visual
  bg?: string;
  opacity?: number;
  rounded?: Radius;
}

export interface ThemeTokens {
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    text: string;
    textLight: string;
    surface: string;
    background: string;
    border: string;
    dark?: {
      text: string;
      surface: string;
      background: string;
      border: string;
    };
  };
  spacing: Record<number, number>;
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
    label: TextStyle;
  };
  radius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    none: null;
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
  };
}

export interface ComponentMetadata {
  type: string;
  category: string;
  icon?: string;
  props: Record<string, PropMetadata>;
  bindable?: Record<string, BindableMetadata>;
  container?: boolean;
  acceptsChildren?: boolean;
  preview?: {
    width?: number | 'auto';
    height?: number | 'auto';
    minWidth?: number;
    minHeight?: number;
  };
}

export interface PropMetadata {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'color' | 'spacing';
  options?: string[];
  default?: any;
  preview?: boolean;
  inline?: boolean;
  required?: boolean;
}

export interface BindableMetadata {
  type: 'state' | 'action';
  valueType?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
}

export interface VRNComponent<P = {}> extends React.FC<P> {
  __vrn__?: ComponentMetadata;
}

export interface BaseComponentProps extends UtilityProps {
  children?: ReactNode;
  style?: ViewStyle | TextStyle | ImageStyle;
  testID?: string;
}