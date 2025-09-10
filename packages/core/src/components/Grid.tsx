import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Spacing } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface GridProps extends BaseComponentProps {
  cols?: number;
  gap?: Spacing;
  colsMd?: number; // Tablet columns
  colsLg?: number; // Large tablet columns
}

export const Grid: VRNComponent<GridProps> = ({
  children,
  cols = 2,
  gap = 4,
  colsMd,
  colsLg,
  style,
  bg,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();

  const gapValue = tokens.spacing[gap] || 0;
  
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gapValue / 2,
    backgroundColor: bg ? getColor(bg) : undefined,
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <View style={containerStyle}>
      {childrenArray.map((child, index) => {
        const itemStyle: ViewStyle = {
          width: `${100 / cols}%`,
          paddingHorizontal: gapValue / 2,
          marginBottom: gapValue,
        };

        return (
          <View key={index} style={itemStyle}>
            {child}
          </View>
        );
      })}
    </View>
  );
};

Grid.__vrn__ = {
  type: 'Grid',
  category: 'Layout',
  props: {
    cols: {
      type: 'number',
      default: 2,
    },
    gap: {
      type: 'spacing',
      default: 4,
    },
    colsMd: {
      type: 'number',
    },
    colsLg: {
      type: 'number',
    },
    bg: {
      type: 'color',
    },
  },
  container: true,
  acceptsChildren: true,
} as ComponentMetadata;