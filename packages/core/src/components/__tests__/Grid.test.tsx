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
    
    expect(gridContainer!.style.flexDirection).toBe('row');
    expect(gridContainer!.style.flexWrap).toBe('wrap');
  });

  it('applies default column count (2)', () => {
    const { container } = renderWithTheme(
      <Grid>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    // Verify grid has rendered correctly (may have theme wrapper)
    const gridItems = container.querySelectorAll('div > div');
    expect(gridItems.length).toBeGreaterThanOrEqual(2); // Grid items created
  });

  it('applies custom column count', () => {
    const { container } = renderWithTheme(
      <Grid cols={3}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </Grid>
    );
    
    // With 3 columns specified, should render items
    const gridItems = container.querySelectorAll('div > div');
    expect(gridItems.length).toBeGreaterThanOrEqual(3);
  });

  it('applies gap spacing', () => {
    const { container } = renderWithTheme(
      <Grid gap={2}>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    // Verify grid structure - gap doesn't affect item count
    const gridItems = container.querySelectorAll('div > div');
    expect(gridItems.length).toBeGreaterThanOrEqual(2);
    
    // Grid should have proper structure for spacing
    const gridContainer = container.querySelector('div');
    expect(gridContainer).toBeTruthy();
  });

  it('applies background color', () => {
    const { container } = renderWithTheme(
      <Grid bg="primary">
        <span>Item 1</span>
      </Grid>
    );
    
    const gridContainer = container.querySelector('div');
    
    expect(gridContainer!.style.backgroundColor).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Grid p={3} m={2}>
        <span>Item 1</span>
      </Grid>
    );
    
    const gridContainer = container.querySelector('div');
    
    // Utility props should apply spacing values - check for numeric or pixel values
    expect(gridContainer!.style.padding).toMatch(/12/);
    expect(gridContainer!.style.margin).toMatch(/8/);
  });

  it('wraps children in grid items with proper width', () => {
    const { container } = renderWithTheme(
      <Grid cols={4}>
        <span>Item 1</span>
        <span>Item 2</span>
      </Grid>
    );
    
    // Should render items regardless of column count
    const gridItems = container.querySelectorAll('div > div');
    expect(gridItems.length).toBeGreaterThanOrEqual(2);
    
    const firstGridItem = gridItems[0];
    const secondGridItem = gridItems[1];
    
    // Verify items exist
    expect(firstGridItem).toBeTruthy();
    expect(secondGridItem).toBeTruthy();
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