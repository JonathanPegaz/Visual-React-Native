import { View, Text } from 'react-native';
import { Grid } from '../Grid';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Grid', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Grid>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Grid>
    );
    
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('applies row direction and wrap', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0]; // First view is the container
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      flexDirection: 'row',
      flexWrap: 'wrap',
    }));
  });

  it('applies default column count (2)', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    // Grid items are wrapped in Views
    const gridItem = views[1]; // Second view is first grid item
    const styles = gridItem.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      width: '50%', // 100% / 2 cols = 50%
    }));
  });

  it('applies custom column count', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid cols={3}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    const gridItem = views[1];
    const styles = gridItem.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      width: '33.333333333333336%', // 100% / 3 cols
    }));
  });

  it('applies gap spacing', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid gap={2}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    const gridItem = views[1];
    const styles = gridItem.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      paddingHorizontal: 4, // gap 2 = 8px, so padding = 4px each side
      marginBottom: 8,
    }));
  });

  it('applies background color', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid bg="primary">
        <Text>Item 1</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('applies utility props', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid p={3} m={2}>
        <Text>Item 1</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      padding: 12,
      margin: 8,
    }));
  });

  it('wraps children in grid items with proper width', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Grid cols={4}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </Grid>
    );
    
    const views = UNSAFE_getAllByType(View);
    // Should have container + 2 grid item wrappers
    expect(views.length).toBeGreaterThanOrEqual(3);
    
    const firstGridItem = views[1];
    const secondGridItem = views[2];
    
    expect(firstGridItem.props.style.width).toBe('25%'); // 100% / 4 cols
    expect(secondGridItem.props.style.width).toBe('25%');
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