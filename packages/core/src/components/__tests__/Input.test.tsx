import { fireEvent } from '@testing-library/react';
// React Native components (View) are rendered as div in DOM
import { Input } from '../Input';
import { customRender } from '../../test/setup';

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
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('Hello');
  });

  it('shows error state', () => {
    const { getByText, getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Test" error={true} errorMessage="This field is required" />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
    
    const input = getByPlaceholderText('Test');
    const styles = getComputedStyle(input);
    
    expect(styles.borderColor).toBeTruthy();
  });

  it('applies different input types', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Password" type="password" />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input.getAttribute('type')).toBe('password');
  });

  it('applies email keyboard type', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Email" type="email" />
    );
    
    const input = getByPlaceholderText('Email');
    expect(input.getAttribute('type')).toBe('email');
  });

  it('applies numeric keyboard type', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Number" type="number" />
    );
    
    const input = getByPlaceholderText('Number');
    expect(input.getAttribute('type')).toBe('number');
  });

  it('handles editable prop', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Disabled" editable={false} />
    );
    
    const input = getByPlaceholderText('Disabled');
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('applies size styles', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Large input" size="lg" />
    );
    
    const input = getByPlaceholderText('Large input');
    const styles = getComputedStyle(input);
    
    expect(styles.paddingLeft).toBe('20px');
    expect(styles.paddingRight).toBe('20px');
    expect(styles.paddingTop).toBe('16px');
    expect(styles.paddingBottom).toBe('16px');
  });

  it('applies variant styles', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <Input placeholder="Filled input" variant="filled" />
    );
    
    const input = getByPlaceholderText('Filled input');
    const styles = getComputedStyle(input);
    
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Input placeholder="Spaced" m={4} />
    );
    
    const inputContainer = container.querySelector('div');
    const styles = getComputedStyle(inputContainer!);
    
    expect(styles.margin).toBe('16px');
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