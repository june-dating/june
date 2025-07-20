import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressBar from "../components/ProgressBar";

const { width, height } = Dimensions.get("window");

type GenderOption = "male" | "female" | "other";

export default function GenderScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(
    null
  );
  const [customGender, setCustomGender] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const buttonScale = useSharedValue(1);
  const inputOpacity = useSharedValue(0);
  const checkIconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const handleGenderSelect = (gender: GenderOption) => {
    setSelectedGender(gender);
    if (gender === "other") {
      setShowCustomInput(true);
      setCustomGender("");
    } else {
      setShowCustomInput(false);
      setCustomGender("");
    }
  };

  const handleCustomGenderChange = (text: string) => {
    setCustomGender(text);
  };

  const isValid =
    selectedGender &&
    (selectedGender !== "other" || customGender.trim().length > 0);

  const handleNext = () => {
    if (isValid) {
      router.push("/onboarding/looking-for");
    }
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

  // Animate elements on mount with staggered timing
  React.useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    subtitleOpacity.value = withTiming(1, { duration: 800 });
    inputOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

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
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
            {/* Progress Bar - Top Left */}
            <View style={styles.progressContainer}>
              <ProgressBar progress={45} step={3} totalSteps={6} />
            </View>

            {/* Header - Top Left (F-Pattern Start) */}
            <Animated.View style={[styles.header, animatedTitleStyle]}>
              <Text style={styles.title}>What's your gender?</Text>
              <Animated.View style={animatedSubtitleStyle}>
                <Text style={styles.subtitle}>
                  This helps us find better matches for you
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Gender Options - Left Side (F-Pattern Middle) */}
            <Animated.View
              style={[styles.optionsContainer, animatedInputStyle]}
            >
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === "male" && styles.genderOptionSelected,
                ]}
                onPress={() => handleGenderSelect("male")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="male"
                  size={24}
                  color={
                    selectedGender === "male"
                      ? "#FFF"
                      : "rgba(255, 255, 255, 0.7)"
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === "male" && styles.genderTextSelected,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === "female" && styles.genderOptionSelected,
                ]}
                onPress={() => handleGenderSelect("female")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="female"
                  size={24}
                  color={
                    selectedGender === "female"
                      ? "#FFF"
                      : "rgba(255, 255, 255, 0.7)"
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === "female" && styles.genderTextSelected,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  selectedGender === "other" && styles.genderOptionSelected,
                ]}
                onPress={() => handleGenderSelect("other")}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={24}
                  color={
                    selectedGender === "other"
                      ? "#FFF"
                      : "rgba(255, 255, 255, 0.7)"
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === "other" && styles.genderTextSelected,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Custom Input - Positioned to be keyboard-friendly */}
            {showCustomInput && (
              <Animated.View
                style={[styles.customInputContainer, animatedInputStyle]}
              >
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={customGender}
                    onChangeText={handleCustomGenderChange}
                    placeholder="Enter your gender identity"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    autoFocus
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                </View>
              </Animated.View>
            )}

            {/* Next Button - Bottom Right (F-Pattern End) */}
            <View style={styles.buttonContainer}>
              <Animated.View
                style={[styles.buttonWrapper, animatedButtonStyle]}
              >
                <TouchableOpacity
                  style={[styles.button, !isValid && styles.buttonDisabled]}
                  onPress={handleNext}
                  disabled={!isValid}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      isValid
                        ? ["#FFF", "#F0F0F0"]
                        : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]
                    }
                    style={styles.buttonGradient}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        !isValid && styles.buttonTextDisabled,
                      ]}
                    >
                      Next
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={isValid ? "#8a4bb8" : "rgba(255,255,255,0.5)"}
                    />
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
  header: {
    marginBottom: 48,
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
  optionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
    minHeight: 120,
  },
  genderOption: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 20,
    paddingHorizontal: 24,
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
  genderOptionSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "#FFF",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  genderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 16,
  },
  genderTextSelected: {
    color: "#FFF",
    fontWeight: "700",
  },
  customInputContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  inputWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: "#8a4bb8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    maxWidth: "90%",
  },
  input: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
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
