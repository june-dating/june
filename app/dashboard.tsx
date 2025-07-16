"use client";

import { Ionicons } from "@expo/vector-icons";
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

const { width, height } = Dimensions.get("window");

// Mock data - in production this would come from the backend
const profileData = {
  name: "Aarushi",
  age: 23,
  personality: "INFJ | Plant mom | Weekend poet",
  juneInsight:
    "Deep listener. Ambivert. Believes in real talk and long walks. Might write you a poem when you're not looking.",
  facePhotos: [
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1494790108755-2616b93c44e6?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
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
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
          entering={FadeIn.delay(star.id * 100).duration(1000)}
        />
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
          colors={["#C6B2FF", "#8B5FBF", "#5E2CA5"]}
          style={styles.profileImageGradient}
        >
          <Image
            source={{ uri: profileData.facePhotos[0].uri }}
            style={styles.profileImage}
          />
        </LinearGradient>
        <Animated.View style={[styles.profileGlow, shimmerStyle]} />
      </View>

      <Text style={styles.nameAge}>
        {profileData.name}, {profileData.age}
      </Text>

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
        <Text style={styles.summaryText}>{profileData.juneInsight}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function FacePhotosCarousel() {
  const renderFacePhoto = ({ item }: { item: any }) => (
    <View style={styles.facePhotoContainer}>
      <Image source={{ uri: item.uri }} style={styles.facePhoto} />
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

function LifePhotosGrid() {
  const renderLifePhoto = ({ item, index }: { item: any; index: number }) => {
    const isLarge = index % 3 === 0;
    const photoStyle = isLarge ? styles.lifePhotoLarge : styles.lifePhotoSmall;

    return (
      <View style={[styles.lifePhotoContainer, photoStyle]}>
        <Image source={{ uri: item.uri }} style={styles.lifePhoto} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.2)"]}
          style={styles.lifePhotoOverlay}
        />
      </View>
    );
  };

  return (
    <Animated.View
      style={styles.photosSection}
      entering={FadeInUp.delay(800).duration(800)}
    >
      <Text style={styles.sectionTitle}>Your World</Text>
      <View style={styles.lifePhotosGrid}>
        {profileData.lifePhotos.map((item, index) => (
          <View
            key={item.id}
            style={
              index % 3 === 0 ? styles.lifePhotoLarge : styles.lifePhotoSmall
            }
          >
            <Image source={{ uri: item.uri }} style={styles.lifePhoto} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.2)"]}
              style={styles.lifePhotoOverlay}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function FooterCTA() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.4,
  }));

  return (
    <Animated.View
      style={styles.footerContainer}
      entering={FadeInUp.delay(1000).duration(800)}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.footerCard}
      >
        <Text style={styles.footerTitle}>Ready to be seen by your match?</Text>
        <TouchableOpacity
          style={styles.goLiveButton}
          onPress={() => router.push("/")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#8B5FBF", "#5E2CA5"]}
            style={styles.goLiveGradient}
          >
            <Ionicons
              name="flash"
              size={20}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.goLiveText}>Go Live</Text>
            <Animated.View style={[styles.buttonShimmer, shimmerStyle]} />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

export default function ProfilePreviewScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#3A1B6B", "#5E2CA5", "#8B5FBF"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StarField />

        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 20 }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          style={[styles.editButton, { top: insets.top + 20 }]}
          onPress={() => router.push("/photo-upload")}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollViewRef}
          style={[styles.scrollView, { paddingTop: insets.top + 80 }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileHeader />
          <PersonalitySummary />
          <FacePhotosCarousel />
          <LifePhotosGrid />
          <FooterCTA />
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
    position: "absolute",
    backgroundColor: "#C6B2FF",
    borderRadius: 1,
  },
  backButton: {
    position: "absolute",
    left: 24,
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
    marginBottom: 32,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImageGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 56,
  },
  profileGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 70,
    backgroundColor: "#C6B2FF",
    zIndex: -1,
  },
  nameAge: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
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
    color: "#C6B2FF",
    fontWeight: "600",
    textAlign: "center",
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
    color: "#FFFFFF",
    marginBottom: 16,
    marginLeft: 4,
  },
  facePhotosContainer: {
    paddingRight: 24,
  },
  facePhotoContainer: {
    width: width * 0.7,
    height: width * 0.85,
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
    height: 200,
    marginBottom: 12,
  },
  lifePhotoSmall: {
    width: "48%",
    height: 140,
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
