import React from 'react';
import {
  TextInput,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Size } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface InputProps extends BaseComponentProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'phone';
  size?: Size;
  variant?: 'outline' | 'filled' | 'underline';
  error?: boolean;
  errorMessage?: string;
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export const Input: VRNComponent<InputProps> = ({
  placeholder,
  type = 'text',
  size = 'md',
  variant = 'outline',
  error = false,
  errorMessage,
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();

  const getKeyboardType = (type: string): TextInputProps['keyboardType'] => {
    const types = {
      email: 'email-address' as const,
      number: 'numeric' as const,
      phone: 'phone-pad' as const,
      text: 'default' as const,
      password: 'default' as const,
    };
    return types[type as keyof typeof types] || 'default';
  };

  const getSizeStyles = (size: Size) => {
    const styles = {
      xs: { paddingHorizontal: 8, paddingVertical: 6, minHeight: 32, fontSize: 14 },
      sm: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36, fontSize: 14 },
      md: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 44, fontSize: 16 },
      lg: { paddingHorizontal: 20, paddingVertical: 16, minHeight: 52, fontSize: 18 },
      xl: { paddingHorizontal: 24, paddingVertical: 20, minHeight: 60, fontSize: 20 },
    };
    return styles[size] || styles.md;
  };

  const getVariantStyles = (variant: string, error: boolean) => {
    const borderColor = error ? getColor('danger') : getColor('border');
    
    const styles = {
      outline: {
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: tokens.radius.md,
        backgroundColor: getColor('surface'),
      },
      filled: {
        borderWidth: 0,
        borderRadius: tokens.radius.md,
        backgroundColor: getColor('background'),
      },
      underline: {
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        backgroundColor: 'transparent',
        borderRadius: 0,
      },
    };
    return styles[variant as keyof typeof styles] || styles.outline;
  };

  const sizeStyle = getSizeStyles(size);
  const variantStyle = getVariantStyles(variant, error);

  const containerStyle: ViewStyle = {
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const inputStyle: TextStyle = {
    ...sizeStyle,
    ...variantStyle,
    color: getColor('text'),
    fontSize: sizeStyle.fontSize,
    opacity: editable ? 1 : 0.6,
  };

  const labelStyle: TextStyle = {
    ...tokens.typography.label,
    color: getColor('textLight'),
    marginBottom: tokens.spacing[1],
  };

  const errorStyle: TextStyle = {
    ...tokens.typography.caption,
    color: getColor('danger'),
    marginTop: tokens.spacing[1],
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={getColor('textLight')}
        keyboardType={getKeyboardType(type)}
        secureTextEntry={type === 'password'}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        autoCorrect={type !== 'email' && type !== 'password'}
      />
      {error && errorMessage && <Text style={errorStyle}>{errorMessage}</Text>}
    </View>
  );
};

Input.__vrn__ = {
  type: 'Input',
  category: 'Inputs',
  props: {
    placeholder: {
      type: 'string',
      default: 'Enter text...',
    },
    type: {
      type: 'enum',
      options: ['text', 'email', 'password', 'number', 'phone'],
      default: 'text',
    },
    size: {
      type: 'enum',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      default: 'md',
    },
    variant: {
      type: 'enum',
      options: ['outline', 'filled', 'underline'],
      default: 'outline',
      preview: true,
    },
    label: {
      type: 'string',
    },
    multiline: {
      type: 'boolean',
      default: false,
    },
    numberOfLines: {
      type: 'number',
      default: 1,
    },
    editable: {
      type: 'boolean',
      default: true,
    },
  },
  bindable: {
    value: {
      type: 'state',
      valueType: 'string',
    },
    onChangeText: {
      type: 'action',
      required: false,
    },
    error: {
      type: 'state',
      valueType: 'boolean',
    },
    errorMessage: {
      type: 'state',
      valueType: 'string',
    },
  },
  container: false,
  acceptsChildren: false,
} as ComponentMetadata;