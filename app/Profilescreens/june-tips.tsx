import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors";

const { width, height } = Dimensions.get("window");

const defaultPoints = [
  "Be more spontaneous",
  "Open up sooner - people want to see the real you",
  "Try new activities outside your comfort zone",
];

// Enhanced floating particles component (from june-thinks)
function FloatingParticles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1.5,
    opacity: Math.random() * 0.2 + 0.05,
    duration: Math.random() * 5000 + 4000,
  }));

  return (
    <View style={styles.particleContainer}>
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            {
              position: "absolute",
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            },
          ]}
          entering={FadeIn.delay(particle.id * 200).duration(1500)}
        >
          <FloatingParticle
            size={particle.size}
            opacity={particle.opacity}
            duration={particle.duration}
          />
        </Animated.View>
      ))}
    </View>
  );
}

function FloatingParticle({
  size,
  opacity,
  duration,
}: {
  size: number;
  opacity: number;
  duration: number;
}) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-15, { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: duration * 0.8,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      <View style={[styles.particleInner, { width: size, height: size }]} />
    </Animated.View>
  );
}

// Header Component (from june-thinks)
function JuneHeader() {
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={20}
      tint="light"
      style={[styles.header, { paddingTop: insets.top + 20 }]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back-sharp" size={24} color="#000" />
      </TouchableOpacity>
    </BlurView>
  );
}

export default function JuneTips() {
  const points = defaultPoints;

  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  const color = "#F59E0B";
  const title = "June's tips to be a Better Date";
  const icon = "bulb";

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
        <FloatingParticles />

        <JuneHeader />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={styles.headerContent}
            entering={FadeInUp.delay(100).duration(800)}
          >
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={[`${color}25`, `${color}10`, "transparent"]}
                style={styles.iconGradientBg}
              />
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${color}15` },
                ]}
              >
                <Ionicons name={icon} size={36} color={color} />
              </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Personalized advice to shine brighter
            </Text>
          </Animated.View>

          <Animated.View
            style={styles.content}
            entering={FadeInUp.delay(300).duration(800)}
          >
            <BlurView intensity={20} tint="light" style={styles.glassContainer}>
              <LinearGradient
                colors={[
                  "rgba(255, 193, 7, 0.03)", // Very subtle amber tint
                  "rgba(245, 158, 11, 0.02)", // Barely visible orange tint
                  "rgba(255, 193, 7, 0.015)", // Almost transparent amber
                  "rgba(255, 255, 255, 0.08)",
                ]}
                style={styles.liquidGlass}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.pointsWrapper}>
                  {points.map((point: string, idx: number) => (
                    <Animated.View
                      key={idx}
                      style={styles.pointContainer}
                      entering={FadeInUp.delay(idx * 100 + 500).duration(600)}
                    >
                      <View style={styles.pointContent}>
                        <View
                          style={[
                            styles.bulletContainer,
                            { backgroundColor: color },
                          ]}
                        >
                          <Text style={styles.bullet}>{idx + 1}</Text>
                        </View>
                        <Text style={styles.pointText}>{point}</Text>
                      </View>
                      {idx < points.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </Animated.View>
                  ))}
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>

          <Animated.View
            style={styles.footer}
            entering={FadeInUp.delay(800).duration(600)}
          >
            <Text style={styles.footerText}>
              Small changes, big impact on your dating journey
            </Text>
          </Animated.View>
        </ScrollView>
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
  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: "absolute",
  },
  particleInner: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 50,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  // Header Styles
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 100,
    borderBottomColor: "rgba(251, 247, 247, 0.64)",
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  scrollView: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 140,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  iconGradientBg: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -10,
    left: -10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    color: "#000",
    fontFamily: "Fraunces",
    lineHeight: 36,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.7)",
    fontFamily: "Montserrat",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    marginBottom: 32,
    marginTop: 15,
  },
  tipHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  tipHeaderText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Fraunces",
    fontWeight: "600",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  glassContainer: {
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(245, 158, 11, 0.4)", // Amber border for tips
    shadowColor: "rgba(245, 158, 11, 0.15)", // Amber shadow to match bulb icon
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
    backgroundColor: "rgba(255, 193, 7, 0.08)", // Subtle amber base
  },
  liquidGlass: {
    borderRadius: 32,
    padding: 3,
  },
  pointsWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)", // Amber inner border
    shadowColor: "rgba(255, 193, 7, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  pointContainer: {
    marginVertical: 1,
  },
  pointContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  bulletContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    flexShrink: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  bullet: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Montserrat",
  },
  pointText: {
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.85)",
    lineHeight: 26,
    fontWeight: "500",
    flex: 1,
    fontFamily: "Montserrat",
    letterSpacing: 0,
    textShadowColor: "rgba(255, 193, 7, 0.6)", // Amber text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(245, 158, 11, 0.25)", // Amber separator
    marginHorizontal: 48,
    marginVertical: 4,
    shadowColor: "rgba(255, 193, 7, 0.4)", // Amber shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Montserrat",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
