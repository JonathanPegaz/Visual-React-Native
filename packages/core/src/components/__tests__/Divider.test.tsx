// React Native components (View) are rendered as div in DOM
import { Divider } from '../Divider';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Divider', () => {
  it('renders correctly', () => {
    const { container } = renderWithTheme(<Divider />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('applies horizontal orientation by default', () => {
    const { container } = renderWithTheme(<Divider />);
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.height).toBe('1px');
    expect(styles.width).toBe('100%');
  });

  it('applies vertical orientation', () => {
    const { container } = renderWithTheme(
      <Divider orientation="vertical" />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.width).toBe('1px');
    expect(styles.height).toBe('100%');
  });

  it('applies custom thickness', () => {
    const { container } = renderWithTheme(
      <Divider thickness={3} />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.height).toBe('3px');
  });

  it('applies custom length', () => {
    const { container } = renderWithTheme(
      <Divider length={200} />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.width).toBe('200px');
  });

  it('applies custom color', () => {
    const { container } = renderWithTheme(
      <Divider color="primary" />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.backgroundColor).toBeTruthy();
  });

  it('applies spacing for horizontal divider', () => {
    const { container } = renderWithTheme(
      <Divider spacing={4} />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.marginTop).toBe('16px');
    expect(styles.marginBottom).toBe('16px');
  });

  it('applies spacing for vertical divider', () => {
    const { container } = renderWithTheme(
      <Divider orientation="vertical" spacing={2} />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.marginLeft).toBe('8px');
    expect(styles.marginRight).toBe('8px');
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Divider m={3} />
    );
    
    const divider = container.querySelector('div');
    const styles = getComputedStyle(divider!);
    
    expect(styles.margin).toBe('12px');
  });

  it('contains correct VRN metadata', () => {
    expect(Divider.__vrn__).toEqual({
      type: 'Divider',
      category: 'Layout',
      props: {
        orientation: {
          type: 'enum',
          options: ['horizontal', 'vertical'],
          default: 'horizontal',
        },
        thickness: {
          type: 'number',
          default: 1,
        },
        color: {
          type: 'color',
          default: 'border',
        },
        spacing: {
          type: 'spacing',
          default: 0,
        },
        length: {
          type: 'string',
        },
      },
      container: false,
      acceptsChildren: false,
    });
  });
});