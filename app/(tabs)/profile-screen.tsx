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

import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { OnboardingColors } from "../colors";

// Import extracted components
import FacePhotosCarousel from "../components/FacePhotosCarousel";
import InsightCardsSection from "../components/InsightCardsSection";
import ProfileContent from "../components/ProfileContent";
import ProfileHeader from "../components/ProfileHeader";
import StarField from "../components/StarField";

export default function ProfileScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    MAK: require("../../assets/fonts/MAK-bold.otf"),
  });

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
        <StarField />

        <ProfileHeader />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileContent />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
});
