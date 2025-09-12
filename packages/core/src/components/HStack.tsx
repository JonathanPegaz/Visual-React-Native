import { Children, Fragment } from 'react';
import { View, ViewStyle } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Spacing } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface HStackProps extends BaseComponentProps {
  spacing?: Spacing;
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
}

export const HStack: VRNComponent<HStackProps> = ({
  children,
  spacing = 0,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  style,
  bg,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();
  
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    backgroundColor: bg ? getColor(bg) : undefined,
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const spacingValue = tokens.spacing[spacing] || 0;
  const childrenArray = Children.toArray(children);
  
  return (
    <View style={containerStyle}>
      {childrenArray.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && spacing > 0 && (
            <View style={{ width: spacingValue }} />
          )}
          {child}
        </Fragment>
      ))}
    </View>
  );
};

HStack.__vrn__ = {
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
} as ComponentMetadata;