import { ThemeTokens } from '../types';

export const defaultTokens: ThemeTokens = {
  colors: {
    // Brand colors
    primary: '#007AFF',
    primaryDark: '#0051D5',
    secondary: '#5856D6',
    
    // Semantic colors
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    info: '#5AC8FA',
    
    // Neutral colors
    text: '#000000',
    textLight: '#8E8E93',
    surface: '#FFFFFF',
    background: '#F2F2F7',
    border: '#C6C6C8',
    
    // Dark mode colors
    dark: {
      text: '#FFFFFF',
      surface: '#1C1C1E',
      background: '#000000',
      border: '#38383A',
    },
  },
  
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 'bold' as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'normal' as const,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: 'normal' as const,
    },
    label: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
    },
  },
  
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  shadows: {
    none: null,
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};