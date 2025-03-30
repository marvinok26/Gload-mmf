// src/utils/animation.utils.js
import { Animated, Easing } from 'react-native';

// Pulse animation
export const createPulseAnimation = (value, duration = 1000) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

// Fade in animation
export const createFadeInAnimation = (value, duration = 500) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

// Fade out animation
export const createFadeOutAnimation = (value, duration = 500) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.ease,
    useNativeDriver: true,
  });
};

// Slide up animation
export const createSlideUpAnimation = (value, fromValue = 100, toValue = 0, duration = 500) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

// Rotate animation
export const createRotateAnimation = (value, duration = 2000) => {
  return Animated.loop(
    Animated.timing(value, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

// Convert rotate value to interpolated string
export const getRotateInterpolation = (value) => {
  return value.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};