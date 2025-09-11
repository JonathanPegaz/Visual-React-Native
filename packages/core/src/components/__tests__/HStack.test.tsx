import { HStack } from '../HStack';
import { customRender, View, Text } from '../../__tests__/setup';

const renderWithTheme = customRender;

describe('HStack', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <HStack>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </HStack>
    );
    
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
  });

  it('applies horizontal direction by default', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack>
        <Text>Item</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      flexDirection: 'row',
    }));
  });

  it('applies center alignment by default', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack>
        <Text>Item</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      alignItems: 'center',
    }));
  });

  it('applies custom alignment', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack align="flex-end" justify="space-between">
        <Text>Item</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    }));
  });

  it('applies wrap when enabled', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack wrap={true}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      flexWrap: 'wrap',
    }));
  });

  it('applies nowrap by default', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack>
        <Text>Item</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      flexWrap: 'nowrap',
    }));
  });

  it('applies spacing between children', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack spacing={3}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    // Should have container + spacer views
    expect(views.length).toBeGreaterThan(1);
  });

  it('applies background color', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack bg="primary">
        <Text>Item</Text>
      </HStack>
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
      <HStack p={4} m={2}>
        <Text>Item</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      padding: 16,
      margin: 8,
    }));
  });

  it('renders children without spacing when spacing is 0', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <HStack spacing={0}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </HStack>
    );
    
    const views = UNSAFE_getAllByType(View);
    // Should only have the main container, no spacer views
    expect(views.length).toBe(1);
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