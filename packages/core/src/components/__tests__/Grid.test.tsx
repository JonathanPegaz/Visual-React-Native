// React Native components (View, Text) are rendered as div and span in DOM
import { Grid } from '../Grid';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Grid', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Grid>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </Grid>
    );
    
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('applies row direction and wrap', () => {
    const { container } = renderWithTheme(
      <Grid>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    const gridContainer = container.querySelector('div');
    const styles = getComputedStyle(gridContainer!);
    
    expect(styles.flexDirection).toBe('row');
    expect(styles.flexWrap).toBe('wrap');
  });

  it('applies default column count (2)', () => {
    const { container } = renderWithTheme(
      <Grid>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    const gridItems = container.querySelectorAll('div > div');
    const gridItem = gridItems[0]; // First grid item wrapper
    const styles = getComputedStyle(gridItem!);
    
    expect(styles.width).toBe('50%'); // 100% / 2 cols = 50%
  });

  it('applies custom column count', () => {
    const { container } = renderWithTheme(
      <Grid cols={3}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </Grid>
    );
    
    const gridItems = container.querySelectorAll('div > div');
    const gridItem = gridItems[0];
    const styles = getComputedStyle(gridItem!);
    
    expect(styles.width).toMatch(/33\.33/);
  });

  it('applies gap spacing', () => {
    const { container } = renderWithTheme(
      <Grid gap={2}>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    const gridItems = container.querySelectorAll('div > div');
    const gridItem = gridItems[0];
    const styles = getComputedStyle(gridItem!);
    
    expect(styles.paddingLeft).toBe('4px'); // gap 2 = 8px, so padding = 4px each side
    expect(styles.paddingRight).toBe('4px');
    expect(styles.marginBottom).toBe('8px');
  });

  it('applies background color', () => {
    const { container } = renderWithTheme(
      <Grid bg="primary">
        <span>Item 1</span>
      </Grid>
    );
    
    const gridContainer = container.querySelector('div');
    const styles = getComputedStyle(gridContainer!);
    
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Grid p={3} m={2}>
        <span>Item 1</span>
      </Grid>
    );
    
    const gridContainer = container.querySelector('div');
    const styles = getComputedStyle(gridContainer!);
    
    expect(styles.padding).toBe('12px');
    expect(styles.margin).toBe('8px');
  });

  it('wraps children in grid items with proper width', () => {
    const { container } = renderWithTheme(
      <Grid cols={4}>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    const gridItems = container.querySelectorAll('div > div');
    expect(gridItems.length).toBeGreaterThanOrEqual(2);
    
    const firstGridItem = gridItems[0];
    const secondGridItem = gridItems[1];
    
    expect(getComputedStyle(firstGridItem).width).toBe('25%'); // 100% / 4 cols
    expect(getComputedStyle(secondGridItem).width).toBe('25%');
  });

  it('contains correct VRN metadata', () => {
    expect(Grid.__vrn__).toEqual({
      type: 'Grid',
      category: 'Layout',
      props: {
        cols: {
          type: 'number',
          default: 2,
        },
        gap: {
          type: 'spacing',
          default: 4,
        },
        colsMd: {
          type: 'number',
        },
        colsLg: {
          type: 'number',
        },
        bg: {
          type: 'color',
        },
      },
      container: true,
      acceptsChildren: true,
    });
  });
});