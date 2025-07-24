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
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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

type LookingForOption = "male" | "female" | "everyone";

export default function LookingForScreen() {
  const insets = useSafeAreaInsets();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  // Initialize from context if available
  const [selectedOption, setSelectedOption] = useState<LookingForOption | null>(
    onboardingData.looking_for || null
  );

  const buttonScale = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const saveLookingForToContext = (option: LookingForOption) => {
    updateOnboardingData({ looking_for: option });
  };

  const handleOptionSelect = (option: LookingForOption) => {
    setSelectedOption(option);
    // Save to context and auto-navigate when option is selected
    saveLookingForToContext(option);
    router.push("/onboarding/socials");
  };

  const isValid = selectedOption !== null;

  const handleNext = () => {
    if (isValid && selectedOption) {
      // Ensure data is saved before navigation
      saveLookingForToContext(selectedOption);
      router.push("/onboarding/socials");
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
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
              <ProgressBar progress={58} step={4} totalSteps={6} />
            </View>

            {/* Header - Top Left (F-Pattern Start) */}
            <Animated.View style={[styles.header, animatedTitleStyle]}>
              <Text style={styles.title}>Who are you looking for?</Text>
              <Animated.View style={animatedSubtitleStyle}>
                <Text style={styles.subtitle}>
                  This helps us find the right people for you.
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Options - Left Side (F-Pattern Middle) */}
            <Animated.View
              style={[styles.optionsContainer, animatedInputStyle]}
            >
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedOption === "female" && styles.optionSelected,
                ]}
                onPress={() => handleOptionSelect("female")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="female"
                  size={24}
                  color={
                    selectedOption === "female"
                      ? OnboardingColors.icon.primary
                      : OnboardingColors.icon.secondary
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === "female" && styles.optionTextSelected,
                  ]}
                >
                  Women
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  selectedOption === "male" && styles.optionSelected,
                ]}
                onPress={() => handleOptionSelect("male")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="male"
                  size={24}
                  color={
                    selectedOption === "male"
                      ? OnboardingColors.icon.primary
                      : OnboardingColors.icon.secondary
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === "male" && styles.optionTextSelected,
                  ]}
                >
                  Men
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  selectedOption === "everyone" && styles.optionSelected,
                ]}
                onPress={() => handleOptionSelect("everyone")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="people"
                  size={24}
                  color={
                    selectedOption === "everyone"
                      ? OnboardingColors.icon.primary
                      : OnboardingColors.icon.secondary
                  }
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === "everyone" && styles.optionTextSelected,
                  ]}
                >
                  Everyone
                </Text>
              </TouchableOpacity>
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
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    marginBottom: verticalScale(12),
    textAlign: "left",
    lineHeight: scale(44),
    fontFamily: "Fraunces",
  },
  subtitle: {
    fontSize: scale(16),
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: scale(26),
    maxWidth: "85%",
    fontFamily: "Montserrat",
    // fontWeight: "300",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: verticalScale(20),
    minHeight: verticalScale(120),
  },
  option: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: OnboardingColors.border.input,
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(16),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.light,
    maxWidth: "90%",
  },
  optionSelected: {
    backgroundColor: OnboardingColors.background.inputSelected,
    borderColor: OnboardingColors.border.inputSelected,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  optionText: {
    fontSize: scale(18),
    fontWeight: "300",
    color: OnboardingColors.text.secondary,
    marginLeft: scale(16),
    fontFamily: "Fraunces",
  },
  optionTextSelected: {
    color: OnboardingColors.text.primary,
    fontWeight: "300",
    fontFamily: "Fraunces",
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
  changeLaterText: {
    fontSize: scale(14),
    color: OnboardingColors.text.changeLater,
    marginTop: verticalScale(8),
    fontStyle: "italic",
    fontFamily: "Fraunces",
    fontWeight: "300",
  },
});
