import { fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { customRender, ActivityIndicator, TouchableOpacity } from '../../__tests__/setup';

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
    
    fireEvent.press(getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    const { getByText } = renderWithTheme(
      <Button variant="secondary" onPress={() => {}}>Secondary</Button>
    );
    
    const element = getByText('Secondary').parent;
    const styles = element?.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('applies size prop', () => {
    const { getByText } = renderWithTheme(
      <Button size="lg" onPress={() => {}}>Large</Button>
    );
    
    const element = getByText('Large').parent;
    const styles = element?.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      paddingHorizontal: 24,
      paddingVertical: 16,
    }));
  });

  it('shows loading state', () => {
    const { queryByText, UNSAFE_getByType } = renderWithTheme(
      <Button onPress={() => {}} loading={true}>Submit</Button>
    );
    
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(queryByText('Submit')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button onPress={mockOnPress} disabled={true}>Disabled</Button>
    );
    
    const button = getByText('Disabled').parent;
    expect(button?.props.disabled).toBe(true);
    
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('is disabled when loading', () => {
    const mockOnPress = jest.fn();
    const { UNSAFE_getByType } = renderWithTheme(
      <Button onPress={mockOnPress} loading={true}>Loading</Button>
    );
    
    const button = UNSAFE_getByType(TouchableOpacity);
    expect(button.props.disabled).toBe(true);
    
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies utility props', () => {
    const { getByText } = renderWithTheme(
      <Button onPress={() => {}} m={4}>Spaced</Button>
    );
    
    const element = getByText('Spaced').parent;
    const styles = element?.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      margin: 16,
    }));
  });

  it('applies fullWidth prop', () => {
    const { getByText } = renderWithTheme(
      <Button onPress={() => {}} fullWidth={true}>Full Width</Button>
    );
    
    const element = getByText('Full Width').parent;
    const styles = element?.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      width: '100%',
    }));
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