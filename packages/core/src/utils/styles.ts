import { ViewStyle } from 'react-native';
import { UtilityProps } from '../types';
import { defaultTokens } from '../theme/tokens';

export const processUtilityProps = (props: UtilityProps): ViewStyle => {
  const style: ViewStyle = {};
  const { spacing, radius } = defaultTokens;

  // Margin
  if (props.m !== undefined) {
    style.margin = spacing[props.m] || props.m;
  }
  if (props.mt !== undefined) {
    style.marginTop = spacing[props.mt] || props.mt;
  }
  if (props.mr !== undefined) {
    style.marginRight = spacing[props.mr] || props.mr;
  }
  if (props.mb !== undefined) {
    style.marginBottom = spacing[props.mb] || props.mb;
  }
  if (props.ml !== undefined) {
    style.marginLeft = spacing[props.ml] || props.ml;
  }
  if (props.mx !== undefined) {
    style.marginHorizontal = spacing[props.mx] || props.mx;
  }
  if (props.my !== undefined) {
    style.marginVertical = spacing[props.my] || props.my;
  }

  // Padding
  if (props.p !== undefined) {
    style.padding = spacing[props.p] || props.p;
  }
  if (props.pt !== undefined) {
    style.paddingTop = spacing[props.pt] || props.pt;
  }
  if (props.pr !== undefined) {
    style.paddingRight = spacing[props.pr] || props.pr;
  }
  if (props.pb !== undefined) {
    style.paddingBottom = spacing[props.pb] || props.pb;
  }
  if (props.pl !== undefined) {
    style.paddingLeft = spacing[props.pl] || props.pl;
  }
  if (props.px !== undefined) {
    style.paddingHorizontal = spacing[props.px] || props.px;
  }
  if (props.py !== undefined) {
    style.paddingVertical = spacing[props.py] || props.py;
  }

  // Size
  if (props.w !== undefined) {
    style.width = props.w as any;
  }
  if (props.h !== undefined) {
    style.height = props.h as any;
  }
  if (props.minW !== undefined) {
    style.minWidth = props.minW as any;
  }
  if (props.maxW !== undefined) {
    style.maxWidth = props.maxW as any;
  }
  if (props.minH !== undefined) {
    style.minHeight = props.minH as any;
  }
  if (props.maxH !== undefined) {
    style.maxHeight = props.maxH as any;
  }

  // Flex
  if (props.flex !== undefined) {
    style.flex = props.flex;
  }
  if (props.flexGrow !== undefined) {
    style.flexGrow = props.flexGrow;
  }
  if (props.flexShrink !== undefined) {
    style.flexShrink = props.flexShrink;
  }

  // Visual
  if (props.opacity !== undefined) {
    style.opacity = props.opacity;
  }
  if (props.rounded !== undefined) {
    const radiusValue = radius[props.rounded as keyof typeof radius];
    style.borderRadius = radiusValue !== undefined ? radiusValue : 0;
  }

  return style;
};