// React Native components (View, Text) are rendered as div and span in DOM
import { HStack } from '../HStack';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('HStack', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <HStack>
        <span>Item 1</span>
        <span>Item 2</span>
      </HStack>
    );
    
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
  });

  it('applies horizontal direction by default', () => {
    const { container } = renderWithTheme(
      <HStack>
        <span>Item</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.flexDirection).toBe('row');
  });

  it('applies center alignment by default', () => {
    const { container } = renderWithTheme(
      <HStack>
        <span>Item</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.alignItems).toBe('center');
  });

  it('applies custom alignment', () => {
    const { container } = renderWithTheme(
      <HStack align="flex-end" justify="space-between">
        <span>Item</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.alignItems).toBe('flex-end');
    expect(styles.justifyContent).toBe('space-between');
  });

  it('applies wrap when enabled', () => {
    const { container } = renderWithTheme(
      <HStack wrap={true}>
        <span>Item 1</span>
        <span>Item 2</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.flexWrap).toBe('wrap');
  });

  it('applies nowrap by default', () => {
    const { container } = renderWithTheme(
      <HStack>
        <span>Item</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.flexWrap).toBe('nowrap');
  });

  it('applies spacing between children', () => {
    const { container } = renderWithTheme(
      <HStack spacing={3}>
        <span>Item 1</span>
        <span>Item 2</span>
      </HStack>
    );
    
    const divs = container.querySelectorAll('div');
    // Should have container + spacer divs
    expect(divs.length).toBeGreaterThan(1);
  });

  it('applies background color', () => {
    const { container } = renderWithTheme(
      <HStack bg="primary">
        <span>Item</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <HStack p={4} m={2}>
        <span>Item</span>
      </HStack>
    );
    
    const hstack = container.querySelector('div');
    const styles = getComputedStyle(hstack!);
    
    expect(styles.padding).toBe('16px');
    expect(styles.margin).toBe('8px');
  });

  it('renders children without spacing when spacing is 0', () => {
    const { container } = renderWithTheme(
      <HStack spacing={0}>
        <span>Item 1</span>
        <span>Item 2</span>
      </HStack>
    );
    
    const divs = container.querySelectorAll('div');
    // Should only have the main container, no spacer divs
    expect(divs.length).toBe(1);
  });

  it('contains correct VRN metadata', () => {
    expect(HStack.__vrn__).toEqual({
      type: 'HStack',
      category: 'Layout',
      props: {
        spacing: {
          type: 'spacing',
          default: 0,
        },
        align: {
          type: 'enum',
          options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
          default: 'center',
        },
        justify: {
          type: 'enum',
          options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
          default: 'flex-start',
        },
        wrap: {
          type: 'boolean',
          default: false,
        },
      },
      container: true,
      acceptsChildren: true,
    });
  });
});