import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedStringWaveProps {
  text: string;
}

export function AnimatedStringWave({ text }: AnimatedStringWaveProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start the animation when the component mounts
    rotation.value = withRepeat(
      withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
      4, // Repeat 4 times
      true // Reverse the animation on each repeat
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    // Interpolate the rotation value from 0-1 to 0-25 degrees and back
    const rotateValue = rotation.value * 25;
    return {
      transform: [{ rotate: `${rotateValue}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          animatedStyle,
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Adjust container styles as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});