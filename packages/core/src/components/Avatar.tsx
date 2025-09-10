import React from 'react';
import { View, Image, Text, ViewStyle, TextStyle, ImageStyle, StyleSheet } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Size } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface AvatarProps extends BaseComponentProps {
  source?: string | { uri: string } | number;
  size?: Size;
  fallback?: string;
  shape?: 'circle' | 'square';
  borderWidth?: number;
  borderColor?: string;
}

export const Avatar: VRNComponent<AvatarProps> = ({
  source,
  size = 'md',
  fallback,
  shape = 'circle',
  borderWidth = 0,
  borderColor,
  style,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();

  const getSizeStyles = (size: Size) => {
    const styles = {
      xs: { width: 24, height: 24, fontSize: 10 },
      sm: { width: 32, height: 32, fontSize: 12 },
      md: { width: 48, height: 48, fontSize: 16 },
      lg: { width: 64, height: 64, fontSize: 20 },
      xl: { width: 96, height: 96, fontSize: 28 },
    };
    return styles[size] || styles.md;
  };

  const sizeStyle = getSizeStyles(size);

  const containerStyle: ViewStyle = {
    width: sizeStyle.width,
    height: sizeStyle.height,
    backgroundColor: getColor('background'),
    borderRadius: shape === 'circle' ? sizeStyle.width / 2 : tokens.radius.md,
    borderWidth,
    borderColor: borderColor ? getColor(borderColor) : getColor('border'),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const imageStyle: ImageStyle = {
    width: '100%' as const,
    height: '100%' as const,
  };

  const fallbackTextStyle: TextStyle = {
    color: getColor('text'),
    fontSize: sizeStyle.fontSize,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  };

  const renderFallback = () => {
    if (fallback) {
      return <Text style={fallbackTextStyle}>{fallback}</Text>;
    }
    return <View style={styles.defaultFallback} />;
  };

  const renderImage = () => {
    if (!source) return renderFallback();

    if (typeof source === 'string') {
      if (source.startsWith('http') || source.startsWith('file://')) {
        return (
          <Image
            source={{ uri: source }}
            style={imageStyle}
            onError={renderFallback}
          />
        );
      }
      // Local asset path
      return renderFallback();
    }

    if (typeof source === 'object' && 'uri' in source) {
      return (
        <Image
          source={source}
          style={imageStyle}
          onError={renderFallback}
        />
      );
    }

    if (typeof source === 'number') {
      return <Image source={source} style={imageStyle} />;
    }

    return renderFallback();
  };

  return <View style={containerStyle}>{renderImage()}</View>;
};

const styles = StyleSheet.create({
  defaultFallback: {
    width: '60%',
    height: '60%',
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
});

Avatar.__vrn__ = {
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
} as ComponentMetadata;