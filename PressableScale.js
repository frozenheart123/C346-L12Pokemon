import React, { useRef } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then((value) => {
  reduceMotion = value;
});

const PressableScale = ({ children, style, onPress, scaleTo = 0.96, ...rest }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: value,
      speed: 40,
      bounciness: 8,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      hitSlop={8}
      accessibilityRole="button"
      {...rest}
      style={[{ cursor: 'pointer' }, style, { transform: [{ scale: scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
};

export default PressableScale;
