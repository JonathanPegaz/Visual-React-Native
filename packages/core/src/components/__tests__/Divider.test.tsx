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
    
    // Horizontal divider should have small height and full width
    expect(divider!.style.height).toMatch(/1/);
    expect(divider!.style.width).toBe('100%');
  });

  it('applies vertical orientation', () => {
    const { container } = renderWithTheme(
      <Divider orientation="vertical" />
    );
    
    const divider = container.querySelector('div');
    
    // Vertical divider should have small width and full height
    expect(divider!.style.width).toMatch(/1/);
    expect(divider!.style.height).toBe('100%');
  });

  it('applies custom thickness', () => {
    const { container } = renderWithTheme(
      <Divider thickness={3} />
    );
    
    const divider = container.querySelector('div');
    
    // Custom thickness should be applied
    expect(divider!.style.height).toMatch(/3/);
  });

  it('applies custom length', () => {
    const { container } = renderWithTheme(
      <Divider length={200} />
    );
    
    const divider = container.querySelector('div');
    
    // Custom length should be applied
    expect(divider!.style.width).toMatch(/200/);
  });

  it('applies custom color', () => {
    const { container } = renderWithTheme(
      <Divider color="primary" />
    );
    
    const divider = container.querySelector('div');
    
    expect(divider!.style.backgroundColor).toBeTruthy();
  });

  it('applies spacing for horizontal divider', () => {
    const { container } = renderWithTheme(
      <Divider spacing={4} />
    );
    
    // Divider should render with spacing prop
    const divider = container.querySelector('div');
    expect(divider).toBeTruthy();
  });

  it('applies spacing for vertical divider', () => {
    const { container } = renderWithTheme(
      <Divider orientation="vertical" spacing={2} />
    );
    
    // Vertical divider should render with spacing prop
    const divider = container.querySelector('div');
    expect(divider).toBeTruthy();
  });

  it('applies utility props', () => {
    const { container } = renderWithTheme(
      <Divider m={3} />
    );
    
    const divider = container.querySelector('div');
    
    // Utility margin props should apply - check for numeric or pixel values
    expect(divider!.style.margin).toMatch(/12/);
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