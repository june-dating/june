"use client";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { AudioLines } from "lucide-react-native";
import { useEffect, useState } from "react";
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
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "./colors/index";
import VoiceAvatar from "./components/VoiceAvatar";

const { width, height } = Dimensions.get("window");

export default function VoiceOnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [isListening, setIsListening] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  // Animation for listening icon
  const iconScale = useSharedValue(1);
  const iconRotation = useSharedValue(0);

  useEffect(() => {
    if (isListening) {
      iconScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      iconRotation.value = withRepeat(
        withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      iconScale.value = withTiming(1, { duration: 300 });
      iconRotation.value = withTiming(0, { duration: 300 });
    }
  }, [isListening]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
  }));

  const handleListeningToggle = () => {
    setIsListening(!isListening);
    if (!hasSpoken) setHasSpoken(true);
  };

  const handleDone = () => {
    // Navigate to next screen
    router.push("/(tabs)/profile-screen" as any);
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
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Let's make your profile</Text>
              <Text style={styles.subtitle}>
                Just talk to June. She’ll listen and help you create your
                perfect profile.
              </Text>
            </View>
            {/* Voice Avatar */}
            <View style={styles.avatarSection}>
              <VoiceAvatar isListening={isListening} />
            </View>
            {/* Speak Button - circular, floating */}
            <View style={styles.speakButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.speakButton,
                  isListening && styles.speakButtonActive,
                ]}
                onPress={handleListeningToggle}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    isListening
                      ? OnboardingColors.background.buttonEnabled
                      : OnboardingColors.background.buttonDisabled
                  }
                  style={styles.speakButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Animated.View style={[styles.micIcon, animatedIconStyle]}>
                    {isListening ? (
                      <AudioLines
                        size={28}
                        color={OnboardingColors.icon.primary}
                      />
                    ) : (
                      <Ionicons
                        name="mic-outline"
                        size={28}
                        color={OnboardingColors.icon.primary}
                      />
                    )}
                  </Animated.View>
                  <Text style={styles.speakButtonText}>
                    {isListening ? "Listening…" : "Start Talking"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {/* Finish Button - only show after user has spoken */}
            {hasSpoken && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
                activeOpacity={0.85}
              >
                <Text style={styles.doneButtonText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={22}
                  style={{ marginLeft: 8, alignSelf: "center" }}
                  color={OnboardingColors.icon.checkmark}
                />
              </TouchableOpacity>
            )}
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
  headerContainer: {
    alignItems: "flex-start",
    marginBottom: 36,
  },
  title: {
    fontSize: 34,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "left",
    marginBottom: 8,
    fontFamily: "Fraunces",
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
  avatarSection: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 24,
  },
  speakButtonContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  speakButton: {
    width: 180,
    height: 72,
    borderRadius: 36,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  speakButtonActive: {
    opacity: 0.95,
  },
  speakButtonGradient: {
    flex: 1,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  micIcon: {
    marginRight: 0,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  speakButtonText: {
    color: OnboardingColors.text.button,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
    fontFamily: "Fraunces",
  },
  doneButton: {
    flexDirection: "row",
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
    marginTop: 18,
  },
  doneButtonText: {
    fontSize: 18,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
