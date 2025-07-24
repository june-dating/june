import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
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
    { id: "4", uri: require("../../assets/images/aija6.jpg") },
  ],
};

const ANIMATION_CONFIG = {
  fadeIn: {
    duration: 600, // Reduced from 800 to 400 for faster fade-in
  },
  cardTransition: {
    duration: 300, // Reduced from 400 to 200 for much faster animation
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
};

const CARD_OFFSET = 8; // Offset for stacked cards

export default function FacePhotosCarousel() {
  const [photos, setPhotos] = useState(PROFILE_DATA.facePhotos);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(1);

  const handlePhotoTap = () => {
    // First phase: Slide right
    translateX.value = withSequence(
      withTiming(width * 0.1, {
        duration: ANIMATION_CONFIG.cardTransition.duration * 0.3,
        easing: ANIMATION_CONFIG.cardTransition.easing,
      }),
      withTiming(width * 0.8, {
        duration: ANIMATION_CONFIG.cardTransition.duration * 0.7,
        easing: ANIMATION_CONFIG.cardTransition.easing,
      })
    );

    // Move slightly down and scale
    translateY.value = withSequence(
      withTiming(10, {
        duration: ANIMATION_CONFIG.cardTransition.duration * 0.3,
        easing: ANIMATION_CONFIG.cardTransition.easing,
      }),
      withTiming(30, {
        duration: ANIMATION_CONFIG.cardTransition.duration * 0.7,
        easing: ANIMATION_CONFIG.cardTransition.easing,
      })
    );

    // Scale and slight fade
    scaleValue.value = withTiming(0.85, {
      duration: ANIMATION_CONFIG.cardTransition.duration,
      easing: ANIMATION_CONFIG.cardTransition.easing,
    });

    // Just a slight fade for depth effect
    opacityValue.value = withTiming(0.8, {
      duration: ANIMATION_CONFIG.cardTransition.duration,
      easing: ANIMATION_CONFIG.cardTransition.easing,
    });

    // After animation, move the first photo to the end and reset animation values
    setTimeout(() => {
      setPhotos((currentPhotos) => {
        const [first, ...rest] = currentPhotos;
        return [...rest, first];
      });

      // Reset all animation values
      translateX.value = 0;
      translateY.value = 0;
      scaleValue.value = 1;
      opacityValue.value = 1;
    }, ANIMATION_CONFIG.cardTransition.duration);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scaleValue.value },
      ],
      opacity: opacityValue.value,
    };
  });

  return (
    <Animated.View
      style={styles.photosSection}
      entering={FadeInUp.delay(600).duration(ANIMATION_CONFIG.fadeIn.duration)}
    >
      <Text style={styles.sectionTitle}>You</Text>
      <View style={styles.stackContainer}>
        {photos.map((photo, index) => (
          <TouchableWithoutFeedback
            key={photo.id}
            onPress={index === 0 ? handlePhotoTap : undefined}
          >
            <Animated.View
              style={[
                styles.facePhotoContainer,
                {
                  position: "absolute",
                  zIndex: photos.length - index,
                  bottom: index * CARD_OFFSET,
                  right: index * CARD_OFFSET,
                },
                index === 0 ? animatedStyle : null,
              ]}
            >
              <Image source={photo.uri} style={styles.facePhoto} />
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </View>
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
    marginBottom: 35,
    marginLeft: 4,
    fontFamily: "Fraunces",
  },
  stackContainer: {
    height: width * 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  facePhotoContainer: {
    width: width * 0.83,
    height: width * 1.0,
    borderRadius: 24,
    overflow: "hidden",
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
});
