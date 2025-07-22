"use client";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import InsightModal from "../components/InsightModal";

const { width, height } = Dimensions.get("window");

// Mock data - in production this would come from the backend
const profileData = {
  name: "Alice",
  age: 23,
  location: "New York, USA", // Added location
  personality: "INFJ | Author | Weekend poet",
  juneThinks: [
    "Deep listener",
    "Thoughtful ambivert",
    "Believer in real talk over small talk",
    "Poet at heart",
  ],
  juneTips: [
    "Be more spontaneous",
    "Open up sooner - people want to see the real you",
    "Try new activities outside your comfort zone",
  ],
  juneSays: [
    "Genuine and patient",
    "Great at meaningful conversations",
    "Creative and expressive",
    "Emotionally intelligent",
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

function InsightCard({
  title,
  icon,
  color = "#C6B2FF",
  onPress,
  isFullWidth = false,
  iconLibrary = "Ionicons",
}: {
  title: string;
  icon: any;
  color?: string;
  onPress: () => void;
  isFullWidth?: boolean;
  iconLibrary?: string;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
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
          colors={[color + "25", color + "15", color + "10"]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: color + "30" },
              ]}
            >
              <IconComponent name={icon} size={28} color={color} />
            </View>
            <Text
              style={[styles.cardTitle, { color: "#fff" }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardSubtitle, { color: color }]}>
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
  const [modalState, setModalState] = useState({
    visible: false,
    title: "",
    icon: "",
    points: [] as string[],
    color: "#C6B2FF",
    iconLibrary: "Ionicons",
  });

  // Add state to track the current data
  const [currentData, setCurrentData] = useState({
    juneThinks: profileData.juneThinks,
    juneTips: profileData.juneTips,
    juneSays: profileData.juneSays,
  });

  const openModal = (
    title: string,
    icon: any,
    points: string[],
    color: string,
    iconLibrary: string = "Ionicons"
  ) => {
    setModalState({
      visible: true,
      title,
      icon,
      points,
      color,
      iconLibrary,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, visible: false }));
  };

  const handleSavePoints = (newPoints: string[]) => {
    // Update the appropriate data based on modal title
    if (modalState.title.includes("June thinks")) {
      setCurrentData((prev) => ({ ...prev, juneThinks: newPoints }));
    } else if (modalState.title.includes("tips")) {
      setCurrentData((prev) => ({ ...prev, juneTips: newPoints }));
    } else if (modalState.title.includes("looking for")) {
      setCurrentData((prev) => ({ ...prev, juneSays: newPoints }));
    }

    // In a real app, you'd also send this to your backend here
    console.log("Saving points:", newPoints);
  };

  return (
    <>
      <Animated.View
        style={styles.cardsSection}
        entering={FadeInUp.delay(400).duration(800)}
      >
        <View style={styles.cardsRow}>
          <InsightCard
            title="June thinks you're a..."
            icon="brain"
            color="#C6B2FF"
            iconLibrary="MaterialCommunityIcons"
            onPress={() =>
              openModal(
                "June thinks you're a...",
                "brain",
                currentData.juneThinks,
                "#C6B2FF",
                "MaterialCommunityIcons"
              )
            }
          />
          <InsightCard
            title="June's tips to be a Better Date"
            icon="bulb"
            color="#FFB86C"
            onPress={() =>
              openModal(
                "June's tips to be a Better Date: ",
                "bulb",
                currentData.juneTips,
                "#FFB86C"
              )
            }
          />
        </View>

        <View style={styles.singleCardRow}>
          <InsightCard
            title="June is looking for someone who is..."
            icon="heart"
            color="#FF6C8C"
            onPress={() =>
              openModal(
                "June is looking for someone who is...",
                "heart",
                currentData.juneSays,
                "#FF6C8C"
              )
            }
            isFullWidth={true}
          />
        </View>
      </Animated.View>

      <InsightModal
        visible={modalState.visible}
        onClose={closeModal}
        title={modalState.title}
        icon={modalState.icon}
        points={modalState.points}
        color={modalState.color}
        iconLibrary={modalState.iconLibrary}
        onSavePoints={handleSavePoints}
      />
    </>
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
          <ProfileHeader />

          <InsightCardsSection />

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

  // Enhanced Card Styles
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
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: "Fraunces",
    letterSpacing: 0.6,
  },
  cardFooter: {
    marginTop: "auto",
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.8,
  },

  // ... existing styles ...
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
    marginTop: 48,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
    marginTop: 16,
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
    fontWeight: "500",
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
