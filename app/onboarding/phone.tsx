import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors/index";
import ProgressBar from "../components/ProgressBar";

const { width, height } = Dimensions.get("window");

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const verificationInputRef = useRef<TextInput>(null);

  const buttonScale = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const checkIconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  // Slide animation values
  const phoneSlideX = useSharedValue(0);
  const verificationSlideX = useSharedValue(width);

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");
    // Check if it's a valid phone number (10-15 digits)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleanPhone = text.replace(/\D/g, "");

    // Format based on length
    if (cleanPhone.length <= 3) {
      return cleanPhone;
    } else if (cleanPhone.length <= 6) {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3)}`;
    } else if (cleanPhone.length <= 10) {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(
        3,
        6
      )}-${cleanPhone.slice(6)}`;
    } else {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(
        3,
        6
      )}-${cleanPhone.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
    const valid = validatePhone(text);
    setIsValid(valid);

    if (valid) {
      checkIconOpacity.value = withTiming(1, { duration: 200 });
    } else {
      checkIconOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const animateToVerification = () => {
    // Slide phone view out to the left
    phoneSlideX.value = withTiming(-width, { duration: 400 });
    // Slide verification view in from the right
    verificationSlideX.value = withTiming(0, { duration: 400 }, () => {
      runOnJS(setShowVerification)(true);
    });
  };

  const animateToPhone = () => {
    // Slide verification view out to the right
    verificationSlideX.value = withTiming(width, { duration: 400 });
    // Slide phone view in from the left
    phoneSlideX.value = withTiming(0, { duration: 400 }, () => {
      runOnJS(setShowVerification)(false);
      runOnJS(setVerificationCode)("");
    });
  };

  const handleNext = () => {
    if (isValid && !showVerification) {
      animateToVerification();
    } else if (showVerification && verificationCode.length === 6) {
      router.push("/access");
    }
  };

  const handleEditPhone = () => {
    animateToPhone();
  };

  const handleVerificationCodeChange = (text: string) => {
    // Only allow digits and limit to 6 characters
    const cleanCode = text.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(cleanCode);
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

  // Phone view slide animation
  const phoneSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: phoneSlideX.value }],
  }));

  // Verification view slide animation
  const verificationSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: verificationSlideX.value }],
  }));

  // Animate elements on mount with staggered timing
  React.useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    subtitleOpacity.value = withTiming(1, { duration: 800 });
    inputOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  // Focus verification input when screen is shown
  useEffect(() => {
    if (showVerification && verificationInputRef.current) {
      verificationInputRef.current.focus();
    }
  }, [showVerification]);

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
            <ProgressBar progress={100} step={6} totalSteps={6} />

            {/* Header - Top Left (F-Pattern Start) */}
            <Animated.View style={[styles.header, animatedTitleStyle]}>
              <Text style={styles.title}>
                {showVerification
                  ? "Enter verification code"
                  : "What's your phone number?"}
              </Text>
              <Animated.View style={animatedSubtitleStyle}>
                <Text style={styles.subtitle}>
                  {showVerification
                    ? `Code sent to +1 ${phone}`
                    : "We'll send you a verification code via SMS"}
                </Text>
                {showVerification && (
                  <TouchableOpacity
                    onPress={handleEditPhone}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>Edit phone number</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </Animated.View>

            {/* Input Container with Slide Animations */}
            <View style={styles.inputContainer}>
              {/* Phone Input View */}
              <Animated.View style={[styles.slideContainer, phoneSlideStyle]}>
                <Animated.View
                  style={[styles.inputContainer, animatedInputStyle]}
                >
                  <View style={styles.inputWrapper}>
                    <View style={styles.countryCode}>
                      <Text style={styles.countryCodeText}>
                        <Text style={{ fontSize: 23 }}>🇺🇸</Text> +1
                      </Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={handlePhoneChange}
                      placeholder="(555) 123-4567"
                      placeholderTextColor={OnboardingColors.text.tertiary}
                      autoFocus
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="phone-pad"
                    />
                    <Animated.View
                      style={[styles.checkIcon, animatedCheckStyle]}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={OnboardingColors.icon.checkmark}
                      />
                    </Animated.View>
                  </View>
                </Animated.View>
              </Animated.View>

              {/* Verification Code View */}
              <Animated.View
                style={[styles.slideContainer, verificationSlideStyle]}
              >
                <Animated.View
                  style={[styles.inputContainer, animatedInputStyle]}
                >
                  <View style={styles.inputWrapper}>
                    <View style={styles.verificationIcon}>
                      <Ionicons
                        name="key"
                        size={20}
                        color={OnboardingColors.icon.tertiary}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      value={verificationCode}
                      onChangeText={handleVerificationCodeChange}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor={OnboardingColors.text.tertiary}
                      ref={verificationInputRef}
                      autoFocus={showVerification}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="number-pad"
                      maxLength={6}
                    />

                    {verificationCode.length === 6 && (
                      <Animated.View
                        style={[styles.checkIcon, animatedCheckStyle]}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={OnboardingColors.icon.checkmark}
                        />
                      </Animated.View>
                    )}
                  </View>
                </Animated.View>
              </Animated.View>
            </View>

            {/* Next Button - Bottom Right (F-Pattern End) */}
            <View style={styles.buttonContainer}>
              <Animated.View
                style={[styles.buttonWrapper, animatedButtonStyle]}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    (!isValid && !showVerification) ||
                    (showVerification && verificationCode.length !== 6)
                      ? styles.buttonDisabled
                      : null,
                  ]}
                  onPress={handleNext}
                  disabled={
                    (!isValid && !showVerification) ||
                    (showVerification && verificationCode.length !== 6)
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      (isValid && !showVerification) ||
                      (showVerification && verificationCode.length === 6)
                        ? OnboardingColors.background.buttonEnabled
                        : OnboardingColors.background.buttonDisabled
                    }
                    style={styles.buttonGradient}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        ((!isValid && !showVerification) ||
                          (showVerification &&
                            verificationCode.length !== 6)) &&
                          styles.buttonTextDisabled,
                      ]}
                    >
                      {showVerification ? "Done" : "Next"}
                    </Text>
                    {!showVerification && (
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={
                          isValid
                            ? OnboardingColors.icon.button
                            : OnboardingColors.icon.buttonDisabled
                        }
                      />
                    )}
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
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBackground: {
    height: 4,
    backgroundColor: OnboardingColors.background.progressBackground,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: OnboardingColors.background.progressFill,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: OnboardingColors.text.progress,
    textAlign: "right",
    fontWeight: "500",
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    marginBottom: 12,
    textAlign: "left",
    lineHeight: 44,
    fontFamily: "Fraunces",
  },
  subtitle: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: 24,
    maxWidth: "85%",
    fontWeight: "300",
    fontFamily: "Fraunces",
  },
  editButton: {
    marginTop: 12,
  },
  editButtonText: {
    fontSize: 16,
    color: OnboardingColors.text.editButton,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
    minHeight: 120,
  },
  slideContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  inputWrapper: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: OnboardingColors.border.input,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.light,
    maxWidth: "90%",
  },
  countryCode: {
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: OnboardingColors.border.countryCode,
  },
  countryCodeText: {
    fontSize: 18,
    color: OnboardingColors.text.countryCode,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: OnboardingColors.text.primary,
    fontWeight: "300",
    // fontFamily: "Fraunces",
  },
  checkIcon: {
    marginLeft: 12,
  },
  verificationIcon: {
    marginRight: 12,
  },
  buttonContainer: {
    alignItems: "flex-end",
    paddingTop: 16,
    marginBottom: 0,
  },
  buttonWrapper: {
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: OnboardingColors.opacity.buttonDisabled,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: OnboardingColors.text.button,
    marginRight: 8,
    fontFamily: "Fraunces",
  },
  buttonTextDisabled: {
    color: OnboardingColors.text.buttonDisabled,
    fontWeight: "700",
    fontFamily: "Fraunces",
  },
});
