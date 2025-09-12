// React Native components (View, Image) are rendered as div and img in DOM
import { Image } from '../Image';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Image', () => {
  it('renders correctly with URI source', () => {
    const { container } = renderWithTheme(
      <Image source={{ uri: 'https://example.com/image.jpg' }} />
    );
    
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('renders correctly with string source', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" />
    );
    
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('applies correct image source for URI', () => {
    const { container } = renderWithTheme(
      <Image source={{ uri: 'https://example.com/image.jpg' }} />
    );
    
    const image = container.querySelector('img');
    expect(image?.getAttribute('src')).toBe('https://example.com/image.jpg');
  });

  it('applies correct image source for string URL', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" />
    );
    
    const image = container.querySelector('img');
    expect(image?.getAttribute('src')).toBe('https://example.com/image.jpg');
  });

  it('applies default resize mode (cover)', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" />
    );
    
    const image = container.querySelector('img');
    const styles = getComputedStyle(image!);
    
    expect(styles.objectFit).toBe('cover');
  });

  it('applies custom resize mode', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" fit="contain" />
    );
    
    const image = container.querySelector('img');
    const styles = getComputedStyle(image!);
    
    expect(styles.objectFit).toBe('contain');
  });

  it('applies aspect ratio', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" ratio="16:9" />
    );
    
    const imageContainer = container.querySelector('div');
    const styles = getComputedStyle(imageContainer!);
    
    expect(styles.aspectRatio).toBe('1.7777777777777777');
  });

  it('applies border radius', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" rounded="lg" />
    );
    
    const imageContainer = container.querySelector('div');
    const styles = getComputedStyle(imageContainer!);
    
    expect(parseInt(styles.borderRadius.replace('px', ''))).toBeGreaterThan(0);
    expect(styles.overflow).toBe('hidden');
  });

  it('applies accessibility props when alt is provided', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" alt="A beautiful landscape" />
    );
    
    const image = container.querySelector('img');
    expect(image?.getAttribute('alt')).toBe('A beautiful landscape');
  });

  it('applies utility props to container', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" m={4} p={2} />
    );
    
    const imageContainer = container.querySelector('div');
    const styles = getComputedStyle(imageContainer!);
    
    expect(styles.margin).toBe('16px');
    expect(styles.padding).toBe('8px');
  });

  it('applies square aspect ratio correctly', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" ratio="1:1" />
    );
    
    const imageContainer = container.querySelector('div');
    const styles = getComputedStyle(imageContainer!);
    
    expect(styles.aspectRatio).toBe('1');
  });

  it('handles invalid aspect ratio gracefully', () => {
    const { container } = renderWithTheme(
      <Image source="https://example.com/image.jpg" ratio="invalid" />
    );
    
    const imageContainer = container.querySelector('div');
    const styles = getComputedStyle(imageContainer!);
    
    expect(styles.aspectRatio).toBe('auto');
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