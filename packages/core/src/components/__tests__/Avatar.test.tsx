import { Avatar } from '../Avatar';
import { customRender, View, Image } from '../../__tests__/setup';

const renderWithTheme = customRender;

describe('Avatar', () => {
  it('renders with default props', () => {
    const { UNSAFE_getByType } = renderWithTheme(<Avatar />);
    expect(UNSAFE_getByType(View)).toBeTruthy();
  });

  it('renders fallback text', () => {
    const { getByText } = renderWithTheme(
      <Avatar fallback="AB" />
    );
    expect(getByText('AB')).toBeTruthy();
  });

  it('applies size styles correctly', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar size="lg" />
    );
    
    const container = UNSAFE_getByType(View);
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      width: 64,
      height: 64,
    }));
  });

  it('applies circle shape by default', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar size="md" />
    );
    
    const container = UNSAFE_getByType(View);
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderRadius: 24, // half of 48px width for circle
    }));
  });

  it('applies square shape', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar shape="square" />
    );
    
    const container = UNSAFE_getByType(View);
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderRadius: expect.any(Number),
    }));
    // Square should have smaller border radius than circle
    expect(styles.borderRadius).toBeLessThan(24);
  });

  it('applies border styles', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar borderWidth={2} borderColor="primary" />
    );
    
    const container = UNSAFE_getByType(View);
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderWidth: 2,
      borderColor: expect.any(String),
    }));
  });

  it('renders image with URI source', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} />
    );
    
    expect(UNSAFE_getByType(Image)).toBeTruthy();
  });

  it('renders image with string URL', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar source="https://example.com/avatar.jpg" />
    );
    
    expect(UNSAFE_getByType(Image)).toBeTruthy();
  });

  it('applies utility props', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Avatar m={4} />
    );
    
    const container = UNSAFE_getByType(View);
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      margin: 16,
    }));
  });

  it('contains correct VRN metadata', () => {
    expect(Avatar.__vrn__).toEqual({
      type: 'Avatar',
      category: 'Media',
      props: {
        size: {
          type: 'enum',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
          preview: true,
        },
        shape: {
          type: 'enum',
          options: ['circle', 'square'],
          default: 'circle',
        },
        fallback: {
          type: 'string',
          default: 'AB',
        },
        borderWidth: {
          type: 'number',
          default: 0,
        },
        borderColor: {
          type: 'color',
          default: 'border',
        },
      },
      bindable: {
        source: {
          type: 'state',
          valueType: 'string',
        },
      },
      container: false,
      acceptsChildren: false,
    });
  });
});