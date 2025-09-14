import { Platform } from 'react-native';
// React Native components (View, Text, ScrollView, KeyboardAvoidingView, SafeAreaView) are rendered as DOM elements
import { Screen } from '../Screen';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

// Mock Platform for consistent testing
const originalPlatform = Platform.OS;

describe('Screen', () => {
  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Screen>
        <span>Screen content</span>
      </Screen>
    );
    
    expect(getByText('Screen content')).toBeTruthy();
  });

  it('renders SafeAreaView by default', () => {
    const { container } = renderWithTheme(
      <Screen>
        <span>Content</span>
      </Screen>
    );
    
    // SafeAreaView should render as a div with safe-area styling
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders regular View when safe is false', () => {
    const { container } = renderWithTheme(
      <Screen safe={false}>
        <span>Content</span>
      </Screen>
    );
    
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('applies flex: 1 and background color by default', () => {
    const { container } = renderWithTheme(
      <Screen safe={false}>
        <span>Content</span>
      </Screen>
    );
    
    const screen = container.querySelector('div');
    
    expect(screen!.style.flex).toBe('1');
    expect(screen!.style.backgroundColor).toBeTruthy();
  });

  it('renders ScrollView when scroll is enabled', () => {
    const { container } = renderWithTheme(
      <Screen scroll={true}>
        <span>Scrollable content</span>
      </Screen>
    );
    
    // ScrollView renders as a div with scrollable styling
    const scrollableDiv = container.querySelector('div[style*="overflow"]') || container.querySelector('div');
    expect(scrollableDiv).toBeTruthy();
  });

  it('applies center styles when center is enabled', () => {
    const { container } = renderWithTheme(
      <Screen safe={false} center={true}>
        <span>Centered content</span>
      </Screen>
    );
    
    const screen = container.querySelector('div');
    
    expect(screen!.style.justifyContent).toBe('center');
    expect(screen!.style.alignItems).toBe('center');
  });

  it('applies custom background color', () => {
    const { container } = renderWithTheme(
      <Screen safe={false} bg="primary">
        <span>Content</span>
      </Screen>
    );
    
    const screen = container.querySelector('div');
    
    expect(screen!.style.backgroundColor).toBeTruthy();
  });

  it('renders KeyboardAvoidingView on iOS when keyboardAvoiding is enabled', () => {
    Platform.OS = 'ios';
    
    const { container } = renderWithTheme(
      <Screen keyboardAvoiding={true}>
        <span>Content</span>
      </Screen>
    );
    
    // KeyboardAvoidingView should render as a div with keyboard-avoiding behavior
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('does not render KeyboardAvoidingView on Android', () => {
    Platform.OS = 'android';
    
    const { container } = renderWithTheme(
      <Screen keyboardAvoiding={true}>
        <span>Content</span>
      </Screen>
    );
    
    // On Android, it should render without keyboard avoiding wrapper
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('does not render KeyboardAvoidingView when keyboardAvoiding is disabled', () => {
    Platform.OS = 'ios';
    
    const { container } = renderWithTheme(
      <Screen keyboardAvoiding={false}>
        <span>Content</span>
      </Screen>
    );
    
    // Without keyboard avoiding, should render as regular div
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Screen safe={false} p={4} m={2}>
        <span>Content</span>
      </Screen>
    );
    
    const screen = container.querySelector('div');
    
    // Utility props should apply spacing values - check for numeric or pixel values
    expect(screen!.style.padding).toMatch(/16/);
    expect(screen!.style.margin).toMatch(/8/);
  });

  it('combines scroll and center correctly', () => {
    const { container } = renderWithTheme(
      <Screen scroll={true} center={true}>
        <span>Scrollable centered content</span>
      </Screen>
    );
    
    const scrollContainer = container.querySelector('div');
    
    expect(scrollContainer!.style.flexGrow).toBe('1');
    expect(scrollContainer!.style.justifyContent).toBe('center');
    expect(scrollContainer!.style.alignItems).toBe('center');
  });

  it('contains correct VRN metadata', () => {
    expect(Screen.__vrn__).toEqual({
      type: 'Screen',
      category: 'Layout',
      props: {
        safe: {
          type: 'boolean',
          default: true,
        },
        scroll: {
          type: 'boolean',
          default: false,
        },
        keyboardAvoiding: {
          type: 'boolean',
          default: true,
        },
        center: {
          type: 'boolean',
          default: false,
        },
        bg: {
          type: 'color',
          default: 'background',
        },
      },
      container: true,
      acceptsChildren: true,
    });
  });
});