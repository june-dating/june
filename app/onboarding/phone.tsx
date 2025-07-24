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
import { supabase } from "../../lib/supabase/supabase";
import { OnboardingColors } from "../colors/index";
import { Country, CountryPickerModal } from "../components/CountryPickerModal";
import ProgressBar from "../components/ProgressBar";
import { useOnboarding } from "../contexts/OnboardingContext";

const { width, height } = Dimensions.get("window");

// Default country (United States)
const defaultCountry: Country = {
  name: "United States",
  code: "US",
  callingCode: "+1",
  flag: "🇺🇸",
};

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  // Country selection state
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(defaultCountry);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Initialize phone from context (remove country code prefix for display)
  const initializePhone = () => {
    if (onboardingData.phone_number) {
      // Remove the country calling code to show just the national number
      const phoneWithoutCode = onboardingData.phone_number.replace(
        selectedCountry.callingCode,
        ""
      );
      return phoneWithoutCode;
    }
    return "";
  };

  const [phone, setPhone] = useState(initializePhone());
  const [isValid, setIsValid] = useState(!!onboardingData.phone_number);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verificationInputRef = useRef<TextInput>(null);

  const buttonScale = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const checkIconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  // Slide animation values
  const phoneSlideX = useSharedValue(0);
  const verificationSlideX = useSharedValue(width);

  const validatePhone = (phone: string, country: Country) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Different validation rules for different countries
    if (country.callingCode === "+1") {
      // US/Canada
      return cleanPhone.length === 10;
    } else if (country.callingCode === "+44") {
      // UK
      return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    } else if (country.callingCode === "+91") {
      // India
      return cleanPhone.length === 10;
    } else if (country.callingCode === "+81") {
      // Japan
      return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    } else {
      // General validation for other countries (7-15 digits)
      return cleanPhone.length >= 7 && cleanPhone.length <= 15;
    }
  };

  const formatPhoneNumber = (text: string, country: Country) => {
    // Remove all non-digit characters
    const cleanPhone = text.replace(/\D/g, "");

    if (country.callingCode === "+1") {
      // US/Canada formatting
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
    } else {
      // For other countries, just add spaces every 3-4 digits
      return cleanPhone.replace(/(\d{2,3})(?=\d)/g, "$1 ");
    }
  };

  const savePhoneToContext = (phoneNumber: string, country: Country) => {
    // Save in database format with country calling code prefix
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const formattedPhone = `${country.callingCode}${cleanPhone}`;
    updateOnboardingData({ phone_number: formattedPhone });
  };

  const setPhoneVerified = () => {
    // Mark phone as verified in context
    updateOnboardingData({ phone_verified: true });
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text, selectedCountry);
    setPhone(formatted);
    const valid = validatePhone(text, selectedCountry);
    setIsValid(valid);
    setError(null); // Clear any previous errors

    if (valid) {
      checkIconOpacity.value = withTiming(1, { duration: 200 });
      // Save to context when valid
      savePhoneToContext(formatted, selectedCountry);
    } else {
      checkIconOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    // Clear phone when country changes
    setPhone("");
    setIsValid(false);
    checkIconOpacity.value = withTiming(0, { duration: 200 });
    console.log("🌍 Selected country:", country.name, country.callingCode);
  };

  const sendOTP = async () => {
    if (!isValid) return;

    const cleanPhone = phone.replace(/\D/g, "");
    const fullPhoneNumber = `${selectedCountry.callingCode}${cleanPhone}`;

    // Console log the phone number when user clicks Next/Send Code
    console.log("📱 Sending OTP to phone number:", fullPhoneNumber);
    console.log("📱 Selected country:", selectedCountry.name);
    console.log("📱 Formatted display phone:", phone);

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (error) {
        console.error("OTP Send Error:", error);

        // More specific error handling
        if (error.message.includes("Invalid From Number")) {
          setError(
            "Phone authentication is not properly configured. Please contact support."
          );
        } else if (error.message.includes("rate limit")) {
          setError("Too many requests. Please wait a moment and try again.");
        } else if (error.message.includes("invalid phone number")) {
          setError(
            "Please enter a valid phone number for the selected country."
          );
        } else {
          setError(error.message || "Failed to send verification code");
        }

        setIsLoading(false);
        return;
      }

      console.log("✅ OTP sent successfully");
      // Save phone to context before proceeding
      savePhoneToContext(phone, selectedCountry);

      // Animate to verification screen
      animateToVerification();
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (verificationCode.length !== 6) return;

    setIsVerifying(true);
    setError(null);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const fullPhoneNumber = `${selectedCountry.callingCode}${cleanPhone}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: verificationCode,
        type: "sms",
      });

      if (error) {
        console.error("OTP Verify Error:", error);
        setError(error.message || "Invalid verification code");
        setIsVerifying(false);
        return;
      }

      if (data.user) {
        // Mark phone as verified in context
        setPhoneVerified();

        router.push("/celebrate");
      }
    } catch (err: any) {
      console.error("Unexpected verification error:", err);
      setError("An unexpected error occurred during verification.");
    } finally {
      setIsVerifying(false);
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
      runOnJS(setError)(null);
    });
  };

  const handleNext = () => {
    if (isValid && !showVerification) {
      sendOTP();
    } else if (showVerification && verificationCode.length === 6) {
      verifyOTP();
    }
  };

  const handleEditPhone = () => {
    animateToPhone();
  };

  const handleVerificationCodeChange = (text: string) => {
    // Only allow digits and limit to 6 characters
    const cleanCode = text.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(cleanCode);
    setError(null); // Clear errors when user types
  };

  const handleResendCode = async () => {
    setVerificationCode("");
    setError(null);
    await sendOTP();
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

    // Set check icon if we already have a valid phone from context
    if (
      onboardingData.phone_number &&
      validatePhone(onboardingData.phone_number, selectedCountry)
    ) {
      checkIconOpacity.value = withTiming(1);
    }
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

      {/* Country Picker Modal */}
      <CountryPickerModal
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelectCountry={handleCountrySelect}
        selectedCountry={selectedCountry}
      />

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
                    ? `Code sent to ${selectedCountry.callingCode} ${phone}`
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
                  {/* Error Message - Above Input */}
                  {!showVerification && error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <View style={styles.inputWrapper}>
                    {/* Clickable Country Code */}
                    <TouchableOpacity
                      style={styles.countryCode}
                      onPress={() => setShowCountryPicker(true)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.countryFlag}>
                        {selectedCountry.flag}
                      </Text>
                      <Text style={styles.countryCodeText}>
                        {selectedCountry.callingCode}
                      </Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={handlePhoneChange}
                      placeholder={
                        selectedCountry.callingCode === "+1"
                          ? "(555) 123-4567"
                          : "Your number"
                      }
                      placeholderTextColor={OnboardingColors.text.tertiary}
                      autoFocus
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="phone-pad"
                      editable={!isLoading}
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
                  {/* Error Message - Above Input */}
                  {showVerification && error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

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
                      editable={!isVerifying}
                    />

                    {verificationCode.length === 6 && !isVerifying && (
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

                  {/* Resend Code Button */}
                  {showVerification && (
                    <TouchableOpacity
                      onPress={handleResendCode}
                      style={styles.resendButton}
                      disabled={isLoading}
                    >
                      <Text style={styles.resendButtonText}>
                        {isLoading ? "Sending..." : "Resend Code"}
                      </Text>
                    </TouchableOpacity>
                  )}
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
                    (showVerification && verificationCode.length !== 6) ||
                    isLoading ||
                    isVerifying
                      ? styles.buttonDisabled
                      : null,
                  ]}
                  onPress={handleNext}
                  disabled={
                    (!isValid && !showVerification) ||
                    (showVerification && verificationCode.length !== 6) ||
                    isLoading ||
                    isVerifying
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      (isValid && !showVerification && !isLoading) ||
                      (showVerification &&
                        verificationCode.length === 6 &&
                        !isVerifying)
                        ? OnboardingColors.background.buttonEnabled
                        : OnboardingColors.background.buttonDisabled
                    }
                    style={styles.buttonGradient}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        ((!isValid && !showVerification) ||
                          (showVerification && verificationCode.length !== 6) ||
                          isLoading ||
                          isVerifying) &&
                          styles.buttonTextDisabled,
                      ]}
                    >
                      {isLoading
                        ? "Sending..."
                        : isVerifying
                        ? "Verifying..."
                        : showVerification
                        ? "Verify"
                        : "Send Code"}
                    </Text>
                    {!showVerification && !isLoading && (
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
    fontFamily: "Montserrat",
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
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: OnboardingColors.border.countryCode,
    paddingVertical: 4,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    color: OnboardingColors.text.countryCode,
    fontWeight: "600",
    fontFamily: "Montserrat",
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
  },
  checkIcon: {
    marginLeft: 12,
  },
  verificationIcon: {
    marginRight: 12,
  },
  resendButton: {
    marginTop: 16,
    alignSelf: "flex-start",
  },
  resendButtonText: {
    fontSize: 16,
    color: OnboardingColors.text.editButton,
    textDecorationLine: "underline",
    fontWeight: "500",
    fontFamily: "Montserrat",
  },
  errorContainer: {
    marginTop: 0,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
    fontFamily: "Montserrat",
    fontWeight: "500",
    lineHeight: 20,
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
