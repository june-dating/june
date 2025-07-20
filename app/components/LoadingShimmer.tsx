import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface LoadingShimmerProps {
  width?: number;
  height?: number;
  borderRadius?: number;
}

export default function LoadingShimmer({
  width = 200,
  height = 20,
  borderRadius = 4,
}: LoadingShimmerProps) {
  const shimmerOpacity = useSharedValue(0.3);

  React.useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  return (
    <Animated.View
      style={[styles.shimmer, { width, height, borderRadius }, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
