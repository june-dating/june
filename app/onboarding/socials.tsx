import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressBar from "../components/ProgressBar";

const { width, height } = Dimensions.get("window");

type SocialPlatform = "instagram" | "snapchat" | "twitter";

interface SocialData {
  username: string;
  isValid: boolean;
  isFocused: boolean;
}

export default function SocialsScreen() {
  const insets = useSafeAreaInsets();
  const [socialData, setSocialData] = useState<
    Record<SocialPlatform, SocialData>
  >({
    instagram: { username: "", isValid: false, isFocused: false },
    snapchat: { username: "", isValid: false, isFocused: false },
    twitter: { username: "", isValid: false, isFocused: false },
  });
  const [isAnyValid, setIsAnyValid] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Animation values
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const platformsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Refs for text inputs
  const inputRefs = useRef<Record<SocialPlatform, TextInput | null>>({
    instagram: null,
    snapchat: null,
    twitter: null,
  });

  useEffect(() => {
    // Animate elements on mount with staggered timing
    titleOpacity.value = withTiming(1, { duration: 600 });
    subtitleOpacity.value = withTiming(1, { duration: 800 });
    platformsOpacity.value = withTiming(1, { duration: 1000 });

    // Keyboard handling
    const keyboardWillShow = (event: any) => {
      const keyboardHeight = event.endCoordinates.height;
      setKeyboardHeight(keyboardHeight);
      setIsKeyboardVisible(true);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const updateSocialData = (
    platform: SocialPlatform,
    updates: Partial<SocialData>
  ) => {
    setSocialData((prev) => {
      const newData = {
        ...prev,
        [platform]: { ...prev[platform], ...updates },
      };

      // Check if any platform has valid data
      const hasValid = Object.values(newData).some((data) => data.isValid);
      setIsAnyValid(hasValid);

      return newData;
    });
  };

  const validateUsername = (
    username: string,
    platform: SocialPlatform
  ): boolean => {
    const trimmed = username.trim();

    if (platform === "instagram" || platform === "twitter") {
      // Allow letters, numbers, dots, underscores
      const validPattern = /^[a-zA-Z0-9._]+$/;
      return (
        trimmed.length >= 3 &&
        trimmed.length <= 30 &&
        validPattern.test(trimmed)
      );
    } else if (platform === "snapchat") {
      // Snapchat allows letters, numbers, dots, underscores, hyphens
      const validPattern = /^[a-zA-Z0-9._-]+$/;
      return (
        trimmed.length >= 3 &&
        trimmed.length <= 15 &&
        validPattern.test(trimmed)
      );
    }

    return trimmed.length >= 3;
  };

  const handleUsernameChange = (text: string, platform: SocialPlatform) => {
    // Remove @ symbol if user types it
    const cleaned = text.replace("@", "");
    const isValid = validateUsername(cleaned, platform);

    updateSocialData(platform, { username: cleaned, isValid });
  };

  const handleInputFocus = (platform: SocialPlatform) => {
    updateSocialData(platform, { isFocused: true });

    // Dismiss other inputs
    Object.keys(inputRefs.current).forEach((key) => {
      if (key !== platform && inputRefs.current[key as SocialPlatform]) {
        inputRefs.current[key as SocialPlatform]?.blur();
      }
    });
  };

  const handleInputBlur = (platform: SocialPlatform) => {
    updateSocialData(platform, { isFocused: false });
  };

  const handlePlatformPress = (platform: SocialPlatform) => {
    // Focus the input
    inputRefs.current[platform]?.focus();
  };

  const handleNext = () => {
    if (isAnyValid) {
      router.push("/onboarding/phone");
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    Object.values(inputRefs.current).forEach((ref) => ref?.blur());
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram":
        return "logo-instagram";
      case "snapchat":
        return "logo-snapchat";
      case "twitter":
        return "logo-twitter";
      default:
        return "logo-instagram";
    }
  };

  const getPlatformName = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram":
        return "Instagram";
      case "snapchat":
        return "Snapchat";
      case "twitter":
        return "Twitter/X";
      default:
        return "Instagram";
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram":
        return "#E4405F";
      case "snapchat":
        return "#FFFC00";
      case "twitter":
        return "#1DA1F2";
      default:
        return "#E4405F";
    }
  };

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const animatedPlatformsStyle = useAnimatedStyle(() => ({
    opacity: platformsOpacity.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#3d1a5a", "#5a2a7a", "#8a4bb8"]}
        style={styles.gradient}
        start={{ x: 1, y: 1.3 }}
        end={{ x: 0, y: 0 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
              {/* Progress Bar - Top Left (F-Pattern Start) */}
              <View style={styles.progressContainer}>
                <ProgressBar progress={70} step={5} totalSteps={6} />
              </View>

              {/* Header - Top Left (F-Pattern Start) */}
              <Animated.View style={[styles.header, animatedTitleStyle]}>
                <Text style={styles.title}>Connect your socials</Text>
                <Animated.View style={animatedSubtitleStyle}>
                  <Text style={styles.subtitle}>
                    Share your social media to connect with others
                  </Text>
                </Animated.View>
              </Animated.View>

              {/* Social Platforms - Left Side (F-Pattern Middle) */}
              <Animated.View
                style={[styles.platformsContainer, animatedPlatformsStyle]}
              >
                {(Object.keys(socialData) as SocialPlatform[]).map(
                  (platform) => {
                    const data = socialData[platform];
                    const isSelected = data.isFocused || data.isValid;
                    const isTyping = data.isFocused;

                    return (
                      <TouchableOpacity
                        key={platform}
                        style={[
                          styles.platformCard,
                          isSelected && styles.platformCardSelected,
                        ]}
                        onPress={() => handlePlatformPress(platform)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.platformIconContainer,
                            isTyping && styles.platformIconContainerTyping,
                          ]}
                        >
                          <Ionicons
                            name={getPlatformIcon(platform)}
                            size={20}
                            color={
                              isSelected ? "#FFF" : "rgba(255, 255, 255, 0.7)"
                            }
                          />
                        </View>

                        <View style={styles.platformContent}>
                          <TextInput
                            ref={(ref) => {
                              inputRefs.current[platform] = ref;
                            }}
                            style={[
                              styles.platformInput,
                              isSelected && styles.platformInputSelected,
                            ]}
                            value={data.username}
                            onChangeText={(text) =>
                              handleUsernameChange(text, platform)
                            }
                            onFocus={() => handleInputFocus(platform)}
                            onBlur={() => handleInputBlur(platform)}
                            placeholder={`${
                              platform.charAt(0).toUpperCase() +
                              platform.slice(1)
                            }`}
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={dismissKeyboard}
                          />
                        </View>

                        {data.isValid && (
                          <View style={styles.validationIcon}>
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#FFF"
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }
                )}
              </Animated.View>

              {/* Next Button - Bottom Right (F-Pattern End) - Hidden when keyboard is visible */}
              {!isKeyboardVisible && (
                <View style={styles.buttonContainer}>
                  <Animated.View
                    style={[styles.buttonWrapper, animatedButtonStyle]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.button,
                        !isAnyValid && styles.buttonDisabled,
                      ]}
                      onPress={handleNext}
                      disabled={!isAnyValid}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={
                          isAnyValid
                            ? ["#FFF", "#F0F0F0"]
                            : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]
                        }
                        style={styles.buttonGradient}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            !isAnyValid && styles.buttonTextDisabled,
                          ]}
                        >
                          Next
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={20}
                          color={
                            isAnyValid ? "#8a4bb8" : "rgba(255,255,255,0.5)"
                          }
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 12,
    textAlign: "left",
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "left",
    lineHeight: 24,
    maxWidth: "85%",
  },
  platformsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
    minHeight: 200,
    paddingBottom: 20,
  },
  platformCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#8a4bb8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    maxWidth: "90%",
  },
  platformCardSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "#FFF",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  platformIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  platformIconContainerTyping: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  platformContent: {
    flex: 1,
  },
  platformInput: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  platformInputSelected: {
    color: "#FFF",
  },
  validationIcon: {
    marginLeft: 12,
  },
  buttonContainer: {
    alignItems: "flex-end",
    paddingTop: 16,
    marginBottom: 40,
  },
  buttonWrapper: {
    shadowColor: "#8a4bb8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    elevation: 12,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
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
    color: "#8a4bb8",
    marginRight: 8,
  },
  buttonTextDisabled: {
    color: "rgba(255, 255, 255, 0.5)",
  },
});
