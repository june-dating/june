"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { AudioLines } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
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
    router.push("/photo-upload");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#5E2CA5", "#8B5FBF", "#E9D8FD"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
          {/* Header Text */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Let's make your profile</Text>
            <Text style={styles.subtitle}>
              Just talk to June. She’ll listen and help you create your perfect
              profile.
            </Text>
          </View>
          {/* Voice Avatar */}
          <View style={styles.avatarSection}>
            <VoiceAvatar isListening={isListening} />
          </View>

          {/* ConvAI Component */}
          {/* <ConvAI agentId="agent_01k0cyxjt3eggs2nfpj7ybh2gc" /> */}

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
                  isListening ? ["#8B5FBF", "#E9D8FD"] : ["#8B5FBF", "#5E2CA5"]
                }
                style={styles.speakButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animated.View style={[styles.micIcon, animatedIconStyle]}>
                  {isListening ? (
                    <AudioLines size={28} color="#FFF" />
                  ) : (
                    <MaterialIcons
                      name="keyboard-voice"
                      size={28}
                      color="#FFF"
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
              <MaterialIcons
                name="check"
                size={22}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.doneButtonText}>
                All done? Create my profile
              </Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 14,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 17,
    color: "#E9D8FD",
    textAlign: "center",
    lineHeight: 26,
    fontFamily: "System",
    fontWeight: "400",
    marginHorizontal: 8,
    paddingBottom: 24, // Added padding below subtitle
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
    width: 180, // Increased width
    height: 72,
    borderRadius: 36,
    backgroundColor: "#8B5FBF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5E2CA5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  speakButtonActive: {
    backgroundColor: "#E9D8FD",
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
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "System",
  },
  doneButton: {
    flexDirection: "row",
    backgroundColor: "#5E2CA5",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5E2CA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 18,
  },
  doneButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontFamily: "System",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
