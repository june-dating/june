"use client";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "./colors";

const { width, height } = Dimensions.get("window");

const GPT_PROMPT =
  "Tell me everything about me as if you were being a matchmaker for a dating profile only include the information that is relevant to a dating profile. Dont' make a resume but everything for a dating profile and add some like tinder, raya does.";

export default function GPTScreen() {
  const insets = useSafeAreaInsets();
  const [gptResponse, setGptResponse] = useState("");
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });
  if (!fontsLoaded) return null;

  const copyPrompt = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const openChatGPT = async () => {
    try {
      const chatGPTAppURL = "chatgpt://";
      const canOpenApp = await Linking.canOpenURL(chatGPTAppURL);
      if (canOpenApp) {
        await Linking.openURL(chatGPTAppURL);
      } else {
        await Linking.openURL("https://chatgpt.com");
      }
    } catch (error) {
      try {
        await Linking.openURL("https://chatgpt.com");
      } catch (webError) {
        Alert.alert("Error", "Please open ChatGPT app or website manually");
      }
    }
  };

  const handleFinish = () => {
    if (!gptResponse.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }
    setShowError(false);
    router.replace("/(tabs)/profile-screen" as any);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleTextInputFocus = () => {
    // Clear error when user focuses on input
    if (showError) {
      setShowError(false);
    }
    // Delay to ensure keyboard animation has started
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 0);
  };

  // Truncate prompt for preview
  const PROMPT_PREVIEW_LENGTH = 80;
  const promptPreview = showFullPrompt
    ? GPT_PROMPT
    : GPT_PROMPT.slice(0, PROMPT_PREVIEW_LENGTH) +
      (GPT_PROMPT.length > PROMPT_PREVIEW_LENGTH ? "\n... Read more" : "");

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
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
              {/* <Image
                source={require("../assets/images/onboarding/junelogo.png")}
                style={{ width: 70, height: 70 }}
              /> */}
              <Text style={styles.title}>Let's dive deeper</Text>
              <Text style={styles.subtitle}>
                We'll use ChatGPT to discover more about yourself
              </Text>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Step 1: Copy prompt */}
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>Step 1</Text>
                </View>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={OnboardingColors.icon.primary}
                  style={styles.stepIcon}
                />
                <Text style={styles.stepLabel}>Copy this prompt</Text>
                <TouchableOpacity
                  onPress={copyPrompt}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isCopied ? "checkmark" : "copy-outline"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setShowFullPrompt((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={styles.promptBox}>
                  <Text style={styles.promptText}>{promptPreview}</Text>
                </View>
              </TouchableOpacity>
              {/* Open ChatGPT App Button */}
              <TouchableOpacity
                style={styles.openChatGPTButton}
                onPress={openChatGPT}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="open-outline"
                  size={20}
                  color={"#fff"}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.openChatGPTButtonText}>
                  Open ChatGPT App
                </Text>
              </TouchableOpacity>

              {/* Step 2: Paste summary */}
              <View style={[styles.stepRow, { marginTop: 32 }]}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>Step 2</Text>
                </View>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={OnboardingColors.icon.primary}
                  style={styles.stepIcon}
                />
                <Text style={styles.stepLabel}>Paste your AI Summary here</Text>
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="Paste the summary ChatGPT created about you"
                  placeholderTextColor={OnboardingColors.text.tertiary}
                  value={gptResponse}
                  onChangeText={setGptResponse}
                  textAlignVertical="top"
                  maxLength={2000}
                  returnKeyType="done"
                  onSubmitEditing={dismissKeyboard}
                  blurOnSubmit={true}
                  onFocus={handleTextInputFocus}
                />
              </View>
              {showError && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="warning-outline"
                    size={16}
                    color="#FF6B6B"
                    style={styles.errorIcon}
                  />
                  <Text style={styles.errorText}>
                    Please paste the AI summary before finishing setup
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Bottom Button */}
            <BlurView intensity={20} style={styles.finishButton}>
              <TouchableOpacity
                style={styles.finishButtonInner}
                onPress={handleFinish}
                activeOpacity={0.85}
              >
                <Text style={styles.finishButtonText}>Finish setup</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: "flex-start",
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "flex-start",
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "left",
    fontFamily: "Fraunces",
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    fontFamily: "Fraunces",
    fontWeight: "400",
    marginBottom: 0,
    maxWidth: "90%",
    lineHeight: 22,
  },
  scrollView: { flex: 1 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  stepBadge: {
    backgroundColor: OnboardingColors.icon.button,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Fraunces",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stepIcon: { marginRight: 10 },
  stepLabel: {
    fontSize: 16,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "500",
    flex: 1,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: OnboardingColors.background.input,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  promptBox: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  promptText: {
    fontSize: 14,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontStyle: "italic",
    fontWeight: "light",
    letterSpacing: 0.6,
  },
  openChatGPTButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  openChatGPTButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Fraunces",
    fontWeight: "500",
  },
  inputBox: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
    marginTop: 10,
    marginBottom: 8,
    minHeight: 120,
    maxHeight: 180,
    padding: 8,
  },
  textInput: {
    fontSize: 15,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    minHeight: 100,
    maxHeight: 160,
    padding: 8,
  },
  finishButton: {
    width: "100%",
    borderRadius: 18,
    marginTop: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  finishButtonInner: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Fraunces",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontFamily: "Fraunces",
    fontWeight: "500",
    flex: 1,
  },
});
