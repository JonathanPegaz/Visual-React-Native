import { View } from 'react-native';
import { Divider } from '../Divider';
import { customRender } from '../../test/setup';

const renderWithTheme = customRender;

describe('Divider', () => {
  it('renders correctly', () => {
    const { UNSAFE_getByType } = renderWithTheme(<Divider />);
    expect(UNSAFE_getByType(View)).toBeTruthy();
  });

  it('applies horizontal orientation by default', () => {
    const { UNSAFE_getByType } = renderWithTheme(<Divider />);
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      height: 1,
      width: '100%',
    }));
  });

  it('applies vertical orientation', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider orientation="vertical" />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      width: 1,
      height: '100%',
    }));
  });

  it('applies custom thickness', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider thickness={3} />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      height: 3,
    }));
  });

  it('applies custom length', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider length={200} />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      width: 200,
    }));
  });

  it('applies custom color', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider color="primary" />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      backgroundColor: expect.any(String),
    }));
  });

  it('applies spacing for horizontal divider', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider spacing={4} />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      marginVertical: 16,
    }));
  });

  it('applies spacing for vertical divider', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider orientation="vertical" spacing={2} />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      marginHorizontal: 8,
    }));
  });

  it('applies utility props', () => {
    const { UNSAFE_getByType } = renderWithTheme(
      <Divider m={3} />
    );
    
    const divider = UNSAFE_getByType(View);
    const styles = divider.props.style;
    
    expect(styles).toMatchObject(expect.objectContaining({
      margin: 12,
    }));
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