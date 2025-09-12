import { Text as RNText, TextStyle } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, TextVariant } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface TextProps extends BaseComponentProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | '500' | '600' | 'bold';
  numberOfLines?: number;
}

export const Text: VRNComponent<TextProps> = ({
  children,
  variant = 'body',
  color = 'text',
  align = 'left',
  weight,
  numberOfLines,
  style,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();
  
  const variantStyle = tokens.typography[variant];
  
  const textStyle: TextStyle = {
    ...variantStyle,
    color: getColor(color),
    textAlign: align,
    fontWeight: weight || variantStyle.fontWeight,
    ...processUtilityProps(utilityProps),
    ...(style as TextStyle),
  };

  return (
    <RNText style={textStyle} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

Text.__vrn__ = {
  type: 'Text',
  category: 'Typography',
  props: {
    variant: {
      type: 'enum',
      options: ['h1', 'h2', 'h3', 'body', 'caption', 'label'],
      default: 'body',
      preview: true,
    },
    color: {
      type: 'color',
      default: 'text',
    },
    align: {
      type: 'enum',
      options: ['left', 'center', 'right'],
      default: 'left',
    },
    weight: {
      type: 'enum',
      options: ['normal', '500', '600', 'bold'],
    },
    numberOfLines: {
      type: 'number',
    },
    children: {
      type: 'string',
      default: 'Text',
      inline: true,
    },
  },
  container: false,
  acceptsChildren: false,
} as ComponentMetadata;