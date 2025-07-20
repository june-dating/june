"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

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

const { width, height } = Dimensions.get("window");

const GPT_PROMPT =
  "Tell me everything about me as if you were being a matchmaker for a dating profile only include the information that is relevant to a dating profile. Dont' make a resume bro but everything for a dating profile and add some like tinder, raya does.";

export default function GPTScreen() {
  const insets = useSafeAreaInsets();
  const [gptResponse, setGptResponse] = useState("");
  const [step, setStep] = useState(1); // 1: Instructions, 2: Paste response
  const [isCopied, setIsCopied] = useState(false);

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
      // For now, just navigate to onboarding
      router.push("/onboarding");
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
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#5E2CA5", "#9440dd", "#E9D8FD"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create your profile</Text>
            {/* <Text style={styles.stepIndicator}>Step {step} of 2</Text> */}
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
                      color={isCopied ? "#10B981" : "#9440dd"}
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
                    colors={["#10A37F", "#1A7F64"]}
                    style={styles.chatGPTGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="open-in-new" size={20} color="#FFF" />
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
                    placeholderTextColor="rgba(2, 2, 2, 0.5)"
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
          <TouchableOpacity
            style={[
              styles.nextButton,
              step === 2 && !gptResponse.trim() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            activeOpacity={0.8}
            disabled={step === 2 && !gptResponse.trim()}
          >
            <Text style={styles.nextButtonText}>
              {step === 1 ? "I've done this, next" : "Continue to June"}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
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
  backButton: {
    padding: 8,
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
  stepIndicator: {
    fontSize: 14,
    color: "#E9D8FD",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "System",
    fontWeight: "400",
    marginBottom: 20,
    marginHorizontal: 8,
  },
  stepsFlow: {
    marginBottom: 40,
    marginTop: 15,
  },
  stepBoxVertical: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#9440dd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumberBox: {
    width: 32,
    height: 32,
    backgroundColor: "#9440dd",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#9440dd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepNumber: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  stepTextVertical: {
    fontSize: 16,
    color: "#FFF",
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
  },
  arrowDownContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  promptCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  promptLabel: {
    fontSize: 13,
    color: "#9440dd",
    fontWeight: "600",
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: "#2D3748",
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: "italic",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  copyButtonCopied: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  copyButtonText: {
    fontSize: 14,
    color: "#9440dd",
    fontWeight: "600",
    marginLeft: 8,
  },
  copyButtonTextCopied: {
    color: "#10B981",
  },
  chatGPTButton: {
    borderRadius: 12,
    shadowColor: "#10A37F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatGPTGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  chatGPTButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 12,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  textInput: {
    minHeight: 200,
    fontSize: 16,
    color: "#2D3748",
    lineHeight: 24,
    padding: 16,
    fontFamily: "System",
  },
  inputHint: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#9440dd",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9440dd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 24,
  },
  nextButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  nextButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "System",
    fontWeight: "600",
    marginRight: 8,
  },
});
