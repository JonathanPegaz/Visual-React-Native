import React from 'react';
import {
  ScrollView,
  View,
  ViewStyle,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseComponentProps, ComponentMetadata, VRNComponent } from '../types';
import { useTheme } from '../hooks/useTheme';
import { processUtilityProps } from '../utils/styles';

export interface ScreenProps extends BaseComponentProps {
  safe?: boolean;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  center?: boolean;
}

export const Screen: VRNComponent<ScreenProps> = ({
  children,
  safe = true,
  scroll = false,
  keyboardAvoiding = true,
  center = false,
  style,
  bg,
  ...utilityProps
}) => {
  const { getColor } = useTheme();
  
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: bg ? getColor(bg) : getColor('background'),
    ...(center && {
      justifyContent: 'center',
      alignItems: 'center',
    }),
    ...processUtilityProps(utilityProps),
    ...(style as ViewStyle),
  };

  const Container = safe ? SafeAreaView : View;
  
  const content = scroll ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={center ? styles.centerContent : undefined}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  if (keyboardAvoiding && Platform.OS === 'ios') {
    return (
      <Container style={containerStyle}>
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          {content}
        </KeyboardAvoidingView>
      </Container>
    );
  }

  return <Container style={containerStyle}>{content}</Container>;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Screen.__vrn__ = {
  type: 'Screen',
  category: 'Layout',
  props: {
    safe: {
      type: 'boolean',
      default: true,
    },
    scroll: {
      type: 'boolean',
      default: false,
    },
    keyboardAvoiding: {
      type: 'boolean',
      default: true,
    },
    center: {
      type: 'boolean',
      default: false,
    },
    bg: {
      type: 'color',
      default: 'background',
    },
  },
  container: true,
  acceptsChildren: true,
} as ComponentMetadata;