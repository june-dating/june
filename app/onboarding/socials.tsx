import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors/index";
import ProgressBar from "../components/ProgressBar";
import { useOnboarding } from "../contexts/OnboardingContext";

const { width, height } = Dimensions.get("window");

type SocialPlatform = "instagram" | "twitter" | "linkedin";

interface SocialData {
  username: string;
  isValid: boolean;
  isFocused: boolean;
}

export default function SocialsScreen() {
  const insets = useSafeAreaInsets();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  // Initialize social data from context
  const initializeSocialData = (): Record<SocialPlatform, SocialData> => {
    return {
      instagram: {
        username: onboardingData.instagram_username?.replace("@", "") || "",
        isValid: !!onboardingData.instagram_username,
        isFocused: false,
      },
      twitter: {
        username: onboardingData.twitter_username?.replace("@", "") || "",
        isValid: !!onboardingData.twitter_username,
        isFocused: false,
      },
      linkedin: {
        username: onboardingData.linkedin_username || "",
        isValid: !!onboardingData.linkedin_username,
        isFocused: false,
      },
    };
  };

  const [socialData, setSocialData] = useState<
    Record<SocialPlatform, SocialData>
  >(initializeSocialData());
  const [isAnyValid, setIsAnyValid] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Refs for text inputs
  const inputRefs = useRef<Record<SocialPlatform, TextInput | null>>({
    instagram: null,
    twitter: null,
    linkedin: null,
  });

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
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

  const saveSocialsToContext = (platform: SocialPlatform, username: string) => {
    const trimmedUsername = username.trim();
    const contextData: any = {};

    if (platform === "instagram") {
      // Instagram is required and needs @ prefix for database
      contextData.instagram_username = trimmedUsername
        ? `@${trimmedUsername}`
        : "";
    } else if (platform === "twitter") {
      // Twitter is optional and needs @ prefix for database
      contextData.twitter_username = trimmedUsername
        ? `@${trimmedUsername}`
        : undefined;
    } else if (platform === "linkedin") {
      // LinkedIn is optional and no @ prefix for database
      contextData.linkedin_username = trimmedUsername || undefined;
    }

    updateOnboardingData(contextData);
  };

  const updateSocialData = (
    platform: SocialPlatform,
    updates: Partial<SocialData>
  ) => {
    setSocialData((prev) => {
      const newData = {
        ...prev,
        [platform]: { ...prev[platform], ...updates },
      };

      // Always enable the button (Instagram requirement is handled by validation)
      setIsAnyValid(true);

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
    } else if (platform === "linkedin") {
      // LinkedIn allows letters, numbers, hyphens
      const validPattern = /^[a-zA-Z0-9-]+$/;
      return (
        trimmed.length >= 3 &&
        trimmed.length <= 30 &&
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

    // Save to context if valid or if clearing the field
    if (isValid || cleaned.length === 0) {
      saveSocialsToContext(platform, cleaned);
    }
  };

  const handleInputFocus = (platform: SocialPlatform) => {
    updateSocialData(platform, { isFocused: true });

    // Dismiss other inputs
    Object.keys(inputRefs.current).forEach((key) => {
      if (key !== platform && inputRefs.current[key as SocialPlatform]) {
        inputRefs.current[key as SocialPlatform]?.blur();
      }
    });

    // Calculate scroll position based on platform index
    const platformIndex = ["instagram", "twitter", "linkedin"].indexOf(
      platform
    );
    const scrollOffset = platformIndex * 100; // Approximate height of each platform card

    // Scroll with a slight delay to ensure keyboard is fully shown
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: scrollOffset,
        animated: true,
      });
    }, 100);
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
      // Ensure all data is saved before navigation
      Object.entries(socialData).forEach(([platform, data]) => {
        if (data.isValid) {
          saveSocialsToContext(platform as SocialPlatform, data.username);
        }
      });
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
      case "twitter":
        return "logo-twitter"; // Keep as Ionicons type for type safety, actual rendering handled conditionally
      case "linkedin":
        return "logo-linkedin";
      default:
        return "logo-instagram";
    }
  };

  const getPlatformName = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram":
        return "instagram";
      case "twitter":
        return "twitter";
      case "linkedin":
        return "linkedin";
      default:
        return "Instagram";
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram":
        return OnboardingColors.social.instagram;
      case "twitter":
        return OnboardingColors.social.twitter;
      case "linkedin":
        return OnboardingColors.social.linkedin;
      default:
        return OnboardingColors.social.instagram;
    }
  };

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
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
              >
                {/* Progress Bar - Top Left */}
                <View style={styles.progressContainer}>
                  <ProgressBar progress={70} step={5} totalSteps={6} />
                </View>

                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Add your socials</Text>
                  <Text style={styles.subtitle}>
                    This will help June learn more about you.
                  </Text>
                </View>

                {/* Social Platforms */}
                <View style={styles.platformsContainer}>
                  {(
                    ["instagram", "twitter", "linkedin"] as SocialPlatform[]
                  ).map((platform) => {
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
                            isSelected && styles.platformIconContainerSelected,
                          ]}
                        >
                          {platform === "twitter" ? (
                            <FontAwesome6
                              name="x-twitter"
                              size={20}
                              color={isSelected ? "#000000" : "#000000"}
                            />
                          ) : (
                            <Ionicons
                              name={getPlatformIcon(platform)}
                              size={28}
                              color={isSelected ? "#000000" : "#000000"}
                            />
                          )}
                        </View>

                        <View style={styles.platformContent}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {(platform === "instagram" ||
                              platform === "twitter") && (
                              <Text
                                style={{
                                  color: OnboardingColors.text.platformInput,
                                  fontSize: 18,
                                  fontFamily: "Montserrat",
                                  marginRight: 2,
                                }}
                              >
                                @
                              </Text>
                            )}
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
                              placeholder={
                                platform === "twitter" ? "twitter/x" : platform
                              }
                              placeholderTextColor={
                                OnboardingColors.text.quaternary
                              }
                              autoCapitalize="none"
                              autoCorrect={false}
                              returnKeyType="done"
                              onSubmitEditing={dismissKeyboard}
                            />
                          </View>
                          {platform === "instagram" && (
                            <Text
                              style={{
                                color: OnboardingColors.text.quaternary,
                                fontSize: 12,
                                marginTop: 2,
                                // fontFamily: "Montserrat",
                              }}
                            >
                              *Required
                            </Text>
                          )}
                        </View>

                        {data.isValid && (
                          <View style={styles.validationIcon}>
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color={OnboardingColors.icon.checkmark}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Spacer for keyboard */}
                <View style={{ height: 100 }} />
              </ScrollView>

              {/* Next Button - Fixed at bottom */}
              <View
                style={[
                  styles.buttonContainer,
                  isKeyboardVisible && { marginBottom: -15 },
                ]}
              >
                <View style={styles.buttonWrapper}>
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
                          ? OnboardingColors.background.buttonEnabled
                          : OnboardingColors.background.buttonDisabled
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
                          isAnyValid
                            ? OnboardingColors.icon.button
                            : OnboardingColors.icon.buttonDisabled
                        }
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  progressContainer: {
    marginBottom: 32,
  },
  header: {
    marginBottom: 32,
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
    // fontWeight: "300",
  },
  platformsContainer: {
    paddingTop: 30,
    minHeight: 200,
  },
  platformCard: {
    backgroundColor: OnboardingColors.background.platformCard,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: OnboardingColors.border.input,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.light,
    maxWidth: "90%",
  },
  platformCardSelected: {
    backgroundColor: OnboardingColors.background.platformCardSelected,
    borderColor: OnboardingColors.border.platformCardSelected,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  platformIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: OnboardingColors.background.platformIconContainer,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  platformIconContainerSelected: {
    backgroundColor: "transparent",
  },
  platformContent: {
    flex: 1,
  },
  platformInput: {
    fontSize: 16,
    color: OnboardingColors.text.platformInput,
    fontFamily: "Montserrat",
  },
  platformInputSelected: {
    color: OnboardingColors.text.platformInputSelected,
    fontFamily: "Montserrat",
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
