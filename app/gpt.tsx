"use client";

import Clipboard from "@react-native-clipboard/clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEvent,
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

const GPT_PROMPT = `Act like a high-end, emotionally intelligent matchmaker who's writing my dating profile for apps like Tinder, Hinge, or Raya. This isn't a resume, so skip career stuff unless it's part of my personality or vibe. I want you to break down everything that actually matters for dating — in clean, bold, bullet point format. That includes:

My personality and vibe

My lifestyle and habits

What I care about / my values

What kind of partner I naturally attract

What it feels like to date me

My humor, quirks, and how I carry myself

Bonus points if there's something poetic, flirty, or bold in tone

Keep it fresh, modern, and not cringe. Avoid clichés and anything that sounds robotic or generic. The goal is to make someone stop scrolling and think, "Who is this person and where have they been?"

Make sure every bullet point actually says something. Cut the filler. Show, don't just tell.`;

export default function GPTScreen() {
  const insets = useSafeAreaInsets();
  const [gptResponse, setGptResponse] = useState("");
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const step2Ref = useRef<View>(null);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const copyPrompt = async () => {
    try {
      await Clipboard.setString(GPT_PROMPT);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      Alert.alert("Error", "Failed to copy text to clipboard");
    }
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
    if (showError) {
      setShowError(false);
    }

    // Delay to ensure layout is complete
    setTimeout(() => {
      step2Ref.current?.measureInWindow((x, y, width, height) => {
        const inputPosition = y + height;
        const screenHeight = Dimensions.get("window").height;
        const keyboardSpace = keyboardHeight;

        // If input would be hidden by keyboard, scroll to make it visible
        if (inputPosition > screenHeight - keyboardSpace) {
          const scrollAmount =
            inputPosition - (screenHeight - keyboardSpace) + 130; // Extra 100px padding
          scrollViewRef.current?.scrollTo({
            y: scrollAmount,
            animated: true,
          });
        }
      });
    }, 100);
  };

  if (!fontsLoaded) return null;

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
          <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
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
              <View style={styles.stepContainer}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>Step 1</Text>
                  </View>
                  <View style={styles.stepTitleContainer}>
                    <Text style={styles.stepLabel}>Copy this prompt</Text>
                  </View>
                  <TouchableOpacity
                    onPress={copyPrompt}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isCopied ? "checkmark" : "copy-outline"}
                      size={18}
                      color="#000000"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setShowFullPrompt((v) => !v)}
                  activeOpacity={0.7}
                >
                  <View style={styles.promptBox}>
                    <Text style={styles.promptText}>
                      {GPT_PROMPT.slice(
                        0,
                        showFullPrompt ? undefined : PROMPT_PREVIEW_LENGTH
                      )}
                      {!showFullPrompt &&
                        GPT_PROMPT.length > PROMPT_PREVIEW_LENGTH && (
                          <Text style={styles.readMoreText}>
                            {"\n... Read more"}
                          </Text>
                        )}
                    </Text>
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
                    size={18}
                    color="#000000"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.openChatGPTButtonText}>Open ChatGPT</Text>
                </TouchableOpacity>
              </View>

              {/* Step 2: Paste summary */}
              <View
                ref={step2Ref}
                style={[styles.stepContainer, styles.stepContainerSpaced]}
              >
                <View style={styles.stepHeader}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>Step 2</Text>
                  </View>
                  <View style={styles.stepTitleContainer}>
                    <Text style={styles.stepLabel}>Paste AI Summary</Text>
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color="#000000"
                      style={styles.stepIconRight}
                    />
                  </View>
                </View>

                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Paste the summary ChatGPT created about you..."
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
                      Please paste the AI summary before continuing
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.finishButtonContainer}>
              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinish}
                activeOpacity={0.85}
              >
                <Text style={styles.finishButtonText}>Continue</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#000000"
                  style={{ marginLeft: 8 }}
                />
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
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "left",
    fontFamily: "Fraunces",
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    fontFamily: "Montserrat",
    fontWeight: "400",
    maxWidth: "90%",
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    marginBottom: 28,
  },
  stepContainerSpaced: {
    marginTop: 16,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepBadge: {
    backgroundColor: OnboardingColors.background.input,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stepTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepIcon: {
    marginRight: 8,
  },
  stepIconRight: {
    marginLeft: 8,
  },
  stepLabel: {
    fontSize: 16,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "500",
    flex: 1,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: OnboardingColors.background.input,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  promptBox: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  promptText: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    fontFamily: "Montserrat",
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 20,
  },
  readMoreText: {
    color: "#000000",
    fontStyle: "normal",
    fontWeight: "700",
  },
  openChatGPTButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  openChatGPTButtonText: {
    fontSize: 15,
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
    fontWeight: "600",
  },
  inputBox: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
    minHeight: 120,
    maxHeight: 200,
    padding: 16,
  },
  textInput: {
    fontSize: 15,
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
    minHeight: 88,
    maxHeight: 168,
    textAlignVertical: "top",
  },
  finishButtonContainer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: Math.max(32, 32),
    alignItems: "center",
  },
  finishButton: {
    flexDirection: "row",
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 20,
    height: 56,
    width: Math.min(width - 32, 340),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  finishButtonText: {
    color: OnboardingColors.text.primary,
    fontSize: 18,
    fontFamily: "Fraunces",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: "red",
    fontFamily: "Montserrat",
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
});
