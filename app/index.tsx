import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#3A1B6B", "#5E2CA5", "#8B5FBF"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow}>
              <View style={styles.avatarBorder}>
                <Image
                  source={require("../aija4.png")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.headline}>
              Just one real match that matters.
            </Text>
          </View>

          {/* CTA Button */}
          <View style={styles.buttonContainer}>
            <Text style={styles.smallText}>No swipes bs. No small talk</Text>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => router.push("/signup")}
            >
              <LinearGradient
                colors={["#F0EFFF", "#C6B2FF"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: height * 0.08,
    marginBottom: 20,
  },
  avatarGlow: {
    shadowColor: "#C6B2FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 25,
    marginBottom: 16,
  },
  avatarBorder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "rgba(240, 239, 255, 0.4)",
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 86,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    marginTop: -120,
  },
  headline: {
    fontSize: 25,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 36,
    fontFamily: "System",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textTransform: "uppercase",
  },
  slogan: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 26,
    fontFamily: "System",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  smallText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "System",
    fontWeight: "400",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: width - 64,
    height: 60,
    borderRadius: 30,
    shadowColor: "#C6B2FF",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5E2CA5",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
});
