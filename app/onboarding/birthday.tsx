import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
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
  Extrapolate,
  interpolate,
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

export default function BirthdayScreen() {
  const insets = useSafeAreaInsets();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  // Initialize birthday from context if it exists
  const initialBirthday = onboardingData.birth_date
    ? new Date(onboardingData.birth_date)
    : null;
  const [birthday, setBirthday] = useState<Date | null>(initialBirthday);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(
    initialBirthday || new Date(2000, 5, 8) // Default to June 8, 2000 (appropriate for 18+ users)
  );
  const [isValid, setIsValid] = useState(!!initialBirthday);

  const buttonScale = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const checkIconOpacity = useSharedValue(0);
  const pickerHeight = useSharedValue(0);
  const pickerOpacity = useSharedValue(0);
  const pickerScale = useSharedValue(0.8);
  const pickerBlur = useSharedValue(0);
  const glassOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const validateAge = (date: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    // Calculate exact age
    let exactAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      exactAge--;
    }

    // Must be between 18 and 99 years old
    return exactAge >= 18 && exactAge <= 99;
  };

  const saveBirthdayToContext = (date: Date) => {
    // Save in ISO format (YYYY-MM-DD) for database compatibility
    const isoDateString = date.toISOString().split("T")[0];
    updateOnboardingData({ birth_date: isoDateString });
  };

  const handleDone = () => {
    setBirthday(tempDate);
    setShowPicker(false);

    // Animate picker out with liquid glass effect
    pickerHeight.value = withSpring(0, { damping: 20, stiffness: 200 });
    pickerOpacity.value = withTiming(0, { duration: 400 });
    pickerScale.value = withSpring(0.8, { damping: 20, stiffness: 200 });
    pickerBlur.value = withTiming(0, { duration: 300 });
    glassOpacity.value = withTiming(0, { duration: 300 });

    // Validate age (must be between 18 and 99 years old)
    const isValidAge = validateAge(tempDate);
    setIsValid(isValidAge);

    if (isValidAge) {
      checkIconOpacity.value = withSpring(1);
      // Save to context
      saveBirthdayToContext(tempDate);
      // Navigate to next screen after a short delay for smooth UX
      setTimeout(() => {
        router.push("/onboarding/gender");
      }, 300);
    } else {
      checkIconOpacity.value = withSpring(0);
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempDate(birthday || new Date(2000, 5, 8)); // Default to June 8, 2000 (appropriate for 18+ users)

    // Animate picker out with liquid glass effect
    pickerHeight.value = withSpring(0, { damping: 20, stiffness: 200 });
    pickerOpacity.value = withTiming(0, { duration: 400 });
    pickerScale.value = withSpring(0.8, { damping: 20, stiffness: 200 });
    pickerBlur.value = withTiming(0, { duration: 300 });
    glassOpacity.value = withTiming(0, { duration: 300 });
  };

  const togglePicker = () => {
    if (showPicker) {
      handleCancel();
    } else {
      setShowPicker(true);
      // Animate picker in with liquid glass effect
      pickerHeight.value = withSpring(verticalScale(240), {
        damping: 20,
        stiffness: 200,
      }); // reduced height
      pickerOpacity.value = withTiming(1, { duration: 400 });
      pickerScale.value = withSpring(1, { damping: 20, stiffness: 200 });
      pickerBlur.value = withTiming(1, { duration: 300 });
      glassOpacity.value = withTiming(1, { duration: 300 });
    }
  };

  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleNext = () => {
    if (isValid && birthday) {
      // Ensure data is saved before navigation
      saveBirthdayToContext(birthday);
      router.push("/onboarding/gender");
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

  const animatedPickerStyle = useAnimatedStyle(() => ({
    height: pickerHeight.value,
    opacity: pickerOpacity.value,
    transform: [
      { scale: pickerScale.value },
      {
        translateY: interpolate(
          pickerHeight.value,
          [0, 280],
          [20, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const animatedGlassStyle = useAnimatedStyle(() => ({
    opacity: glassOpacity.value,
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

    // Check if we already have a valid birthday from context
    if (initialBirthday && validateAge(initialBirthday)) {
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
              <ProgressBar progress={28} step={2} totalSteps={6} />
            </View>

            {/* Header - Top Left (F-Pattern Start) */}
            <Animated.View style={[styles.header, animatedTitleStyle]}>
              <Text style={styles.title}>When's your birthday?</Text>
              <Animated.View style={animatedSubtitleStyle}>
                <Text style={styles.subtitle}>
                  We ask this to keep our platform safe.
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Date Picker Section - Left Side (F-Pattern Middle) */}
            <Animated.View style={[styles.pickerSection, animatedInputStyle]}>
              {/* Date Picker Input */}
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={[
                    styles.inputWrapper,
                    showPicker && styles.inputWrapperActive,
                  ]}
                  onPress={togglePicker}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="calendar"
                    size={24}
                    color={OnboardingColors.icon.tertiary}
                    style={styles.inputIcon}
                  />
                  <Text style={styles.inputText}>
                    {birthday ? formatDate(birthday) : "MM/DD/YYYY"}
                  </Text>
                  <Animated.View style={[styles.checkIcon, animatedCheckStyle]}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={OnboardingColors.icon.checkmark}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {/* Liquid Glass Date Picker */}
              <Animated.View
                style={[styles.pickerContainer, animatedPickerStyle]}
              >
                {showPicker && (
                  <View style={styles.liquidGlassContainer}>
                    {/* Backdrop Blur */}
                    <BlurView
                      intensity={80}
                      tint="dark"
                      style={styles.blurBackdrop}
                    />

                    {/* Liquid Glass Effect */}
                    <Animated.View
                      style={[styles.liquidGlass, animatedGlassStyle]}
                    >
                      {/* Glass Surface */}
                      <View style={styles.glassSurface}>
                        {/* Subtle gradient overlay */}
                        <LinearGradient
                          colors={OnboardingColors.background.glassGradient}
                          style={styles.glassGradient}
                        />

                        {/* Glass border */}
                        <View style={styles.glassBorder} />

                        {/* Inner glow */}
                        <View style={styles.innerGlow} />
                      </View>

                      {/* Picker Header */}
                      <View style={styles.pickerHeader}>
                        <TouchableOpacity
                          onPress={handleCancel}
                          style={styles.headerButton}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.headerButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.pickerTitle}>Select Birthday</Text>
                        <TouchableOpacity
                          onPress={handleDone}
                          style={styles.doneButtonBox}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Date Picker */}
                      <View style={styles.datePickerContainer}>
                        <DateTimePicker
                          value={tempDate}
                          mode="date"
                          display="spinner"
                          onChange={handleDateChange}
                          maximumDate={
                            new Date(
                              new Date().getFullYear() - 18,
                              new Date().getMonth(),
                              new Date().getDate()
                            )
                          }
                          minimumDate={
                            new Date(
                              new Date().getFullYear() - 99,
                              new Date().getMonth(),
                              new Date().getDate()
                            )
                          }
                          textColor={OnboardingColors.text.primary}
                          style={styles.datePicker}
                        />
                      </View>
                    </Animated.View>
                  </View>
                )}
              </Animated.View>
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
    fontSize: scale(16),
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: scale(24),
    maxWidth: "85%",
    fontFamily: "Montserrat",
    // fontWeight: "300",
  },
  pickerSection: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: verticalScale(20),
    minHeight: verticalScale(120),
  },
  inputContainer: {
    marginBottom: 0,
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
  inputWrapperActive: {
    borderColor: OnboardingColors.border.inputActive,
    backgroundColor: OnboardingColors.background.inputActive,
  },
  inputIcon: {
    marginRight: scale(12),
  },
  inputText: {
    flex: 1,
    fontSize: scale(18),
    color: OnboardingColors.text.primary,
    fontWeight: "300",
    // fontFamily: "Fraunces",
  },
  checkIcon: {
    marginLeft: scale(12),
  },
  pickerContainer: {
    overflow: "hidden",
    marginTop: verticalScale(12),
    borderRadius: scale(24),
  },
  liquidGlassContainer: {
    position: "relative",
    borderRadius: scale(24),
    overflow: "hidden",
  },
  blurBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(24),
  },
  liquidGlass: {
    position: "relative",
    borderRadius: scale(24),
    overflow: "hidden",
  },
  glassSurface: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(24),
  },
  glassGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(24),
  },
  glassBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: OnboardingColors.border.glassBorder,
  },
  innerGlow: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: scale(23),
    backgroundColor: OnboardingColors.background.innerGlow,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: OnboardingColors.border.pickerHeader,
  },
  headerButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
    borderRadius: scale(12),
    backgroundColor: OnboardingColors.background.headerButton,
  },
  headerButtonText: {
    color: OnboardingColors.text.headerButton,
    fontSize: scale(15),
    fontWeight: "300",
    fontFamily: "Fraunces",
  },
  // Custom style for the bigger Done button
  doneButtonBox: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(16),
    backgroundColor: OnboardingColors.background.buttonEnabled[0],
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(8),
  },
  doneButtonText: {
    color: OnboardingColors.text.button,
    fontSize: scale(15),
    fontWeight: "600",
    fontFamily: "Fraunces",
  },
  pickerTitle: {
    color: OnboardingColors.text.pickerTitle,
    fontSize: scale(17),
    fontWeight: "600",
    fontFamily: "Fraunces",
  },
  datePickerContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
  datePicker: {
    backgroundColor: "transparent",
    height: verticalScale(180),
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
