import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeTokens } from '../types';
import { defaultTokens } from './tokens';

export interface ThemeContextValue {
  tokens: ThemeTokens;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  tokens?: Partial<ThemeTokens>;
  darkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  tokens: customTokens,
  darkMode = false,
}) => {
  const mergedTokens: ThemeTokens = React.useMemo(() => {
    if (!customTokens) return defaultTokens;
    
    return {
      colors: { ...defaultTokens.colors, ...customTokens.colors },
      spacing: { ...defaultTokens.spacing, ...customTokens.spacing },
      typography: { ...defaultTokens.typography, ...customTokens.typography },
      radius: { ...defaultTokens.radius, ...customTokens.radius },
      shadows: { ...defaultTokens.shadows, ...customTokens.shadows },
    };
  }, [customTokens]);

  const value: ThemeContextValue = {
    tokens: mergedTokens,
    isDarkMode: darkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};