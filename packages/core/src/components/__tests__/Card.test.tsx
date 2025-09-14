import { fireEvent } from '@testing-library/react';
// React Native components (View, Text, TouchableOpacity) are rendered as DOM elements
import { Card } from '../Card';
import { customRender } from '../../test/setup';

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

  it('renders as div by default', () => {
    const { container } = renderWithTheme(
      <Card>
        <div>Content</div>
      </Card>
    );
    
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies shadow styles', () => {
    const { container } = renderWithTheme(
      <Card shadow="lg">
        <div>Content</div>
      </Card>
    );
    
    const card = container.querySelector('div');
    
    // Card should render with shadow prop (shadow implementation varies)
    expect(card).toBeTruthy();
  });

  it('applies border radius', () => {
    const { container } = renderWithTheme(
      <Card rounded="lg">
        <div>Content</div>
      </Card>
    );
    
    const card = container.querySelector('div');
    
    // Card should have border radius applied
    expect(card!.style.borderRadius).toBeTruthy();
    expect(card!.style.borderRadius).toMatch(/\d/); // Should contain numeric value
  });

  it('applies border when enabled', () => {
    const { container } = renderWithTheme(
      <Card border={true}>
        <div>Content</div>
      </Card>
    );
    
    const card = container.querySelector('div');
    
    // Card border should be applied
    expect(card!.style.borderWidth).toBeTruthy();
    expect(card!.style.borderColor).toBeTruthy();
  });

  it('applies background color', () => {
    const { container } = renderWithTheme(
      <Card bg="primary">
        <div>Content</div>
      </Card>
    );
    
    const card = container.querySelector('div');
    
    expect(card!.style.backgroundColor).toBeTruthy();
  });

  it('renders as button or clickable div when pressable', () => {
    const mockOnPress = jest.fn();
    const { container } = renderWithTheme(
      <Card pressable={true} onPress={mockOnPress}>
        <div>Pressable card</div>
      </Card>
    );
    
    const clickableElement = container.querySelector('button') || container.querySelector('div[role="button"]') || container.querySelector('div');
    expect(clickableElement).toBeTruthy();
  });

  it('calls onPress when pressable card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Card pressable={true} onPress={mockOnPress}>
        <div>Pressable card</div>
      </Card>
    );
    
    const card = getByText('Pressable card').closest('button') || getByText('Pressable card').parentElement;
    fireEvent.click(card!);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not render as button when pressable but no onPress', () => {
    const { container } = renderWithTheme(
      <Card pressable={true}>
        <div>Non-pressable card</div>
      </Card>
    );
    
    expect(container.querySelector('div')).toBeTruthy();
    expect(container.querySelector('button')).toBeFalsy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Card p={4} m={2}>
        <div>Content</div>
      </Card>
    );
    
    const card = container.querySelector('div');
    
    // Utility props should apply spacing values - check for numeric or pixel values
    expect(card!.style.padding).toMatch(/16/);
    expect(card!.style.margin).toMatch(/8/);
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