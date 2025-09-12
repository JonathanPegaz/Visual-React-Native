import { fireEvent } from '@testing-library/react';
// React Native components (ActivityIndicator, TouchableOpacity) are rendered as DOM elements
import { Button } from '../Button';
import { customRender } from '../../test/setup';

// Use custom render with theme provider
const renderWithTheme = customRender;

describe('Button', () => {
  it('renders correctly with children', () => {
    const { getByText } = renderWithTheme(
      <Button onPress={() => {}}>Click me</Button>
    );
    
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button onPress={mockOnPress}>Click me</Button>
    );
    
    fireEvent.click(getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    const { getByText } = renderWithTheme(
      <Button variant="secondary" onPress={() => {}}>Secondary</Button>
    );
    
    const element = getByText('Secondary').parentElement;
    const styles = getComputedStyle(element!);
    
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('applies size prop', () => {
    const { getByText } = renderWithTheme(
      <Button size="lg" onPress={() => {}}>Large</Button>
    );
    
    const element = getByText('Large').parentElement;
    const styles = getComputedStyle(element!);
    
    expect(styles.paddingLeft).toBe('24px');
    expect(styles.paddingRight).toBe('24px');
    expect(styles.paddingTop).toBe('16px');
    expect(styles.paddingBottom).toBe('16px');
  });

  it('shows loading state', () => {
    const { queryByText, container } = renderWithTheme(
      <Button onPress={() => {}} loading={true}>Submit</Button>
    );
    
    // Look for loading indicator (rendered as a div or span with appropriate role/class)
    expect(container.querySelector('[role="status"], .spinner, .loading')).toBeTruthy();
    expect(queryByText('Submit')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button onPress={mockOnPress} disabled={true}>Disabled</Button>
    );
    
    const button = getByText('Disabled').closest('button') || getByText('Disabled').parentElement;
    expect(button).toHaveAttribute('disabled');
    
    fireEvent.click(button!);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('is disabled when loading', () => {
    const mockOnPress = jest.fn();
    const { container } = renderWithTheme(
      <Button onPress={mockOnPress} loading={true}>Loading</Button>
    );
    
    const button = container.querySelector('button') || container.querySelector('div[role="button"]');
    expect(button).toHaveAttribute('disabled');
    
    fireEvent.click(button!);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies utility props', () => {
    const { getByText } = renderWithTheme(
      <Button onPress={() => {}} m={4}>Spaced</Button>
    );
    
    const element = getByText('Spaced').parentElement;
    const styles = getComputedStyle(element!);
    
    expect(styles.margin).toBe('16px');
  });

  it('applies fullWidth prop', () => {
    const { getByText } = renderWithTheme(
      <Button onPress={() => {}} fullWidth={true}>Full Width</Button>
    );
    
    const element = getByText('Full Width').parentElement;
    const styles = getComputedStyle(element!);
    
    expect(styles.width).toBe('100%');
  });

  it('contains correct VRN metadata', () => {
    expect(Button.__vrn__).toEqual({
      type: 'Button',
      category: 'Inputs',
      props: {
        variant: {
          type: 'enum',
          options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
          default: 'primary',
          preview: true,
        },
        size: {
          type: 'enum',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
        fullWidth: {
          type: 'boolean',
          default: false,
        },
        loading: {
          type: 'boolean',
          default: false,
        },
        disabled: {
          type: 'boolean',
          default: false,
        },
        children: {
          type: 'string',
          default: 'Button',
          inline: true,
        },
      },
      bindable: {
        onPress: {
          type: 'action',
          required: false,
        },
        loading: {
          type: 'state',
          valueType: 'boolean',
        },
        disabled: {
          type: 'state',
          valueType: 'boolean',
        },
      },
      container: false,
      acceptsChildren: false,
    });
  });
});