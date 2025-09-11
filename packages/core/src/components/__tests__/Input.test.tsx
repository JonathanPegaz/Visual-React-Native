import { fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { customRender, View } from '../../__tests__/setup';

// Use custom render with theme provider
const renderWithTheme = customRender;

describe('Input', () => {
  it('renders correctly with placeholder', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Enter text" />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders label when provided', () => {
    const { getByText } = renderWithTheme(
      <Input label="Name" placeholder="Enter name" />
    );
    
    expect(getByText('Name')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Test input" onChangeText={mockOnChange} />
    );
    
    const input = getByPlaceholderText('Test input');
    fireEvent.changeText(input, 'Hello');
    
    expect(mockOnChange).toHaveBeenCalledWith('Hello');
  });

  it('shows error state', () => {
    const { getByText, getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Test" error={true} errorMessage="This field is required" />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
    
    const input = getByPlaceholderText('Test');
    const styles = input.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderColor: expect.any(String),
    }));
  });

  it('applies different input types', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Password" type="password" />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('applies email keyboard type', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Email" type="email" />
    );
    
    const input = getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('applies numeric keyboard type', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Number" type="number" />
    );
    
    const input = getByPlaceholderText('Number');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('handles editable prop', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Disabled" editable={false} />
    );
    
    const input = getByPlaceholderText('Disabled');
    expect(input.props.editable).toBe(false);
  });

  it('applies size styles', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Large input" size="lg" />
    );
    
    const input = getByPlaceholderText('Large input');
    const styles = input.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      paddingHorizontal: 20,
      paddingVertical: 16,
    }));
  });

  it('applies variant styles', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Filled input" variant="filled" />
    );
    
    const input = getByPlaceholderText('Filled input');
    const styles = input.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('applies utility props', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Input placeholder="Spaced" m={4} />
    );
    
    const container = UNSAFE_getByType(View);
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      margin: 16,
    }));
  });

  it('contains correct VRN metadata', () => {
    expect(Input.__vrn__).toEqual({
      type: 'Input',
      category: 'Inputs',
      props: {
        placeholder: {
          type: 'string',
          default: 'Enter text...',
        },
        type: {
          type: 'enum',
          options: ['text', 'email', 'password', 'number', 'phone'],
          default: 'text',
        },
        size: {
          type: 'enum',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
        },
        variant: {
          type: 'enum',
          options: ['outline', 'filled', 'underline'],
          default: 'outline',
          preview: true,
        },
        label: {
          type: 'string',
        },
        multiline: {
          type: 'boolean',
          default: false,
        },
        numberOfLines: {
          type: 'number',
          default: 1,
        },
        editable: {
          type: 'boolean',
          default: true,
        },
      },
      bindable: {
        value: {
          type: 'state',
          valueType: 'string',
        },
        onChangeText: {
          type: 'action',
          required: false,
        },
        error: {
          type: 'state',
          valueType: 'boolean',
        },
        errorMessage: {
          type: 'state',
          valueType: 'string',
        },
      },
      container: false,
      acceptsChildren: false,
    });
  });
});