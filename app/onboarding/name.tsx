import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors/index";
import ProgressBar from "../components/ProgressBar";
import { useOnboarding } from "../contexts/OnboardingContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling utility
const guidelineBaseWidth = 390; // iPhone 14 width
const guidelineBaseHeight = 844; // iPhone 14 height
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function NameScreen() {
  const insets = useSafeAreaInsets();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [name, setName] = useState(onboardingData.full_name || "");
  const [isValid, setIsValid] = useState(false);

  const buttonScale = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const checkIconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const handleNameChange = (text: string) => {
    setName(text);
    const valid = text.trim().length >= 2;
    setIsValid(valid);

    if (valid) {
      checkIconOpacity.value = withSpring(1);
      // Save to context immediately when valid
      updateOnboardingData({ full_name: text.trim() });
    } else {
      checkIconOpacity.value = withSpring(0);
    }
  };

  const handleNext = () => {
    if (isValid) {
      // Ensure data is saved before navigation
      updateOnboardingData({ full_name: name.trim() });
      router.push("/onboarding/birthday");
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: checkIconOpacity.value,
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  // Animate elements on mount with staggered timing
  React.useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    subtitleOpacity.value = withTiming(1, { duration: 800 });
    inputOpacity.value = withTiming(1, { duration: 1000 });

    // Check if we already have a valid name from context
    if (onboardingData.full_name && onboardingData.full_name.length >= 2) {
      setIsValid(true);
      checkIconOpacity.value = withTiming(1);
    }
  }, []);

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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
            {/* Progress Bar - Top Left */}
            <View style={styles.progressContainer}>
              <ProgressBar progress={14} step={1} totalSteps={6} />
            </View>

            {/* Header - Top Left (F-Pattern Start) */}
            <Animated.View style={[styles.header, animatedTitleStyle]}>
              <Text style={styles.title}>What's your name?</Text>
              <Animated.View style={animatedSubtitleStyle}>
                <Text style={styles.subtitle}>Let's start with the basics</Text>
              </Animated.View>
            </Animated.View>

            {/* Input - Left Side (F-Pattern Middle) */}
            <Animated.View style={[styles.inputContainer, animatedInputStyle]}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Enter your full name"
                  placeholderTextColor={OnboardingColors.text.tertiary}
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <Animated.View style={[styles.checkIcon, animatedCheckStyle]}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={OnboardingColors.icon.checkmark}
                  />
                </Animated.View>
              </View>
            </Animated.View>

            {/* Next Button - Bottom Right (F-Pattern End) */}
            <View style={styles.buttonContainer}>
              <Animated.View
                style={[styles.buttonWrapper, animatedButtonStyle]}
              >
                <TouchableOpacity
                  style={[styles.button, !isValid && styles.buttonDisabled]}
                  onPress={handleNext}
                  disabled={!isValid}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isValid
                        ? OnboardingColors.background.buttonEnabled
                        : OnboardingColors.background.buttonDisabled
                    }
                    style={styles.buttonGradient}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !isValid && styles.buttonTextDisabled,
                      ]}
                    >
                      Next
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={
                        isValid
                          ? OnboardingColors.icon.button
                          : OnboardingColors.icon.buttonDisabled
                      }
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
    justifyContent: "space-between",
  },
  progressContainer: {
    marginBottom: verticalScale(32),
  },
  header: {
    marginBottom: verticalScale(48),
  },
  title: {
    fontSize: scale(36),
    color: OnboardingColors.text.primary,
    marginBottom: verticalScale(12),
    textAlign: "left",
    lineHeight: scale(44),
    fontFamily: "Fraunces",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: scale(18),
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: scale(24),
    maxWidth: "85%",
    fontFamily: "Montserrat",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: verticalScale(20),
    minHeight: verticalScale(120),
  },
  inputWrapper: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: OnboardingColors.border.input,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(20),
    minHeight: verticalScale(60),
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.light,
    maxWidth: "90%",
  },
  input: {
    flex: 1,
    fontSize: scale(18),
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
  },
  checkIcon: {
    marginLeft: scale(12),
  },
  buttonContainer: {
    alignItems: "flex-end",
    paddingTop: verticalScale(16),
    marginBottom: verticalScale(40),
  },
  buttonWrapper: {
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
  },
  button: {
    borderRadius: scale(20),
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: OnboardingColors.opacity.buttonDisabled,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(22),
  },
  buttonText: {
    fontSize: scale(18),
    fontWeight: "700",
    color: OnboardingColors.text.button,
    marginRight: scale(8),
    fontFamily: "Fraunces",
  },
  buttonTextDisabled: {
    color: OnboardingColors.text.buttonDisabled,
    fontWeight: "700",
    fontFamily: "Fraunces",
  },
});
