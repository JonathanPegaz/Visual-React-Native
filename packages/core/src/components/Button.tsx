import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Size, Variant } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export const Button: VRNComponent<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onPress,
  style,
  ...utilityProps
}) => {
  const { getColor } = useTheme();
  
  const isDisabled = disabled || loading;
  
  const getVariantStyles = (variant: Variant) => {
    const styles = {
      primary: {
        backgroundColor: getColor('primary'),
        borderColor: getColor('primary'),
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: getColor('border'),
        borderWidth: 1,
      },
      success: {
        backgroundColor: getColor('success'),
        borderColor: getColor('success'),
      },
      warning: {
        backgroundColor: getColor('warning'),
        borderColor: getColor('warning'),
      },
      danger: {
        backgroundColor: getColor('danger'),
        borderColor: getColor('danger'),
      },
      info: {
        backgroundColor: getColor('info'),
        borderColor: getColor('info'),
      },
    };
    return styles[variant] || styles.primary;
  };

  const getSizeStyles = (size: Size) => {
    const styles = {
      xs: { paddingHorizontal: 12, paddingVertical: 6, minHeight: 32 },
      sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      md: { paddingHorizontal: 20, paddingVertical: 12, minHeight: 44 },
      lg: { paddingHorizontal: 24, paddingVertical: 16, minHeight: 52 },
      xl: { paddingHorizontal: 32, paddingVertical: 20, minHeight: 60 },
    };
    return styles[size] || styles.md;
  };

  const getTextColor = (variant: Variant) => {
    if (variant === 'secondary') return getColor('text');
    return '#FFFFFF';
  };

  const buttonStyle: ViewStyle = {
    ...baseStyles.button,
    ...getVariantStyles(variant),
    ...getSizeStyles(size),
    width: fullWidth ? '100%' : undefined,
    opacity: isDisabled ? 0.5 : 1,
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const textStyle: TextStyle = {
    ...baseStyles.text,
    color: getTextColor(variant),
    fontSize: size === 'xs' || size === 'sm' ? 14 : 16,
    fontWeight: '600',
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor(variant)} />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

Button.__vrn__ = {
  type: 'Button',
  category: 'Inputs',
  props: {
    variant: {
      type: 'enum',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      default: 'primary',
      preview: true,
    },
    size: {
      type: 'enum',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      default: 'md',
    },
    fullWidth: {
      type: 'boolean',
      default: false,
    },
    loading: {
      type: 'boolean',
      default: false,
    },
    disabled: {
      type: 'boolean',
      default: false,
    },
    children: {
      type: 'string',
      default: 'Button',
      inline: true,
    },
  },
  bindable: {
    onPress: {
      type: 'action',
      required: false,
    },
    loading: {
      type: 'state',
      valueType: 'boolean',
    },
    disabled: {
      type: 'state',
      valueType: 'boolean',
    },
  },
  container: false,
  acceptsChildren: false,
} as ComponentMetadata;