import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Spacing } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: Spacing;
  length?: number | string;
}

export const Divider: VRNComponent<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color = 'border',
  spacing = 0,
  length,
  style,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();

  const isHorizontal = orientation === 'horizontal';
  const spacingValue = tokens.spacing[spacing] || 0;

  const dividerStyle: ViewStyle = {
    backgroundColor: getColor(color),
    ...(isHorizontal
      ? {
          height: thickness,
          width: (length as any) || '100%',
          marginVertical: spacingValue,
        }
      : {
          width: thickness,
          height: (length as any) || '100%',
          marginHorizontal: spacingValue,
        }),
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  return <View style={dividerStyle} />;
};

Divider.__vrn__ = {
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
} as ComponentMetadata;