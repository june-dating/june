"use client";

import { Ionicons } from "@expo/vector-icons";
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
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors";

const { width, height } = Dimensions.get("window");

// Mock data - in production this would come from the backend
const profileData = {
  name: "Alice",
  age: 23,
  location: "New York, USA", // Added location
  personality: "INFJ | Author | Weekend poet",
  juneInsight: [
    "Deep listener.",
    "Ambivert.",
    "Believes in real talk and long walks.",
    "Might write you a poem when you're not looking.",
  ], // Now an array for bullet points
  improvement: [
    "Be more spontaneous.",
    "Open up sooner in conversations.",
    "Try new activities outside your comfort zone.",
  ],
  whyDate: [
    "Genuine and caring nature.",
    "Great at deep conversations.",
    "Will surprise you with poetry.",
  ],
  facePhotos: [
    {
      id: "2",
      uri: require("../../assets/images/aija5.jpg"),
    },
    {
      id: "1",
      uri: require("../../assets/images/img2.jpg"),
    },
    {
      id: "3",
      uri: require("../../assets/images/img1.jpg"),
    },
    {
      id: "4",
      uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "5",
      uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    },
  ],
  lifePhotos: [
    {
      id: "6",
      uri: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=500&fit=crop",
    },
    {
      id: "7",
      uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      id: "8",
      uri: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=600&fit=crop",
    },
    {
      id: "9",
      uri: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop",
    },
    {
      id: "10",
      uri: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=500&fit=crop",
    },
  ],
};

function StarField() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2,
  }));

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
          <View
            style={[
              styles.star,
              {
                opacity: star.opacity,
              },
            ]}
          />
        </Animated.View>
      ))}
    </View>
  );
}

function ProfileHeader() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.3,
  }));

  return (
    <Animated.View
      style={styles.headerContainer}
      entering={FadeInUp.delay(200).duration(800)}
    >
      <View style={styles.profileImageContainer}>
        <LinearGradient
          colors={["#fff", "#fff"]}
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
      <Text style={styles.nameAge}>
        {profileData.name}, {profileData.age}
      </Text>
      <View style={styles.locationRow}>
        <Text>📍</Text>
        {/* <Ionicons
          name="location-outline"
          size={16}
          color="red"
          style={{ marginRight: 4 }}
        /> */}
        <Text style={styles.locationText}>{profileData.location}</Text>
      </View>
      <View style={styles.personalityContainer}>
        <Text style={styles.personalityLabel}>{profileData.personality}</Text>
      </View>
    </Animated.View>
  );
}

function PersonalitySummary() {
  return (
    <Animated.View
      style={styles.summaryContainer}
      entering={FadeInUp.delay(400).duration(800)}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.08)"]}
        style={styles.summaryCard}
      >
        <View style={styles.summaryHeader}>
          <Ionicons name="sparkles" size={20} color="#C6B2FF" />
          <Text style={styles.summaryTitle}>June says:</Text>
        </View>
        <View style={{ marginTop: 4 }}>
          {profileData.juneInsight.map((point, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color: "#C6B2FF",
                  fontSize: 18,
                  marginRight: 8,
                  lineHeight: 22,
                }}
              >
                •
              </Text>
              <Text style={styles.summaryText}>{point}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function InfoBox({
  title,
  icon,
  points,
  color = "#C6B2FF",
}: {
  title: string;
  icon: any;
  points: string[];
  color?: string;
}) {
  return (
    <Animated.View
      style={styles.summaryContainer}
      entering={FadeInUp.delay(500).duration(800)}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.12)", "rgba(255, 255, 255, 0.06)"]}
        style={styles.summaryCard}
      >
        <View style={styles.summaryHeader}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={[styles.summaryTitle, { color }]}>{title}</Text>
        </View>
        <View style={{ marginTop: 4 }}>
          {points.map((point: string, idx: number) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <Text
                style={{ color, fontSize: 18, marginRight: 8, lineHeight: 22 }}
              >
                •
              </Text>
              <Text style={styles.summaryText}>{point}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function FacePhotosCarousel() {
  const renderFacePhoto = ({ item }: { item: any }) => (
    <View style={styles.facePhotoContainer}>
      <Image source={item.uri} style={styles.facePhoto} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)"]}
        style={styles.facePhotoOverlay}
      />
    </View>
  );

  return (
    <Animated.View
      style={styles.photosSection}
      entering={FadeInUp.delay(600).duration(800)}
    >
      <Text style={styles.sectionTitle}>You</Text>
      <FlatList
        data={profileData.facePhotos}
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

function LifePhotosCarousel() {
  return (
    <Animated.View
      style={styles.photosSection}
      entering={FadeInUp.delay(800).duration(800)}
    >
      <Text style={styles.sectionTitle}>Your World</Text>
      <FlatList
        data={profileData.lifePhotos}
        renderItem={({ item }) => (
          <View style={styles.lifePhotoCarouselItem}>
            <Image
              source={{ uri: item.uri }}
              style={styles.lifePhotoCarouselImage}
            />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lifePhotoCarouselContent}
        keyExtractor={(item) => item.id}
      />
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={OnboardingColors.statusBar || "light-content"} />
      <LinearGradient
        colors={[
          OnboardingColors.gradient.primary,
          OnboardingColors.gradient.secondary,
          OnboardingColors.gradient.tertiary,
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StarField />
        {/* Edit Button */}
        <TouchableOpacity
          style={[styles.editButton, { top: insets.top + 20 }]}
          onPress={() => router.push("/photo-upload")}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <ScrollView
          ref={scrollViewRef}
          style={[styles.scrollView, { paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Removed Back Button */}
          <ProfileHeader />
          <View style={{ marginTop: 32 }}>
            <PersonalitySummary />
            <InfoBox
              title="What you should improve?"
              icon="trending-up-outline"
              points={profileData.improvement}
              color="#FFB86C"
            />
            <InfoBox
              title="Why would someone date you?"
              icon="heart-outline"
              points={profileData.whyDate}
              color="#FF6C8C"
            />
          </View>
          <FacePhotosCarousel />
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
    backgroundColor: "#C6B2FF",
    borderRadius: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editButton: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
    marginTop: 48, // Move avatar further down
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    marginTop: 16, // Extra space above avatar
  },
  profileImageGradient: {
    width: 150,
    height: 150,
    borderRadius: 75,
    padding: 4,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 71,
  },
  profileGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 85,
    zIndex: -1,
  },
  profileGlowInner: {
    width: "100%",
    height: "100%",
    borderRadius: 85,
    backgroundColor: "#C6B2FF",
  },
  nameAge: {
    fontSize: 32,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Fraunces",
  },
  personalityContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  personalityLabel: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    fontWeight: "400",
    textAlign: "center",
    fontFamily: "Fraunces",
  },
  summaryContainer: {
    marginBottom: 40,
  },
  summaryCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C6B2FF",
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    fontWeight: "400",
  },
  photosSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
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
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  goLiveButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#8B5FBF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    color: "#FFFFFF",
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 15,
    color: OnboardingColors.text.secondary,
    fontWeight: "300",
    textAlign: "center",
    fontFamily: "Fraunces",
  },
});
