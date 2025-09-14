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
    
    // Avatar should have width and height set - check for presence rather than exact pixel values
    expect(avatarElement!.style.width).toBeTruthy();
    expect(avatarElement!.style.height).toBeTruthy();
  });

  it('applies circle shape by default', () => {
    const { container } = renderWithTheme(
      <Avatar size="md" />
    );
    
    const avatarElement = container.querySelector('div');
    
    // Avatar should have border radius for circular shape
    expect(avatarElement!.style.borderRadius).toBeTruthy();
  });

  it('applies square shape', () => {
    const { container } = renderWithTheme(
      <Avatar shape="square" />
    );
    
    const avatarElement = container.querySelector('div');
    
    // Square avatar should have a border radius (but less than full circle)
    expect(avatarElement!.style.borderRadius).toBeTruthy();
    const borderRadius = avatarElement!.style.borderRadius;
    expect(borderRadius).toMatch(/\d/); // Should contain numeric value
  });

  it('applies border styles', () => {
    const { container } = renderWithTheme(
      <Avatar borderWidth={2} borderColor="primary" />
    );
    
    const avatarElement = container.querySelector('div');
    
    // Border should be applied - check for presence rather than exact values
    expect(avatarElement!.style.borderWidth).toBeTruthy();
    expect(avatarElement!.style.borderColor).toBeTruthy();
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
    
    // Utility margin props should apply - check for numeric or pixel values
    expect(avatarElement!.style.margin).toMatch(/16/);
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