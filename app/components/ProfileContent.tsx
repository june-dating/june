import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ProfileData } from "../../types/ProfileTypes";
import { OnboardingColors } from "../colors";

// Animation configuration
const ANIMATION_CONFIG = {
  shimmer: {
    duration: 3000,
    easing: Easing.linear,
  },
  fadeIn: {
    delay: 200,
    duration: 800,
  },
};

// Profile data
const PROFILE_DATA: ProfileData = {
  name: "Alice",
  age: 23,
  location: "New York City, USA",
  personality: "INFJ | Author | Weekend poet",
  facePhotos: [
    { id: "2", uri: require("../../assets/images/aija5.jpg") },
    { id: "1", uri: require("../../assets/images/img2.jpg") },
    { id: "3", uri: require("../../assets/images/img1.jpg") },
  ],
};

export default function ProfileContent() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, ANIMATION_CONFIG.shimmer),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.2,
  }));

  return (
    <Animated.View
      style={styles.profileContentContainer}
      entering={FadeInUp.delay(ANIMATION_CONFIG.fadeIn.delay).duration(
        ANIMATION_CONFIG.fadeIn.duration
      )}
    >
      <View style={styles.profileImageContainer}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.05)"]}
          style={styles.profileImageGradient}
        >
          <Image
            source={require("../../assets/images/aija4.png")}
            style={styles.profileImage}
          />
        </LinearGradient>
        <View style={styles.profileGlow}>
          <Animated.View style={[styles.profileGlowInner, shimmerStyle]} />
        </View>
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.nameAge}>
          {PROFILE_DATA.name}, {PROFILE_DATA.age}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.locationRow}>
          <Ionicons
            name="home"
            size={16}
            color={OnboardingColors.text.secondary}
            style={styles.locationEmoji}
          />
          <Text style={styles.locationText}>{PROFILE_DATA.location}</Text>
        </View>
      </View>

      <View style={styles.personalityContainer}>
        <Text style={styles.personalityLabel}>{PROFILE_DATA.personality}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  profileContentContainer: {
    alignItems: "center",
    paddingTop: 140,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    marginTop: 20,
  },
  profileImageGradient: {
    width: 170,
    height: 170,
    borderRadius: 85,
    padding: 3,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 82,
  },
  profileGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 83,
    zIndex: -1,
  },
  profileGlowInner: {
    width: "100%",
    height: "100%",
    borderRadius: 83,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  nameAge: {
    fontSize: 32,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "center",
    fontFamily: "Fraunces",
  },
  personalityContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  personalityLabel: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 15,
    color: OnboardingColors.text.secondary,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: "Montserrat",
  },
});
