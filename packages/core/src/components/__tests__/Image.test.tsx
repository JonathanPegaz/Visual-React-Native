import { View, Image as ImageComponent } from 'react-native';
import { Image } from '../Image';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Image', () => {
  it('renders correctly with URI source', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source={{ uri: 'https://example.com/image.jpg' }} />
    );
    
    expect(UNSAFE_getByType(ImageComponent)).toBeTruthy();
  });

  it('renders correctly with string source', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" />
    );
    
    expect(UNSAFE_getByType(ImageComponent)).toBeTruthy();
  });

  it('applies correct image source for URI', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source={{ uri: 'https://example.com/image.jpg' }} />
    );
    
    const image = UNSAFE_getByType(ImageComponent);
    expect(image.props.source).toEqual({ uri: 'https://example.com/image.jpg' });
  });

  it('applies correct image source for string URL', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" />
    );
    
    const image = UNSAFE_getByType(ImageComponent);
    expect(image.props.source).toEqual({ uri: 'https://example.com/image.jpg' });
  });

  it('applies default resize mode (cover)', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" />
    );
    
    const image = UNSAFE_getByType(ImageComponent);
    const styles = image.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      resizeMode: 'cover',
    }));
  });

  it('applies custom resize mode', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" fit="contain" />
    );
    
    const image = UNSAFE_getByType(ImageComponent);
    const styles = image.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      resizeMode: 'contain',
    }));
  });

  it('applies aspect ratio', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" ratio="16:9" />
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      aspectRatio: 16 / 9,
    }));
  });

  it('applies border radius', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" rounded="lg" />
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      borderRadius: expect.any(Number),
      overflow: 'hidden',
    }));
  });

  it('applies accessibility props when alt is provided', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" alt="A beautiful landscape" />
    );
    
    const image = UNSAFE_getByType(ImageComponent);
    expect(image.props.accessible).toBe(true);
    expect(image.props.accessibilityLabel).toBe('A beautiful landscape');
  });

  it('applies utility props to container', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" m={4} p={2} />
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      margin: 16,
      padding: 8,
    }));
  });

  it('applies square aspect ratio correctly', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" ratio="1:1" />
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      aspectRatio: 1,
    }));
  });

  it('handles invalid aspect ratio gracefully', () => {
    const { UNSAFE_getAllByType } = renderWithTheme(
      <Image source="https://example.com/image.jpg" ratio="invalid" />
    );
    
    const views = UNSAFE_getAllByType(View);
    const container = views[0];
    const styles = container.props.style;
    
    expect(styles.aspectRatio).toBeUndefined();
  });

  it('contains correct VRN metadata', () => {
    expect(Image.__vrn__).toEqual({
      type: 'Image',
      category: 'Media',
      props: {
        source: {
          type: 'string',
          required: true,
        },
        ratio: {
          type: 'enum',
          options: ['1:1', '4:3', '16:9', '3:2', '2:1'],
        },
        fit: {
          type: 'enum',
          options: ['cover', 'contain', 'stretch', 'center'],
          default: 'cover',
        },
        rounded: {
          type: 'enum',
          options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
          default: 'none',
        },
        loading: {
          type: 'enum',
          options: ['lazy', 'eager'],
          default: 'lazy',
        },
        alt: {
          type: 'string',
        },
      },
      bindable: {
        source: {
          type: 'state',
          valueType: 'string',
          required: true,
        },
      },
      container: false,
      acceptsChildren: false,
    });
  });
});