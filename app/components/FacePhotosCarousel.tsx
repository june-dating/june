import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ProfileData } from "../../types/ProfileTypes";
import { OnboardingColors } from "../colors";

const { width } = Dimensions.get("window");

// Profile data for photos
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

const ANIMATION_CONFIG = {
  fadeIn: {
    duration: 800,
  },
};

export default function FacePhotosCarousel() {
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

const styles = StyleSheet.create({
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
});
