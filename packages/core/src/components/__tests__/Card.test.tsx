import { fireEvent } from '@testing-library/react-native';
import { Card } from '../Card';
import { customRender, View, Text, TouchableOpacity } from '../../__tests__/setup';

const renderWithTheme = customRender;

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>Card content</Text>
      </Card>
    );
    
    expect(getByText('Card content')).toBeTruthy();
  });

  it('renders as View by default', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    
    expect(UNSAFE_getByType(View)).toBeTruthy();
  });

  it('applies shadow styles', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card shadow="lg">
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const styles = card.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      shadowOffset: expect.any(Object),
      shadowOpacity: expect.any(Number),
      shadowRadius: expect.any(Number),
    }));
  });

  it('applies border radius', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card rounded="lg">
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const styles = card.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderRadius: expect.any(Number),
    }));
  });

  it('applies border when enabled', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card border={true}>
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const styles = card.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderWidth: 1,
      borderColor: expect.any(String),
    }));
  });

  it('applies background color', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card bg="primary">
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const styles = card.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('renders as TouchableOpacity when pressable', () => {
    const mockOnPress = jest.fn();
    const { UNSAFE_getByType } = renderWithTheme(
      <Card pressable={true} onPress={mockOnPress}>
        <Text>Pressable card</Text>
      </Card>
    );
    
    expect(UNSAFE_getByType(TouchableOpacity)).toBeTruthy();
  });

  it('calls onPress when pressable card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Card pressable={true} onPress={mockOnPress}>
        <Text>Pressable card</Text>
      </Card>
    );
    
    const card = getByText('Pressable card').parent;
    fireEvent.press(card);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not render as TouchableOpacity when pressable but no onPress', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card pressable={true}>
        <Text>Non-pressable card</Text>
      </Card>
    );
    
    expect(UNSAFE_getByType(View)).toBeTruthy();
  });

  it('applies utility props', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Card p={4} m={2}>
        <Text>Content</Text>
      </Card>
    );
    
    const card = UNSAFE_getByType(View);
    const styles = card.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      padding: 16,
      margin: 8,
    }));
  });

  it('contains correct VRN metadata', () => {
    expect(Card.__vrn__).toEqual({
      type: 'Card',
      category: 'Containers',
      props: {
        shadow: {
          type: 'enum',
          options: ['none', 'sm', 'md', 'lg'],
          default: 'md',
          preview: true,
        },
        rounded: {
          type: 'enum',
          options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
          default: 'md',
        },
        border: {
          type: 'boolean',
          default: false,
        },
        pressable: {
          type: 'boolean',
          default: false,
        },
        bg: {
          type: 'color',
          default: 'surface',
        },
      },
      bindable: {
        onPress: {
          type: 'action',
          required: false,
        },
      },
      container: true,
      acceptsChildren: true,
    });
  });
});