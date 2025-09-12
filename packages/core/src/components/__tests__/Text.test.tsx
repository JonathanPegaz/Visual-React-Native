import { Text } from '../Text';
import { customRender } from '../../test/setup';

// Use custom render with theme provider
const renderWithTheme = customRender;

describe('Text', () => {
  it('renders correctly with children', () => {
    const { getByText } = renderWithTheme(
      <Text>Hello World</Text>
    );
    
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies variant styles', () => {
    const { getByText } = renderWithTheme(
      <Text variant="h1">Heading</Text>
    );
    
    const element = getByText('Heading');
    const styles = getComputedStyle(element);
    
    expect(styles.fontSize).toBe('32px');
    expect(styles.fontWeight).toBe('bold');
  });

  it('applies color prop', () => {
    const { getByText } = renderWithTheme(
      <Text color="error">Error message</Text>
    );
    
    const element = getByText('Error message');
    const styles = getComputedStyle(element);
    
    expect(styles.color).toBeTruthy();
  });

  it('applies utility props', () => {
    const { getByText } = renderWithTheme(
      <Text m={4} p={2}>Spaced Text</Text>
    );
    
    const element = getByText('Spaced Text');
    const styles = getComputedStyle(element);
    
    expect(styles.margin).toBe('16px');
    expect(styles.padding).toBe('8px');
  });

  it('applies custom styles', () => {
    const { getByText } = renderWithTheme(
      <Text style={{ textDecorationLine: 'underline' }}>Custom Text</Text>
    );
    
    const element = getByText('Custom Text');
    const styles = getComputedStyle(element);
    
    expect(styles.textDecorationLine).toBe('underline');
  });

  it('contains correct VRN metadata', () => {
    expect(Text.__vrn__).toEqual({
      type: 'Text',
      category: 'Typography',
      props: {
        variant: {
          type: 'enum',
          options: ['h1', 'h2', 'h3', 'body', 'caption', 'label'],
          default: 'body',
          preview: true,
        },
        color: {
          type: 'color',
          default: 'text',
        },
        align: {
          type: 'enum',
          options: ['left', 'center', 'right'],
          default: 'left',
        },
        weight: {
          type: 'enum',
          options: ['normal', '500', '600', 'bold'],
        },
        numberOfLines: {
          type: 'number',
        },
        children: {
          type: 'string',
          default: 'Text',
          inline: true,
        },
      },
      container: false,
      acceptsChildren: false,
    });
  });

  it('applies align prop', () => {
    const { getByText } = renderWithTheme(
      <Text align="center">Centered Text</Text>
    );
    
    const element = getByText('Centered Text');
    const styles = getComputedStyle(element);
    
    expect(styles.textAlign).toBe('center');
  });

  it('handles numberOfLines prop', () => {
    const { getByText } = renderWithTheme(
      <Text numberOfLines={1}>This is a very long text that should be truncated</Text>
    );
    
    const element = getByText('This is a very long text that should be truncated');
    const styles = getComputedStyle(element);
    
    // numberOfLines in web typically translates to CSS line-clamp or similar
    expect(styles.webkitLineClamp || element.style.webkitLineClamp).toBeTruthy();
  });
});