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

const { width, height } = Dimensions.get("window");

export default function AccessScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });
  if (!fontsLoaded) return null;

  const handleGetAccess = () => {
    router.push("/juneconvo");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#000000", "#1a0a1a", "#2d0a2d"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.content, { paddingTop: insets.top + 30 }]}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/images/onboarding/junelogo.png")}
                style={styles.juneLogoImage}
                resizeMode="contain"
              />
              <Text style={styles.juneText}>June</Text>
            </View>
            <Text style={styles.slogan}>
              1000 dates. No effort.{"\n"}{" "}
              <Text
                style={{
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                  textDecorationColor: "#fff",
                }}
              >
                {" "}
                No Swiping.
              </Text>
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter access code"
                  placeholderTextColor="#e5e5e5"
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
                    isLoading ? ["#8B5FBF", "#A67CC5"] : ["#FFF", "#F0EFFF"]
                  }
                  style={styles.buttonGradient}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isLoading && styles.buttonTextLoading,
                    ]}
                  >
                    {isLoading ? "Setting up..." : "Get Access"}
                  </Text>
                  {!isLoading && (
                    <Ionicons name="arrow-forward" size={20} color="#5E2CA5" />
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
    paddingBottom: 12,
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
    color: "#FFFFFF",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 32,
  },
  slogan: {
    fontSize: 20,
    color: "#FFF",
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
    maxWidth: "90%",
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
    fontWeight: "300",
    fontFamily: "Fraunces",
    letterSpacing: 0.5,
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
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
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
    color: "#5E2CA5",
    marginRight: 8,
  },
  buttonTextLoading: {
    color: "#8B5FBF",
  },
});
