import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "./colors/index";

const { width, height } = Dimensions.get("window");

export default function AccessScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  // Non-blocking font loading with error handling
  const [fontsLoaded, fontError] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });

  // Don't block rendering if fonts fail to load
  const shouldUseFraunces = fontsLoaded && !fontError;

  const handleGetAccess = () => {
    try {
      router.push("/juneconvo");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      setTimeout(() => {
        try {
          router.replace("/juneconvo");
        } catch (fallbackError) {
          console.error("Fallback navigation error:", fallbackError);
        }
      }, 100);
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
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1.3 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.content, { paddingTop: insets.top + 30 }]}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/pink.png")}
                style={styles.juneLogoImage}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.juneText,
                  !shouldUseFraunces && styles.fallbackFont,
                ]}
              >
                June
              </Text>
            </View>
            <Text
              style={[
                styles.slogan,
                { textDecorationLine: "line-through", marginBottom: 8 },
                !shouldUseFraunces && styles.fallbackFont,
              ]}
            >
              No Swiping. No Effort.
            </Text>
            <Text
              style={[styles.slogan, !shouldUseFraunces && styles.fallbackFont]}
            >
              Just a date that matters.
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    !shouldUseFraunces && styles.fallbackFont,
                  ]}
                  placeholder="Enter access code"
                  placeholderTextColor={OnboardingColors.text.tertiary}
                  value={accessCode}
                  onChangeText={setAccessCode}
                  editable={!isLoading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleGetAccess}
                disabled={isLoading || !accessCode}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isLoading || !accessCode
                      ? ["#1A1A1A", "#2A2A2A"]
                      : OnboardingColors.background.buttonEnabled
                  }
                  start={{ x: 0, y: 0 }}
                  end={
                    isLoading || !accessCode ? { x: 1, y: 0 } : { x: 1, y: 1 }
                  }
                  style={styles.buttonGradient}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      (isLoading || !accessCode) && styles.buttonTextLoading,
                      !shouldUseFraunces && styles.fallbackFont,
                    ]}
                  >
                    {isLoading ? "Setting up..." : "Get Access"}
                  </Text>
                  {!isLoading && accessCode && (
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={OnboardingColors.icon.button}
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 70,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 30,
  },
  juneLogoImage: {
    width: 120,
    height: 120,
    marginBottom: 0,
    marginTop: 0,
  },
  juneText: {
    fontSize: 72,
    fontFamily: "MAK-bold",
    color: OnboardingColors.text.primary,
    letterSpacing: 3,
    textShadowColor: OnboardingColors.shadow.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 32,
    height: 100,
  },
  slogan: {
    fontSize: 20,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
    alignItems: "center",
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
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
    // letterSpacing: 0.5,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: OnboardingColors.text.button,
    marginRight: 8,
    fontFamily: "Fraunces",
  },
  buttonTextLoading: {
    opacity: 0.5,
  },
  fallbackFont: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});
