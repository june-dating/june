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
      router.push("/gpt");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      setTimeout(() => {
        try {
          router.replace("/gpt");
        } catch (fallbackError) {
          console.error("Fallback navigation error:", fallbackError);
        }
      }, 100);
    }
  };

  // Staggered entrance animations
  useEffect(() => {
    // Title slide in from left (immediate, faster)
    titleOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
    titleTranslateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });

    // Subtitle entrance (300ms delay, fast)
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
      subtitleTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
    }, 300);

    // Progress bar entrance (900ms delay)
    setTimeout(() => {
      progressOpacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });

      // Progress bar fill animation (completes by ~3.5s total)
      progressWidth.value = withTiming(
        1,
        {
          duration: 2200,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        },
        (finished) => {
          if (finished) runOnJS(navigateToAccess)();
        }
      );
    }, 900);
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
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
          <View style={styles.headerContainer}>
            <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
              <Text style={styles.title}>{`Time to go\ndeeper`}</Text>
            </Animated.View>
            <Animated.View
              style={[styles.subtitleContainer, subtitleAnimatedStyle]}
            >
              <Text style={styles.subtitle}>
                June will know you better than yourself.
              </Text>
            </Animated.View>
          </View>
          {/* Pink1 image above progress bar */}
          <View style={styles.progressBarCenterer}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={require("../assets/images/pink1.png")}
                style={styles.pink1Image}
                resizeMode="contain"
              />
            </View>
            <Animated.View
              style={[styles.progressContainer, progressContainerStyle]}
            >
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressFillStyle]}>
                  <LinearGradient
                    colors={["#B8860B", "#CD853F", "#D2691E"]}
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
    justifyContent: "flex-start",
  },
  headerContainer: {
    alignItems: "flex-start",
    marginBottom: 36,
    width: "100%",
  },
  textContainer: {
    alignItems: "flex-start",
    marginBottom: 8,
    width: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "left",
    marginBottom: 8,
    fontFamily: "Fraunces",
  },
  subtitleContainer: {
    alignItems: "flex-start",
    marginBottom: 0,
    width: "100%",
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: 26,
    fontFamily: "Montserrat",
    marginHorizontal: 0,
    paddingBottom: 30,
    maxWidth: "85%",
  },
  progressBarCenterer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    top: -130,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center", // changed from flex-start
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
  pink1Image: {
    width: width * 0.32,
    height: width * 0.32,
    marginBottom: 0,
  },
});
