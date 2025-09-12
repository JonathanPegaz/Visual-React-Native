// React Native components (View, Image) are rendered as div and img in DOM
import { Avatar } from '../Avatar';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Avatar', () => {
  it('renders with default props', () => {
    const { container } = renderWithTheme(<Avatar />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders fallback text', () => {
    const { getByText } = renderWithTheme(
      <Avatar fallback="AB" />
    );
    expect(getByText('AB')).toBeTruthy();
  });

  it('applies size styles correctly', () => {
    const { container } = renderWithTheme(
      <Avatar size="lg" />
    );
    
    const avatarElement = container.querySelector('div');
    const styles = getComputedStyle(avatarElement!);
    
    expect(styles.width).toBe('64px');
    expect(styles.height).toBe('64px');
  });

  it('applies circle shape by default', () => {
    const { container } = renderWithTheme(
      <Avatar size="md" />
    );
    
    const avatarElement = container.querySelector('div');
    const styles = getComputedStyle(avatarElement!);
    
    expect(styles.borderRadius).toBe('24px'); // half of 48px width for circle
  });

  it('applies square shape', () => {
    const { container } = renderWithTheme(
      <Avatar shape="square" />
    );
    
    const avatarElement = container.querySelector('div');
    const styles = getComputedStyle(avatarElement!);
    
    const borderRadiusValue = parseInt(styles.borderRadius.replace('px', ''));
    expect(borderRadiusValue).toBeGreaterThan(0);
    // Square should have smaller border radius than circle
    expect(borderRadiusValue).toBeLessThan(24);
  });

  it('applies border styles', () => {
    const { container } = renderWithTheme(
      <Avatar borderWidth={2} borderColor="primary" />
    );
    
    const avatarElement = container.querySelector('div');
    const styles = getComputedStyle(avatarElement!);
    
    expect(styles.borderWidth).toBe('2px');
    expect(styles.borderColor).toBeTruthy();
  });

  it('renders image with URI source', () => {
    const { container } = renderWithTheme(
      <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} />
    );
    
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('renders image with string URL', () => {
    const { container } = renderWithTheme(
      <Avatar source="https://example.com/avatar.jpg" />
    );
    
    expect(container.querySelector('img')).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Avatar m={4} />
    );
    
    const avatarElement = container.querySelector('div');
    const styles = getComputedStyle(avatarElement!);
    
    expect(styles.margin).toBe('16px');
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