import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../../hooks/useTheme';

// Test component to access theme
const TestComponent = () => {
  const { getColor } = useTheme();
  return <Text testID="theme-test">{getColor('primary')}</Text>;
};

describe('ThemeProvider', () => {
  it('provides default theme to children', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const element = getByTestId('theme-test');
    expect(element.children[0]).toBe('#007AFF');
  });

  it('allows theme customization', () => {
    const customTokens = {
      colors: {
        primary: '#FF6B35',
        secondary: '#004643',
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
        info: '#5AC8FA',
        text: '#001E1D',
        textLight: '#525B44',
        surface: '#FFFFFF',
        background: '#F9FFFE',
        border: '#ABD1C6',
        primaryDark: '#CC5429',
      },
    };

    const { getByTestId } = render(
      <ThemeProvider tokens={customTokens}>
        <TestComponent />
      </ThemeProvider>
    );
    
    const element = getByTestId('theme-test');
    expect(element.children[0]).toBe('#FF6B35');
  });

  it('handles dark mode colors', () => {
    const TestDarkComponent = () => {
      const { getColor } = useTheme();
      return <Text testID="dark-test">{getColor('text')}</Text>;
    };

    const { getByTestId } = render(
      <ThemeProvider darkMode={true}>
        <TestDarkComponent />
      </ThemeProvider>
    );
    
    const element = getByTestId('dark-test');
    expect(element.children[0]).toBe('#FFFFFF'); // Dark mode text color
  });

  it('throws error when useTheme is used without provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useThemeContext must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });

  it('provides theme context values correctly', () => {
    const ContextTestComponent = () => {
      const { tokens, isDarkMode, spacing } = useTheme();
      return (
        <Text testID="context-test">
          {`${tokens.colors.primary}-${isDarkMode}-${spacing(4)}`}
        </Text>
      );
    };

    const { getByTestId } = render(
      <ThemeProvider darkMode={true}>
        <ContextTestComponent />
      </ThemeProvider>
    );
    
    const element = getByTestId('context-test');
    expect(element.children[0]).toBe('#007AFF-true-16');
  });
});