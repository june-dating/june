/**
 * Profile Screen - Enhanced and Refactored
 *
 * Features:
 * - Professional profile header with name, age, location, and occupation
 * - Interactive insight cards with smooth animations
 * - Face photos carousel
 * - Starfield background animation
 * - TypeScript interfaces for better type safety
 * - Organized component structure and styles
 * - Centralized animation configuration
 * - Glass morphism UI design
 */

"use client";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors";

const { width, height } = Dimensions.get("window");

// Types
interface ProfileData {
  name: string;
  age: number;
  location: string;
  personality: string;
  facePhotos: Array<{ id: string; uri: any }>;
}

interface InsightCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  iconLibrary: "Ionicons" | "MaterialCommunityIcons";
  route: string;
  isFullWidth?: boolean;
}

interface FacePhoto {
  id: string;
  uri: any;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

// Constants
const PROFILE_DATA: ProfileData = {
  name: "Alice",
  age: 23,
  location: "New York City, USA",
  personality: "INFJ | Author | Weekend poet",
  facePhotos: [
    { id: "2", uri: require("../../assets/images/aija5.jpg") },
    { id: "1", uri: require("../../assets/images/img2.jpg") },
    { id: "3", uri: require("../../assets/images/img1.jpg") },
  ],
};

const INSIGHT_CARDS: InsightCard[] = [
  {
    id: "thinks",
    title: "June thinks you're a...",
    icon: "brain",
    color: "#8B5CF6",
    iconLibrary: "MaterialCommunityIcons",
    route: "/Profilescreens/june-thinks",
  },
  {
    id: "tips",
    title: "June's tips to be a Better Date",
    icon: "bulb",
    color: "#F59E0B",
    iconLibrary: "Ionicons",
    route: "/Profilescreens/june-tips",
  },
  {
    id: "looking",
    title: "June is looking for someone who is...",
    icon: "heart",
    color: "#EF4444",
    iconLibrary: "Ionicons",
    route: "/Profilescreens/june-looking-for",
    isFullWidth: true,
  },
];

const ANIMATION_CONFIG = {
  shimmer: {
    duration: 3000,
    easing: Easing.linear,
  },
  spring: {
    damping: 15,
    stiffness: 300,
  },
  fadeIn: {
    delay: 200,
    duration: 800,
  },
};

// Utility Functions
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.1,
  }));
};

const getGenderIcon = (gender: any) => {
  return { icon: "person", color: "#6B7280" };
};

// Components
function StarField() {
  const stars = generateStars(15);

  return (
    <View style={styles.starField}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            {
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
            },
          ]}
          entering={FadeIn.delay(star.id * 100).duration(1000)}
        >
          <View style={[styles.star, { opacity: star.opacity }]} />
        </Animated.View>
      ))}
    </View>
  );
}

function ProfileHeader() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, ANIMATION_CONFIG.shimmer),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.2,
  }));

  return (
    <Animated.View
      style={styles.headerContainer}
      entering={FadeInUp.delay(ANIMATION_CONFIG.fadeIn.delay).duration(
        ANIMATION_CONFIG.fadeIn.duration
      )}
    >
      <View style={styles.profileImageContainer}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.05)"]}
          style={styles.profileImageGradient}
        >
          <Image
            source={require("../../assets/images/aija4.png")}
            style={styles.profileImage}
          />
        </LinearGradient>
        <View style={styles.profileGlow}>
          <Animated.View style={[styles.profileGlowInner, shimmerStyle]} />
        </View>
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.nameAge}>
          {PROFILE_DATA.name}, {PROFILE_DATA.age}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.locationRow}>
          <Ionicons
            name="home"
            size={16}
            color={OnboardingColors.text.secondary}
            style={styles.locationEmoji}
          />
          <Text style={styles.locationText}>{PROFILE_DATA.location}</Text>
        </View>
      </View>

      <View style={styles.personalityContainer}>
        <Text style={styles.personalityLabel}>{PROFILE_DATA.personality}</Text>
      </View>
    </Animated.View>
  );
}

function FacePhotosCarousel() {
  const renderFacePhoto = ({ item }: { item: any }) => (
    <View style={styles.facePhotoContainer}>
      <Image source={item.uri} style={styles.facePhoto} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.4)"]}
        style={styles.facePhotoOverlay}
      />
    </View>
  );

  return (
    <Animated.View
      style={styles.photosSection}
      entering={FadeInUp.delay(600).duration(ANIMATION_CONFIG.fadeIn.duration)}
    >
      <Text style={styles.sectionTitle}>You</Text>
      <FlatList
        data={PROFILE_DATA.facePhotos}
        renderItem={renderFacePhoto}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.facePhotosContainer}
        snapToInterval={width * 0.7 + 16}
        decelerationRate="fast"
        snapToAlignment="start"
        bounces={false}
        keyExtractor={(item) => item.id}
      />
    </Animated.View>
  );
}

