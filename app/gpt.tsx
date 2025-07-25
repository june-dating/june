"use client";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
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

interface ClipboardInterface {
  setString(text: string): Promise<void>;
}

let Clipboard: ClipboardInterface;
try {
  Clipboard = require("@react-native-clipboard/clipboard").default;
} catch (error) {
  // Fallback implementation
  Clipboard = {
    setString: async (text: string) => {
      console.warn("Clipboard not available, using fallback");
      return Promise.resolve();
    },
  };
}

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

function AnimatedChatGPTButton({
  onPress,
  isCopied,
  setIsCopied,
}: {
  onPress: () => void;
  isCopied: boolean;
  setIsCopied: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [phase, setPhase] = useState("idle"); // idle | animating | done
  const progress = useRef(new Animated.Value(0)).current;

  // openChatGPTAfterAnim controls when to call onPress, type-safe default
  const openChatGPTAfterAnim = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (isCopied) {
      setPhase("animating");
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setPhase("done");
        // Only after animation, open ChatGPT if requested
        if (typeof openChatGPTAfterAnim.current === "function") {
          openChatGPTAfterAnim.current();
          openChatGPTAfterAnim.current = undefined;
        }
        // Revert to idle after 3 seconds
        setTimeout(() => {
          setPhase("idle");
          setIsCopied(false);
        }, 3000);
      });
    } else {
      setPhase("idle");
      progress.setValue(0);
    }
  }, [isCopied]);

  const handlePress = () => {
    // Set isCopied to true to start animation
    setIsCopied(true);
    // Set callback to open ChatGPT after animation
    openChatGPTAfterAnim.current = onPress;
  };

  // Arrow position moves with progress
  const arrowTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // match new width minus icon size
  });

  return (
    <TouchableOpacity
      style={styles.chatGPTButton}
      onPress={handlePress}
      activeOpacity={0.75}
      disabled={phase === "animating" || phase === "done"}
    >
      <LinearGradient
        colors={["#FFF9E5", "#FFF9E5", "#FFF9E5"]}
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={[styles.chatGPTButtonContent, { justifyContent: "center" }]}
        >
          {/* Centered content group: text/progress and icon */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {/* Copy icon only in idle phase, immediately removed on click */}
            {phase === "idle" && (
              <Ionicons
                name="copy-outline"
                size={22}
                color="#000"
                style={{ marginRight: 10 }}
              />
            )}
            {/* Main content: text or animation, always centered */}
            <View
              style={[
                styles.chatGPTTextContainer,
                { alignItems: "center", marginRight: 0, marginLeft: 0 },
              ]}
            >
              {phase === "idle" && (
                <Text style={styles.chatGPTButtonTextMain}>
                  Copy the magic prompt
                </Text>
              )}
              {phase === "animating" && (
                <View
                  style={{ width: 220, height: 22, justifyContent: "center" }} // width increased
                >
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: 4, // reduced height
                      backgroundColor: "#f0d3b1", // new background color
                      borderRadius: 2,
                      top: 9,
                    }}
                  />
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 6,
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 220], // width increased
                      }),
                      height: 3, // reduced height
                      backgroundColor: "#f2b56f", // new progress color
                      borderRadius: 4,
                    }}
                  />
                  <Animated.View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: [{ translateX: arrowTranslateX }],
                    }}
                  >
                    <FontAwesome5 name="plane" size={20} color="#b87a2e" />
                  </Animated.View>
                </View>
              )}
              {phase === "done" && (
                <Text style={styles.chatGPTButtonTextMain}>Prompt copied!</Text>
              )}
              <Text style={styles.chatGPTButtonTextSecondary}>
                {phase === "done"
                  ? "Open ChatGPT and paste it"
                  : "And click here to open ChatGPT"}
              </Text>
            </View>
            {/* ChatGPT icon: show as soon as user clicks (animating or done) */}
            {(phase === "animating" || phase === "done") && (
              <Image
                source={require("../assets/images/onboarding/gpt.png")}
                style={{ width: 30, height: 30, marginLeft: 10 }}
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function GPTScreen() {
  const insets = useSafeAreaInsets();
  const [gptResponse, setGptResponse] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<View>(null);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
        // Scroll to input when keyboard shows
        setTimeout(() => {
          inputRef.current?.measureInWindow((x, y, width, height) => {
            const screenHeight = Dimensions.get("window").height;
            const inputBottom = y + height;
            const keyboardTop = screenHeight - event.endCoordinates.height;

            if (inputBottom > keyboardTop) {
              const scrollAmount = inputBottom - keyboardTop + 20; // Add extra padding
              scrollViewRef.current?.scrollTo({
                y: scrollAmount,
                animated: true,
              });
            }
          });
        }, 100);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        // Optionally scroll back to top when keyboard hides
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const copyPromptAndOpenGPT = async () => {
    try {
      // Try best-known ChatGPT app schemes in order:
      // 1. chatgpt:// (iOS / Android)
      // 2. com.openai.chatgpt:// (as per some app manifests)
      // 3. openai:// (rare, but exists)
      // 4. Universal Link (iOS test)
      const schemes = [
        "chatgpt://",
        "com.openai.chatgpt://",
        "openai://",
        // On iOS this opens the app, not web, if installed:
        "https://chat.openai.com",
      ];

      let opened = false;
      for (const scheme of schemes) {
        const can = await Linking.canOpenURL(scheme);
        if (can) {
          await Linking.openURL(scheme);
          opened = true;
          break;
        }
      }
      // If none worked, fallback to regular web
      if (!opened) {
        await Linking.openURL("https://chatgpt.com");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to open ChatGPT app.");
      console.log(err);
    }
  };

  const handleFinish = () => {
    if (!gptResponse.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }
    setShowError(false);
    router.replace("/photo-upload" as any);
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
      inputRef.current?.measureInWindow((x, y, width, height) => {
        const inputPosition = y + height;
        const screenHeight = Dimensions.get("window").height;
        const keyboardSpace = keyboardHeight;

        // If input would be hidden by keyboard, scroll to make it visible
        if (inputPosition > screenHeight - keyboardSpace) {
          const scrollAmount =
            inputPosition - (screenHeight - keyboardSpace) + 130;
          scrollViewRef.current?.scrollTo({
            y: scrollAmount,
            animated: true,
          });
        }
      });
    }, 100);
  };

  if (!fontsLoaded) return null;

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
          keyboardVerticalOffset={Platform.OS === "ios" ? -insets.bottom : 20}
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
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {/* ChatGPT Button */}
              <AnimatedChatGPTButton
                onPress={copyPromptAndOpenGPT}
                isCopied={isCopied}
                setIsCopied={setIsCopied}
              />

              {/* Input Section */}
              <View ref={inputRef} style={styles.inputSection}>
                <Text style={styles.inputLabel}>Paste AI Summary</Text>
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
  scrollViewContent: {
    paddingBottom: 100,
  },
  chatGPTButton: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  buttonGradient: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  chatGPTButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  chatGPTTextContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 16,
  },
  chatGPTButtonTextMain: {
    fontSize: 17,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 6,
    textAlign: "center",
  },
  chatGPTButtonTextSecondary: {
    fontSize: 13,
    color: OnboardingColors.text.secondary,
    fontFamily: "Montserrat",
    fontWeight: "400",
    letterSpacing: 0.2,
    textAlign: "center",
    opacity: 0.8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "500",
    marginBottom: 12,
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
