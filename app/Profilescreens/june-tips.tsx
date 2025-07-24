import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const TIPS = [
  "Be more spontaneous and open to new experiences",
  "Share your authentic self early on",
  "Ask thoughtful questions and listen deeply",
  "Communicate your intentions clearly",
  "Try new activities together to build connection",
];

const COLORS = {
  background: "#eee2d2", // match June Thinks
  accent: "#F59E0B", // amber
  accentGold: "#FFD700", // gold
  box: "#000",
  subtitle: "#645A4F",
  footer: "#7B6F63",
  borderShadow: "rgba(245, 158, 11, 0.18)",
  backIconBg: "rgba(255,255,255,0.5)",
  editBg: "#FDF3E1",
  headline: "#2D1E0F",
  bulb: "#F59E0B",
};

function BulbIcon() {
  // Gentle breathing animation
  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withRepeat(withTiming(1.08, { duration: 1800 }), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={[styles.bulbIconContainer, animatedStyle]}>
      <Ionicons name="bulb" size={48} color={COLORS.bulb} />
    </Animated.View>
  );
}

function HeadlineSection() {
  return (
    <View style={styles.headlineSection}>
      <BulbIcon />
      <Text style={styles.title}>{`June's tips to be a Better Date`}</Text>
      <Text style={styles.subtitle}>Personalized advice to shine brighter</Text>
    </View>
  );
}

function TipItem({ text, index }: { text: string; index: number }) {
  return (
    <Animated.View
      style={styles.traitItem}
      entering={FadeInUp.delay(index * 120 + 200).duration(600)}
    >
      <LinearGradient
        colors={[COLORS.accent, COLORS.accentGold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.traitBadge}
      >
        <Text style={styles.traitBadgeText}>{index + 1}</Text>
      </LinearGradient>
      <Text style={styles.traitText}>{text}</Text>
    </Animated.View>
  );
}

function TipsBox({ tips }: { tips: string[] }) {
  return (
    <View style={styles.traitsBoxShadowWrap}>
      <BlurView intensity={22} tint="light" style={styles.traitsBoxBlur}>
        <View style={styles.traitsBox}>
          <View style={styles.traitsList}>
            {tips.map((tip, i) => (
              <TipItem key={i} text={tip} index={i} />
            ))}
          </View>
        </View>
      </BlurView>
    </View>
  );
}

function BackButton() {
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.backButton, { top: insets.top + 12 }]}
      onPress={() => router.back()}
      accessibilityLabel="Go back"
      activeOpacity={0.7}
    >
      <View style={styles.backButtonCircle}>
        <Ionicons name="arrow-back-sharp" size={24} color="#000" />
      </View>
    </TouchableOpacity>
  );
}

function FooterText() {
  return (
    <Text style={styles.footerText}>
      Small changes, big impact on your dating journey
    </Text>
  );
}

export default function JuneTips() {
  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    MAK: require("../../assets/fonts/MAK-bold.otf"),
  });
  const [tips] = useState(TIPS);
  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[COLORS.background, COLORS.background, COLORS.background]}
        style={styles.gradient}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <BackButton />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HeadlineSection />
          <TipsBox tips={tips} />
          <View style={{ height: 24 }} />
          <FooterText />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: "center",
  },
  // Top Section
  headlineSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  bulbIconContainer: {
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    color: COLORS.headline,
    fontFamily: "Fraunces",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.subtitle,
    fontFamily: "Montserrat",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 0,
    letterSpacing: 0.1,
  },
  // Traits Box
  traitsBoxShadowWrap: {
    width: "100%",
    borderRadius: 24,
    shadowColor: COLORS.borderShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    marginBottom: 0,
    backgroundColor: "transparent",
    overflow: "visible",
  },
  traitsBoxBlur: {
    borderRadius: 24,
    overflow: "hidden",
  },
  traitsBox: {
    backgroundColor: "rgba(250,245,238,0.7)", // match June Thinks
    borderRadius: 24,
    padding: 22,
    paddingTop: 26,
    paddingBottom: 18,
    minWidth: "100%",
    position: "relative",
    marginBottom: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  traitsList: {
    width: "100%",
    marginTop: 0,
  },
  traitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  traitBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  traitBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  traitText: {
    fontSize: 15,
    color: COLORS.headline,
    fontWeight: "500",
    fontFamily: "Montserrat",
    flex: 1,
    letterSpacing: 0.1,
  },
  // Back Button
  backButton: {
    position: "absolute",
    left: 18,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.backIconBg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.borderShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  // Footer
  footerText: {
    fontSize: 14,
    color: COLORS.footer,
    fontFamily: "Montserrat",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.2,
    marginTop: 24,
    marginBottom: 0,
  },
});
