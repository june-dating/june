import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SwingHeader() {
  const insets = useSafeAreaInsets();
  const swingRotation = useSharedValue(0);

  React.useEffect(() => {
    // Gentle swinging animation
    swingRotation.value = withRepeat(
      withTiming(1, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1, // Infinite repeat
      true // Reverse
    );
  }, []);

  const animatedSwingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${swingRotation.value * 5}deg`, // 5 degrees swing
      },
    ],
  }));

  return (
    <View style={[styles.container, { top: insets.top + 4 }]}>
      {/* Background gradient for Dynamic Island integration */}
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "transparent"]}
        style={styles.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Rope extension */}
      <View style={styles.rope} />

      {/* Swing with couple */}
      <Animated.View style={[styles.swingContainer, animatedSwingStyle]}>
        <Image
          source={require("../../assets/images/onboarding/img3.jpg")}
          style={styles.swingImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
    alignItems: "center",
  },
  backgroundGradient: {
    position: "absolute",
    width: 200,
    height: 60,
    borderRadius: 30,
    top: -20,
  },
  rope: {
    width: 2,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 1,
  },
  swingContainer: {
    alignItems: "center",
  },
  swingImage: {
    width: 120,
    height: 200,
    borderRadius: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