interface InsightCardProps {
  title: string;
  icon: any;
  color?: string;
  onPress: () => void;
  isFullWidth?: boolean;
  iconLibrary?: "Ionicons" | "MaterialCommunityIcons";
}

function InsightCard({
  title,
  icon,
  color = "#8B5CF6",
  onPress,
  isFullWidth = false,
  iconLibrary = "Ionicons",
}: InsightCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, ANIMATION_CONFIG.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION_CONFIG.spring);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent =
    iconLibrary === "MaterialCommunityIcons"
      ? MaterialCommunityIcons
      : Ionicons;

  return (
    <Animated.View
      style={[
        animatedStyle,
        isFullWidth ? styles.fullWidthCardContainer : styles.cardContainer,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0.3)",
            "rgba(255, 255, 255, 0.2)",
          ]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: color + "20" },
              ]}
            >
              <IconComponent name={icon} size={28} color={color} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardSubtitle, { color }]}>
                Tap to explore
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function InsightCardsSection() {
  return (
    <Animated.View
      style={styles.cardsSection}
      entering={FadeInUp.delay(400).duration(ANIMATION_CONFIG.fadeIn.duration)}
    >
      <View style={styles.cardsRow}>
        {INSIGHT_CARDS.slice(0, 2).map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            color={card.color}
            iconLibrary={card.iconLibrary}
            onPress={() => router.push(card.route as any)}
          />
        ))}
      </View>

      <View style={styles.singleCardRow}>
        {INSIGHT_CARDS.slice(2).map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            color={card.color}
            iconLibrary={card.iconLibrary}
            onPress={() => router.push(card.route as any)}
            isFullWidth={card.isFullWidth}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
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
        <StarField />

        {/* Edit Button */}
        <TouchableOpacity
          style={[styles.editButton, { top: insets.top + 10 }]}
          onPress={() => router.push("/photo-upload")}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={24} color="#000000" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          style={[styles.scrollView, { paddingTop: insets.top + 10 }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileHeader />
          <InsightCardsSection />
          <FacePhotosCarousel />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container and Layout Styles
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  // Background Elements
  starField: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 1,
  },

  // Insight Cards Styles
  cardsSection: {
    marginTop: 32,
    marginBottom: 40,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  singleCardRow: {
    alignItems: "center",
  },
  cardContainer: {
    flex: 0.48,
    minHeight: 160,
  },
  fullWidthCardContainer: {
    width: "100%",
    minHeight: 140,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    // Enhanced glass effect
    backdropFilter: "blur(30px)",
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.35)",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: "Fraunces",
    letterSpacing: 0.3,
    color: "rgba(0, 0, 0, 0.85)",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardFooter: {
    marginTop: "auto",
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Montserrat",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.8,
  },

  // Header and Navigation Styles
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  editButton: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  // Profile Header Styles
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    marginTop: 8,
  },
  profileImageGradient: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 3,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 72,
  },
  profileGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 83,
    zIndex: -1,
  },
  profileGlowInner: {
    width: "100%",
    height: "100%",
    borderRadius: 83,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  nameAge: {
    fontSize: 32,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "center",
    fontFamily: "Fraunces",
  },
  genderBadge: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  personalityContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  personalityLabel: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Montserrat",
  },

  // Photos Section Styles
  photosSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: OnboardingColors.text.primary,
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: "Fraunces",
  },
  facePhotosContainer: {
    paddingRight: 24,
  },
  facePhotoContainer: {
    width: width * 0.8,
    height: width * 1.0,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  facePhoto: {
    width: "100%",
    height: "100%",
  },
  facePhotoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  lifePhotosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lifePhotoContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lifePhotoLarge: {
    width: "100%",
    height: 250,
    marginBottom: 12,
  },
  lifePhotoSmall: {
    width: "48%",
    height: 180,
    marginBottom: 12,
  },
  lifePhoto: {
    width: "100%",
    height: "100%",
  },
  lifePhotoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "20%",
  },
  footerContainer: {
    marginTop: 20,
  },
  footerCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Fraunces",
  },
  goLiveButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
  },
  goLiveGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  goLiveText: {
    fontSize: 16,
    fontWeight: "700",
    color: OnboardingColors.text.button,
    fontFamily: "Fraunces",
  },
  buttonShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonShimmerInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  bottomStatusContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  liveStatusText: {
    fontSize: 18,
    fontWeight: "700",
    color: OnboardingColors.text.button,
    fontFamily: "Fraunces",
    backgroundColor: OnboardingColors.background.buttonEnabled[0],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  liveStatusContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
  },
  lifePhotoCarouselContent: {
    paddingLeft: 4,
    paddingRight: 24,
  },
  lifePhotoCarouselItem: {
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: OnboardingColors.background.input,
    borderWidth: 2,
    borderColor: OnboardingColors.border.input,
  },
  lifePhotoCarouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 15,
    color: OnboardingColors.text.secondary,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: "Montserrat",
  },
});
