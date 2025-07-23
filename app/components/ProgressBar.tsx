import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { OnboardingColors } from "../colors/index";

interface ProgressBarProps {
  progress: number; // 0-100
  step: number;
  totalSteps: number;
  color?: string;
}

export default function ProgressBar({
  progress,
  step,
  totalSteps,
  color = OnboardingColors.background.progressFill,
}: ProgressBarProps) {
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 800 });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: color },
            animatedProgressStyle,
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {step} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  progressBackground: {
    height: 4,
    backgroundColor: OnboardingColors.background.progressBackground,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: OnboardingColors.text.progress,
    textAlign: "right",
    fontWeight: "500",
  },
});
