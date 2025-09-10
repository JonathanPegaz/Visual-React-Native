import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BaseComponentProps, ComponentMetadata, VRNComponent, Spacing } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface StackProps extends BaseComponentProps {
  spacing?: Spacing;
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  dividers?: boolean;
}

export const Stack: VRNComponent<StackProps> = ({
  children,
  spacing = 0,
  align = 'stretch',
  justify = 'flex-start',
  dividers = false,
  style,
  bg,
  ...utilityProps
}) => {
  const { getColor, tokens } = useTheme();
  
  const containerStyle: ViewStyle = {
    flexDirection: 'column',
    alignItems: align,
    justifyContent: justify,
    backgroundColor: bg ? getColor(bg) : undefined,
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const spacingValue = tokens.spacing[spacing] || 0;

  const childrenArray = React.Children.toArray(children);
  
  return (
    <View style={containerStyle}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && spacing > 0 && (
            <View style={{ height: spacingValue }} />
          )}
          {index > 0 && dividers && (
            <View style={[styles.divider, { backgroundColor: getColor('border') }]} />
          )}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});

Stack.__vrn__ = {
  type: 'Stack',
  category: 'Layout',
  props: {
    spacing: {
      type: 'spacing',
      default: 0,
    },
    align: {
      type: 'enum',
      options: ['stretch', 'flex-start', 'flex-end', 'center'],
      default: 'stretch',
    },
    justify: {
      type: 'enum',
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      default: 'flex-start',
    },
    dividers: {
      type: 'boolean',
      default: false,
    },
  },
  container: true,
  acceptsChildren: true,
} as ComponentMetadata;