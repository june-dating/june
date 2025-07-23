import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors";

export default function DateScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

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
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
          <Animated.View
            style={styles.headerContainer}
            entering={FadeInUp.delay(200).duration(800)}
          >
            <Text style={styles.title}>Find Your Date</Text>
            <Text style={styles.subtitle}>
              We'll find meaningful connections with people who match your
              energy
            </Text>
          </Animated.View>

          <Animated.View
            style={styles.cardContainer}
            entering={FadeInUp.delay(400).duration(800)}
          >
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.9)",
                "rgba(255, 255, 255, 0.7)",
                "rgba(255, 255, 255, 0.5)",
              ]}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.cardTitle}>Coming Soon</Text>
              <Text style={styles.cardText}>
                We're crafting the perfect dating experience for you. Stay tuned
                for thoughtful matches and meaningful conversations.
              </Text>
            </LinearGradient>
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
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginBottom: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontFamily: "Fraunces",
    color: OnboardingColors.text.primary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Montserrat",
    color: OnboardingColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  card: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "Fraunces",
    color: OnboardingColors.text.primary,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  cardText: {
    fontSize: 16,
    fontFamily: "Montserrat",
    color: OnboardingColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
