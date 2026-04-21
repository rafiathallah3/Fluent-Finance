import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

// A simple decorative mock chart to give a premium feel 
// before integrating a real interactive chart library.
export default function VisualMetaphors({ isProfitable = true }: { isProfitable?: boolean }) {
  const chartColor = isProfitable ? '#22c55e' : '#ef4444'; // Green or Red
  
  // Smooth animated pulsing dot at the end of the chart
  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(withTiming(0.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true
      ),
      transform: [
        {
          scale: withRepeat(
            withSequence(withTiming(1.2, { duration: 1000 }), withTiming(0.8, { duration: 1000 })),
            -1,
            true
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Svg height="150" width={width - 32} viewBox="0 0 100 40">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={chartColor} stopOpacity="0.3" />
            <Stop offset="1" stopColor={chartColor} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>
        <Path
          d="M 0 30 Q 10 20 20 25 T 40 15 T 60 20 T 80 5 L 100 10 L 100 40 L 0 40 Z"
          fill="url(#grad)"
        />
        <Path
          d="M 0 30 Q 10 20 20 25 T 40 15 T 60 20 T 80 5 L 100 10"
          fill="none"
          stroke={chartColor}
          strokeWidth="2"
        />
      </Svg>
      
      {/* Tracker Dot Location (approximate to path end) */}
      <Animated.View style={[styles.dot, { backgroundColor: chartColor, left: width - 36, top: 22 }, pulseStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
    position: 'relative',
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
