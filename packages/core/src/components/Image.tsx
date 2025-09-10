import React from 'react';
import { Image as RNImage, View, ViewStyle, ImageStyle } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Radius } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface ImageProps extends BaseComponentProps {
  source: string | { uri: string } | number;
  ratio?: string; // "16:9", "4:3", "1:1", etc.
  fit?: 'cover' | 'contain' | 'stretch' | 'center';
  rounded?: Radius;
  loading?: 'lazy' | 'eager';
  alt?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const Image: VRNComponent<ImageProps> = ({
  source,
  ratio,
  fit = 'cover',
  rounded = 'none',
  loading = 'lazy',
  alt,
  onLoad,
  onError,
  style,
  ...utilityProps
}) => {
  const { tokens } = useTheme();

  const getAspectRatio = (ratio?: string): number | undefined => {
    if (!ratio) return undefined;
    
    const [width, height] = ratio.split(':').map(Number);
    if (width && height) {
      return width / height;
    }
    return undefined;
  };

  const aspectRatio = getAspectRatio(ratio);

  const containerStyle: ViewStyle = {
    overflow: 'hidden',
    borderRadius: tokens.radius[rounded],
    ...(aspectRatio && { aspectRatio }),
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    resizeMode: fit,
  };

  const getImageSource = () => {
    if (typeof source === 'string') {
      if (source.startsWith('http') || source.startsWith('file://')) {
        return { uri: source };
      }
      // For local assets, we'd need to use require(), but that needs to be done at build time
      // For now, treat string paths as URIs
      return { uri: source };
    }
    return source;
  };

  return (
    <View style={containerStyle}>
      <RNImage
        source={getImageSource()}
        style={imageStyle}
        onLoad={onLoad}
        onError={onError}
        accessible={!!alt}
        accessibilityLabel={alt}
      />
    </View>
  );
};

Image.__vrn__ = {
  type: 'Image',
  category: 'Media',
  props: {
    source: {
      type: 'string',
      required: true,
    },
    ratio: {
      type: 'enum',
      options: ['1:1', '4:3', '16:9', '3:2', '2:1'],
    },
    fit: {
      type: 'enum',
      options: ['cover', 'contain', 'stretch', 'center'],
      default: 'cover',
    },
    rounded: {
      type: 'enum',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      default: 'none',
    },
    loading: {
      type: 'enum',
      options: ['lazy', 'eager'],
      default: 'lazy',
    },
    alt: {
      type: 'string',
    },
  },
  bindable: {
    source: {
      type: 'state',
      valueType: 'string',
      required: true,
    },
  },
  container: false,
  acceptsChildren: false,
} as ComponentMetadata;