import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    const timer = setTimeout(() => {
      Animated.stagger(300, [
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(logoAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#000000", "#1a0a1a", "#2d0a2d"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoAnim,
                transform: [{ scale: logoAnim }],
                marginTop: 120, // Slightly less margin to balance size
                marginBottom: 24, // More space below
              },
            ]}
          >
            <Image
              source={require("../assets/images/onboarding/junelogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginTop: 0, // Remove extra margin
                marginBottom: 32, // Slightly more space below text
              },
            ]}
          >
            <Text style={styles.juneText}>June</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.liquidButton}
              onPress={() => router.push("/onboarding/name")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.45)", // Top highlight
                  "rgba(173, 216, 230, 0.18)", // Soft blue
                  "rgba(255, 255, 255, 0.10)", // Center
                  "rgba(255, 182, 193, 0.18)", // Soft pink
                  "rgba(255, 255, 255, 0.08)", // Bottom
                ]}
                style={styles.liquidButtonGradient}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
              >
                <Text style={styles.liquidButtonText}>Get a Date</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 32, // Slightly more space below text
  },
  juneText: {
    fontSize: 72, // Increased from 48
    fontFamily: "MAK-bold",
    color: "#FFFFFF",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12, // Slightly more glow
    marginBottom: 0,
  },
  welcomeText: {
    fontSize: 52,
    fontFamily: "MAK-bold",
    color: "#FFFFFF",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    marginBottom: 4,
  },
  toText: {
    fontSize: 26,
    fontFamily: "MAK-bold",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoContainer: {
    width: 260, // Increased from 200
    height: 260, // Increased from 200
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120, // Slightly less margin to balance size
    marginBottom: 24, // More space below
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 84,
    marginBottom: 32,
  },
  liquidButton: {
    width: 300, // Increased from 260
    height: 76, // Increased from 68
    borderRadius: 38, // Increased for more pill shape
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)", // Slightly more visible
    borderWidth: 2.5, // Thicker border
    borderColor: "rgba(255,255,255,0.35)", // More pronounced border
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 36,
    elevation: 32,
    // iOS glass effect
    backdropFilter: "blur(18px)",
  },
  liquidButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.22)",
    // Enhanced gradient for more glassy look
  },
  liquidButtonText: {
    fontSize: 24,
    fontFamily: Platform.OS === "ios" ? "Fraunces" : "sans-serif-medium",
    color: "#fff",
    letterSpacing: 1.2,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    opacity: 0.96,
  },
});
