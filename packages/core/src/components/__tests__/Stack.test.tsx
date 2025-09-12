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
    const styles = getComputedStyle(element!);
    
    expect(styles.flexDirection).toBe('column');
  });

  it('applies spacing between children', () => {
    const { container } = renderWithTheme(
      <Stack spacing={4}>
        <span>Child 1</span>
        <span>Child 2</span>
      </Stack>
    );
    
    // Should have spacer divs between children
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(2); // Container + spacer divs
  });

  it('applies alignment props', () => {
    const { container } = renderWithTheme(
      <Stack align="center" justify="space-between">
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    const styles = getComputedStyle(element!);
    
    expect(styles.alignItems).toBe('center');
    expect(styles.justifyContent).toBe('space-between');
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Stack p={6} m={2}>
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    const styles = getComputedStyle(element!);
    
    expect(styles.padding).toBe('24px');
    expect(styles.margin).toBe('8px');
  });

  it('applies background color', () => {
    const { container } = renderWithTheme(
      <Stack bg="primary">
        <span>Child</span>
      </Stack>
    );
    
    const element = container.querySelector('div');
    const styles = getComputedStyle(element!);
    
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('renders dividers when enabled', () => {
    const { container } = renderWithTheme(
      <Stack dividers={true}>
        <span>Child 1</span>
        <span>Child 2</span>
      </Stack>
    );
    
    // Should have extra divs for dividers
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(2); // Container + divider divs
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