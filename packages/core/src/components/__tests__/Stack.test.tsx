// React Native components (View, Text) are rendered as div and span in DOM
import { Stack } from '../Stack';
import { customRender } from '../../test/setup';

// Use custom render with theme provider
const renderWithTheme = customRender;

describe('Stack', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Stack>
        <span>Child 1</span>
        <span>Child 2</span>
      </Stack>
    );
    
    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
  });

  it('applies vertical direction by default', () => {
    const { container } = renderWithTheme(
      <Stack>
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    
    expect(element!.style.flexDirection).toBe('column');
  });

  it('applies spacing between children', () => {
    const { container } = renderWithTheme(
      <Stack spacing={4}>
        <span>Child 1</span>
        <span>Child 2</span>
      </Stack>
    );
    
    // Should have spacer divs between children - container + spacer divs
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThanOrEqual(2); // At least container + spacer div
  });

  it('applies alignment props', () => {
    const { container } = renderWithTheme(
      <Stack align="center" justify="space-between">
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    
    expect(element!.style.alignItems).toBe('center');
    expect(element!.style.justifyContent).toBe('space-between');
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Stack p={6} m={2}>
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    
    // Utility props should apply spacing values - check for numeric or pixel values
    expect(element!.style.padding).toMatch(/24/);
    expect(element!.style.margin).toMatch(/8/);
  });

  it('applies background color', () => {
    const { container } = renderWithTheme(
      <Stack bg="primary">
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    
    expect(element!.style.backgroundColor).toBeTruthy();
  });

  it('renders dividers when enabled', () => {
    const { container } = renderWithTheme(
      <Stack dividers={true}>
        <span>Child 1</span>
        <span>Child 2</span>
      </Stack>
    );
    
    // Should have extra divs for dividers - container + divider divs
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThanOrEqual(2); // At least container + divider div
  });

  it('contains correct VRN metadata', () => {
    expect(Stack.__vrn__).toEqual({
      type: 'Stack',
      category: 'Layout',
      props: {
        spacing: {
          type: 'spacing',
          default: 0,
        },
        align: {
          type: 'enum',
          options: ['stretch', 'flex-start', 'flex-end', 'center'],
          default: 'stretch',
        },
        justify: {
          type: 'enum',
          options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
          default: 'flex-start',
        },
        dividers: {
          type: 'boolean',
          default: false,
        },
      },
      container: true,
      acceptsChildren: true,
    });
  });
});