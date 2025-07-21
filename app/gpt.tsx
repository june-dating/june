"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { useFonts } from "expo-font";
import { useState } from "react";
import {
  Alert,
  Clipboard,
  Dimensions,
  Linking,
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
  "Tell me everything about me as if you were being a matchmaker for a dating profile only include the information that is relevant to a dating profile. Dont' make a resume bro but everything for a dating profile and add some like tinder, raya does.";

export default function GPTScreen() {
  const insets = useSafeAreaInsets();
  const [gptResponse, setGptResponse] = useState("");
  const [step, setStep] = useState(1); // 1: Instructions, 2: Paste response
  const [isCopied, setIsCopied] = useState(false);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });
  if (!fontsLoaded) return null;

  const copyPrompt = () => {
    try {
      Clipboard.setString(GPT_PROMPT);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      Alert.alert("Copy Failed", "Please manually copy the prompt");
    }
  };

  const openChatGPT = async () => {
    try {
      // Try to open ChatGPT app first using URL scheme
      const chatGPTAppURL = "chatgpt://";
      const canOpenApp = await Linking.canOpenURL(chatGPTAppURL);

      if (canOpenApp) {
        await Linking.openURL(chatGPTAppURL);
      } else {
        // Fallback to web version
        await Linking.openURL("https://chatgpt.com");
      }
    } catch (error) {
      // If app scheme fails, try web version as fallback
      try {
        await Linking.openURL("https://chatgpt.com");
      } catch (webError) {
        Alert.alert("Error", "Please open ChatGPT app or website manually");
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && gptResponse.trim()) {
      // Store the response somewhere if needed for later use
      // For now, just navigate to profile tab
      router.replace("/(tabs)/profile-screen" as any);
    } else {
      Alert.alert(
        "Missing Response",
        "Please paste your ChatGPT response before continuing"
      );
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
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
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create your profile</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {step === 1 ? (
              // Step 1: Instructions
              <View style={styles.stepContainer}>
                <Text style={styles.subtitle}>
                  We'll use ChatGPT to learn more about you
                </Text>

                <View style={styles.stepsFlow}>
                  <View style={styles.stepBoxVertical}>
                    <View style={styles.stepNumberBox}>
                      <Text style={styles.stepNumber}>1</Text>
                    </View>
                    <Text style={styles.stepTextVertical}>
                      Copy the prompt below
                    </Text>
                  </View>

                  <View style={styles.arrowDownContainer}>
                    <MaterialIcons
                      name="arrow-downward"
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.stepBoxVertical}>
                    <View style={styles.stepNumberBox}>
                      <Text style={styles.stepNumber}>2</Text>
                    </View>
                    <Text style={styles.stepTextVertical}>
                      Open ChatGPT and paste it
                    </Text>
                  </View>

                  <View style={styles.arrowDownContainer}>
                    <MaterialIcons
                      name="arrow-downward"
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.stepBoxVertical}>
                    <View style={styles.stepNumberBox}>
                      <Text style={styles.stepNumber}>3</Text>
                    </View>
                    <Text style={styles.stepTextVertical}>
                      Copy response and return here
                    </Text>
                  </View>
                </View>

                {/* Prompt Card */}
                <View style={styles.promptCard}>
                  <Text style={styles.promptLabel}>Prompt to copy:</Text>
                  <Text style={styles.promptText}>
                    "Tell me everything about me as if you were being a
                    matchmaker for a dating profile..."
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.copyButton,
                      isCopied && styles.copyButtonCopied,
                    ]}
                    onPress={copyPrompt}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name={isCopied ? "check" : "content-copy"}
                      size={18}
                      color={
                        isCopied
                          ? OnboardingColors.icon.button
                          : OnboardingColors.icon.button
                      }
                    />
                    <Text
                      style={[
                        styles.copyButtonText,
                        isCopied && styles.copyButtonTextCopied,
                      ]}
                    >
                      {isCopied ? "Copied" : "Copy Prompt"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ChatGPT Button */}
                <TouchableOpacity
                  style={styles.chatGPTButton}
                  onPress={openChatGPT}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={OnboardingColors.background.buttonEnabled}
                    style={styles.chatGPTGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons
                      name="open-in-new"
                      size={20}
                      color={OnboardingColors.text.button}
                    />
                    <Text style={styles.chatGPTButtonText}>
                      Open ChatGPT App
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              // Step 2: Paste response
              <View style={styles.stepContainer}>
                <Text style={styles.subtitle}>
                  Copy the entire response from ChatGPT and paste it below.
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    multiline
                    placeholder="Paste your ChatGPT response here..."
                    placeholderTextColor={OnboardingColors.text.tertiary}
                    value={gptResponse}
                    onChangeText={setGptResponse}
                    textAlignVertical="top"
                  />
                </View>

                <Text style={styles.inputHint}>
                  This will help June understand you better and create a more
                  personalized profile.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Next Button */}
          {step === 1 ? (
            <View style={{ alignItems: "center", marginTop: 24 }}>
              <TouchableOpacity
                style={styles.centeredNextButton}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={styles.centeredNextButtonText}>
                  I've done this, next
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color={OnboardingColors.text.button}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.nextButton,
                step === 2 && !gptResponse.trim() && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={step === 2 && !gptResponse.trim()}
            >
              <Text style={styles.nextButtonText}>Continue to June</Text>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={OnboardingColors.text.button}
                style={{ marginLeft: 8 }}
              />
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "400",
    color: OnboardingColors.text.primary,
    textAlign: "center",
    fontFamily: "Fraunces",
  },
  stepIndicator: {
    fontSize: 14,
    color: OnboardingColors.text.tertiary,
    fontWeight: "400",
    fontFamily: "Fraunces",
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "400",
    color: OnboardingColors.text.primary,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Fraunces",
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingColors.text.secondary,
    textAlign: "center",
    fontFamily: "Fraunces",
    fontWeight: "300",
    lineHeight: 22,
    marginBottom: 20,
    marginHorizontal: 8,
  },
  stepsFlow: {
    marginBottom: 40,
    marginTop: 15,
  },
  stepBoxVertical: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: OnboardingColors.border.input,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumberBox: {
    width: 32,
    height: 32,
    backgroundColor: OnboardingColors.icon.button,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepNumber: {
    color: OnboardingColors.text.primary,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Fraunces",
  },
  stepTextVertical: {
    fontSize: 16,
    color: OnboardingColors.text.primary,
    flex: 1,
    lineHeight: 20,
    fontWeight: "400",
    fontFamily: "Fraunces",
  },
  arrowDownContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  promptCard: {
    backgroundColor: OnboardingColors.background.platformCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: OnboardingColors.border.input,
  },
  promptLabel: {
    fontSize: 13,
    color: OnboardingColors.icon.button,
    fontWeight: "400",
    marginBottom: 8,
    fontFamily: "Fraunces",
  },
  promptText: {
    fontSize: 14,
    color: OnboardingColors.text.primary,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: "italic",
    fontFamily: "Fraunces",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderColor: OnboardingColors.border.input,
  },
  copyButtonCopied: {
    backgroundColor: OnboardingColors.background.inputSelected,
    borderWidth: 0.5,
    borderColor: OnboardingColors.icon.button,
  },
  copyButtonText: {
    fontSize: 14,
    color: OnboardingColors.icon.button,
    fontWeight: "400",
    marginLeft: 8,
    fontFamily: "Fraunces",
  },
  copyButtonTextCopied: {
    color: OnboardingColors.icon.button,
    fontFamily: "Fraunces",
  },
  chatGPTButton: {
    borderRadius: 20,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
    marginBottom: 16,
  },
  chatGPTGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  chatGPTButtonText: {
    fontSize: 16,
    color: OnboardingColors.text.button,
    fontWeight: "400",
    marginLeft: 12,
    fontFamily: "Fraunces",
  },
  inputContainer: {
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: OnboardingColors.border.input,
  },
  textInput: {
    minHeight: 200,
    fontSize: 16,
    color: OnboardingColors.text.primary,
    lineHeight: 24,
    padding: 16,
    fontFamily: "Fraunces",
  },
  inputHint: {
    fontSize: 14,
    color: OnboardingColors.text.tertiary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    fontFamily: "Fraunces",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: OnboardingColors.background.input, // Box background
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
    marginTop: 24,
  },
  nextButtonDisabled: {
    opacity: OnboardingColors.opacity.buttonDisabled,
  },
  nextButtonText: {
    fontSize: 20, // Increased from 16
    color: OnboardingColors.text.button,
    fontFamily: "Fraunces",
    fontWeight: "300", // Reduced thickness from 400
    marginRight: 8,
    letterSpacing: 0.5, // Add slight spacing for cleaner look
    textAlign: "center",
    flex: 1,
  },
  centeredNextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width - 48,
    height: 48,
    borderRadius: 20,
    backgroundColor: OnboardingColors.background.input,
    borderWidth: 0.5,
    borderColor: OnboardingColors.border.input,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
    marginBottom: 8,
  },
  centeredNextButtonText: {
    fontSize: 16,
    color: OnboardingColors.text.button,
    fontFamily: "Fraunces",
    fontWeight: "400",
    marginRight: 8,
  },
});
