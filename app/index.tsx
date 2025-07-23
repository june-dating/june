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
        colors={["#eee2d2", "#eee2d2"]}
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
                  "rgba(60, 60, 60, 0.95)", // Cool dark gray top
                  "rgba(40, 40, 40, 0.9)", // Slightly darker
                  "rgba(30, 30, 30, 0.85)", // Medium dark
                  "rgba(20, 20, 20, 0.8)", // Darker
                  "rgba(10, 10, 10, 0.75)", // Darkest but not pure black
                ]}
                style={styles.liquidButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.liquidButtonText}>Get a Date</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginTextContainer}
              onPress={() => router.push("/(tabs)/profile-screen")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginText}>Already a user?</Text>
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
    color: "#000000",
    letterSpacing: 3,
    // textShadowColor: "rgba(0, 0, 0, 0.5)",
    // textShadowOffset: { width: 0, height: 4 },
    // textShadowRadius: 12, // Slightly more glow
    marginBottom: 0,
    height: 100,
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
    width: 300,
    height: 76,
    borderRadius: 38,
    overflow: "hidden",
    backgroundColor: "rgba(40, 40, 40, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(60, 60, 60, 0.3)",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 25,
  },
  liquidButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 38,
    borderWidth: 0.5,
    borderColor: "rgba(80, 80, 80, 0.2)",
    backgroundColor: "rgba(40, 40, 40, 0.85)",
  },
  liquidButtonText: {
    fontSize: 24,
    fontFamily: Platform.OS === "ios" ? "Fraunces" : "sans-serif-medium",
    color: "#eee2d2",
    letterSpacing: 1.2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    opacity: 1,
  },
  loginTextContainer: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 18,
    fontFamily: "sans-serif-medium",
    color: "#000000",
    textDecorationLine: "underline",
  },
});
