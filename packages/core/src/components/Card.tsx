import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Shadow, Radius } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface CardProps extends BaseComponentProps {
  shadow?: Shadow;
  rounded?: Radius;
  border?: boolean;
  pressable?: boolean;
  onPress?: () => void;
}

export const Card: VRNComponent<CardProps> = ({
  children,
  shadow = 'md',
  rounded = 'md',
  border = false,
  pressable = false,
  onPress,
  style,
  bg,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: bg ? getColor(bg) : getColor('surface'),
    borderRadius: tokens.radius[rounded],
    ...(shadow && shadow !== 'none' ? tokens.shadows[shadow] : {}),
    ...(border && {
      borderWidth: 1,
      borderColor: getColor('border'),
    }),
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

Card.__vrn__ = {
  type: 'Card',
  category: 'Containers',
  props: {
    shadow: {
      type: 'enum',
      options: ['none', 'sm', 'md', 'lg'],
      default: 'md',
      preview: true,
    },
    rounded: {
      type: 'enum',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      default: 'md',
    },
    border: {
      type: 'boolean',
      default: false,
    },
    pressable: {
      type: 'boolean',
      default: false,
    },
    bg: {
      type: 'color',
      default: 'surface',
    },
  },
  bindable: {
    onPress: {
      type: 'action',
      required: false,
    },
  },
  container: true,
  acceptsChildren: true,
} as ComponentMetadata;