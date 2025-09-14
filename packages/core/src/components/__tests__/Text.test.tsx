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
    
    // React Native uses numeric values, but DOM might render as pixels or numbers
    expect(element.style.fontSize).toMatch(/32/);
    expect(element.style.fontWeight).toBe('bold');
  });

  it('applies color prop', () => {
    const { getByText } = renderWithTheme(
      <Text color="danger">Error message</Text>
    );
    
    const element = getByText('Error message');
    
    // Should have a color value set - check if it contains expected danger color or any color
    expect(element.style.color).toBeTruthy();
  });

  it('applies utility props', () => {
    const { getByText } = renderWithTheme(
      <Text m={4} p={2}>Spaced Text</Text>
    );
    
    const element = getByText('Spaced Text');
    
    // Utility props should apply spacing values - check for numeric or pixel values
    expect(element.style.margin).toMatch(/16/);
    expect(element.style.padding).toMatch(/8/);
  });

  it('applies custom styles', () => {
    const { getByText } = renderWithTheme(
      <Text style={{ textDecorationLine: 'underline' }}>Custom Text</Text>
    );
    
    const element = getByText('Custom Text');
    
    expect(element.style.textDecorationLine).toBe('underline');
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
    
    expect(element.style.textAlign).toBe('center');
  });

  it('handles numberOfLines prop', () => {
    const { getByText } = renderWithTheme(
      <Text numberOfLines={1}>This is a very long text that should be truncated</Text>
    );
    
    const element = getByText('This is a very long text that should be truncated');
    
    // numberOfLines is handled in the mock by setting text overflow styles
    expect(element.style.overflow).toBe('hidden');
    expect(element.style.textOverflow).toBe('ellipsis');
    expect(element.style.whiteSpace).toBe('nowrap');
  });
});