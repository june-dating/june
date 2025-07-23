import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "./colors/index";

const { width } = Dimensions.get("window");

export default function CelebrateScreen() {
  const insets = useSafeAreaInsets();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateX = useSharedValue(-50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);
  const progressOpacity = useSharedValue(0);

  // Auto-redirect function with error handling
  const navigateToAccess = () => {
    try {
      router.push("/access");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      setTimeout(() => {
        try {
          router.replace("/access");
        } catch (fallbackError) {
          console.error("Fallback navigation error:", fallbackError);
        }
      }, 100);
    }
  };

  // Staggered entrance animations
  useEffect(() => {
    // Title slide in from left (immediate, slower)
    titleOpacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.quad),
    });
    titleTranslateX.value = withTiming(0, {
      duration: 1500,
      easing: Easing.out(Easing.quad),
    });

    // Subtitle entrance (800ms delay, slower)
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.quad),
      });
      subtitleTranslateY.value = withTiming(0, {
        duration: 1200,
        easing: Easing.out(Easing.quad),
      });
    }, 800);

    // Progress bar entrance (1500ms delay)
    setTimeout(() => {
      progressOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });

      // Progress bar fill animation (completes by 4000ms total)
      progressWidth.value = withTiming(
        1,
        {
          duration: 1900,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        },
        (finished) => {
          if (finished) runOnJS(navigateToAccess)();
        }
      );
    }, 1500);
  }, []);

  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateX: titleTranslateX.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const progressContainerStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const progressFillStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle={OnboardingColors.statusBar} />

      <LinearGradient
        colors={[
          OnboardingColors.gradient.primary,
          OnboardingColors.gradient.secondary,
          OnboardingColors.gradient.tertiary,
        ]}
        style={styles.gradient}
        start={{ x: 1, y: 1.3 }}
        end={{ x: 0, y: 0 }}
      >
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {/* Left-aligned Content */}
          <View style={styles.leftContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/onboarding/junelogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
              <Text style={styles.title}>That's It.</Text>
            </Animated.View>

            <Animated.View
              style={[styles.subtitleContainer, subtitleAnimatedStyle]}
            >
              <Text style={styles.subtitle}>
                One last step before the real magic begins.
              </Text>
            </Animated.View>

            {/* Progress Bar Below Text */}
            <Animated.View
              style={[styles.progressContainer, progressContainerStyle]}
            >
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressFillStyle]}>
                  <LinearGradient
                    colors={["#B8860B", "#CD853F", "#D2691E"]} // Darker golden gradient
                    style={styles.progressGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "left",
    lineHeight: 56,
    fontFamily: "Fraunces",
  },
  subtitleContainer: {
    alignItems: "flex-start",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: 24,
    fontFamily: "Montserrat",
    maxWidth: "85%",
  },
  progressContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 0,
  },
  progressTrack: {
    width: width * 0.6, // 60% of screen width
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
    borderRadius: 3,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
});
