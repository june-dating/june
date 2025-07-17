import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
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
  const [step, setStep] = React.useState(0);
  const scrollRef = React.useRef(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const slides = [
    {
      key: "discover",
      title: "Discover",
      icon: "🔍",
      subtitle: "Your person",
      image: require("../assets/images/aija3.png"),
      gradient: ["#9440dd", "#b366e8"],
    },
    {
      key: "connect",
      title: "Connect",
      icon: "💕",
      subtitle: "Authentically",
      image: require("../assets/images/aija3.png"),
      gradient: ["#b366e8", "#d199f0"],
    },
    {
      key: "flourish",
      title: "Flourish",
      icon: "🌟",
      subtitle: "Together",
      image: require("../assets/images/aija3.png"),
      gradient: ["#d199f0", "#9440dd"],
    },
  ];

  useEffect(() => {
    // Start entrance animation
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setStep(slide);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={slides[step].gradient as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 20,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.appName}>JUNE</Text>
          <Text style={styles.tagline}>Just one match that matters.</Text>
        </Animated.View>

        {/* Visual Carousel */}
        <Animated.View
          style={[
            styles.carouselContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
          >
            {slides.map((slide, idx) => (
              <View key={slide.key} style={[styles.slide, { width }]}>
                <View style={styles.imageContainer}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={slide.image}
                      style={styles.aijaImage}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay} />
                  </View>
                </View>

                {/* Glassmorphism Card */}
                <View style={styles.glassCard}>
                  <View style={styles.cardContent}>
                    <Text style={styles.iconText}>{slide.icon}</Text>
                    <View style={styles.textContent}>
                      <Text style={styles.cardTitle}>{slide.title}</Text>
                      <Text style={styles.cardSubtitle}>{slide.subtitle}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {slides.map((_, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.progressDot,
                step === idx && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              paddingBottom: insets.bottom + 40,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={() => router.push("/signup")}
          >
            <LinearGradient
              colors={["#FFFFFF", "#F5F0FF"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Begin Journey</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
  header: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    letterSpacing: 0.5,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
  },
  carousel: {
    flexGrow: 0,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  imageWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    position: "relative",
  },
  aijaImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(148, 64, 221, 0.08)",
    borderRadius: 100,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    minWidth: 280,
    maxWidth: 320,
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  iconText: {
    fontSize: 28,
    marginRight: 16,
  },
  textContent: {
    flex: 1,
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 8,
  },
  progressDotActive: {
    width: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
  },
  buttonContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  button: {
    width: width - 64,
    height: 64,
    borderRadius: 32,
    shadowColor: "#9440dd",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#9440dd",
    letterSpacing: 1,
  },
});
