import { Stack } from '../Stack';
import { customRender, View, Text } from '../../__tests__/setup';

// Use custom render with theme provider
const renderWithTheme = customRender;

describe('Stack', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithTheme(
      <Stack>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Stack>
    );
    
    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
  });

  it('applies vertical direction by default', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Stack>
        <Text>Child</Text>
      </Stack>
    );
    
    const element = UNSAFE_getByType(View);
    const styles = element.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      flexDirection: 'column',
    }));
  });

  it('applies spacing between children', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Stack spacing={4}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Stack>
    );
    
    // Should have spacer views between children
    const views = UNSAFE_getAllByType(View);
    expect(views.length).toBeGreaterThan(2); // Container + spacer views
  });

  it('applies alignment props', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Stack align="center" justify="space-between">
        <Text>Child</Text>
      </Stack>
    );
    
    const element = UNSAFE_getByType(View);
    const styles = element.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      alignItems: 'center',
      justifyContent: 'space-between',
    }));
  });

  it('applies utility props', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Stack p={6} m={2}>
        <Text>Child</Text>
      </Stack>
    );
    
    const element = UNSAFE_getByType(View);
    const styles = element.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      padding: 24,
      margin: 8,
    }));
  });

  it('applies background color', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Stack bg="primary">
        <Text>Child</Text>
      </Stack>
    );
    
    const element = UNSAFE_getByType(View);
    const styles = element.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('renders dividers when enabled', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Stack dividers={true}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Stack>
    );
    
    // Should have extra views for dividers
    const views = UNSAFE_getAllByType(View);
    expect(views.length).toBeGreaterThan(2); // Container + divider views
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