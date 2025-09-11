import { Platform, View, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <Text>Screen content</Text>
      </Screen>
    );
    
    expect(getByText('Screen content')).toBeTruthy();
  });

  it('renders SafeAreaView by default', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Screen>
        <Text>Content</Text>
      </Screen>
    );
    
    // Should find SafeAreaView (mocked as a component)
    expect(() => UNSAFE_getByType(SafeAreaView)).not.toThrow();
  });

  it('renders regular View when safe is false', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Screen safe={false}>
        <Text>Content</Text>
      </Screen>
    );
    
    const views = UNSAFE_getAllByType(View);
    expect(views.length).toBeGreaterThan(0);
  });

  it('applies flex: 1 and background color by default', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Screen safe={false}>
        <Text>Content</Text>
      </Screen>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      flex: 1,
      backgroundColor: expect.any(String),
    }));
  });

  it('renders ScrollView when scroll is enabled', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Screen scroll={true}>
        <Text>Scrollable content</Text>
      </Screen>
    );
    
    expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
  });

  it('applies center styles when center is enabled', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Screen safe={false} center={true}>
        <Text>Centered content</Text>
      </Screen>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      justifyContent: 'center',
      alignItems: 'center',
    }));
  });

  it('applies custom background color', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Screen safe={false} bg="primary">
        <Text>Content</Text>
      </Screen>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('renders KeyboardAvoidingView on iOS when keyboardAvoiding is enabled', () => {
    Platform.OS = 'ios';
    
    const { UNSAFE_getByType } = renderWithTheme(
      <Screen keyboardAvoiding={true}>
        <Text>Content</Text>
      </Screen>
    );
    
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });

  it('does not render KeyboardAvoidingView on Android', () => {
    Platform.OS = 'android';
    
    const { UNSAFE_queryByType } = renderWithTheme(
      <Screen keyboardAvoiding={true}>
        <Text>Content</Text>
      </Screen>
    );
    
    expect(UNSAFE_queryByType(KeyboardAvoidingView)).toBeNull();
  });

  it('does not render KeyboardAvoidingView when keyboardAvoiding is disabled', () => {
    Platform.OS = 'ios';
    
    const { UNSAFE_queryByType } = renderWithTheme(
      <Screen keyboardAvoiding={false}>
        <Text>Content</Text>
      </Screen>
    );
    
    expect(UNSAFE_queryByType(KeyboardAvoidingView)).toBeNull();
  });

  it('applies utility props', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Screen safe={false} p={4} m={2}>
        <Text>Content</Text>
      </Screen>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      padding: 16,
      margin: 8,
    }));
  });

  it('combines scroll and center correctly', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Screen scroll={true} center={true}>
        <Text>Scrollable centered content</Text>
      </Screen>
    );
    
    const scrollView = UNSAFE_getByType(ScrollView);
    expect(scrollView.props.contentContainerStyle).toMatchObject(
      expect.objectContaining({
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      })
    );
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