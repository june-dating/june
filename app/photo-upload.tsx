"use client";

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "./colors";

const { width, height } = Dimensions.get("window");

// Calculate available screen space for responsive design
const SCREEN_HEIGHT = height;
const AVAILABLE_HEIGHT = SCREEN_HEIGHT * 0.85; // Use 85% of screen height for content

interface PhotoItem {
  id: string;
  uri: string;
}

function PhotoCarousel({
  photos,
  onRemovePhoto,
}: {
  photos: PhotoItem[];
  onRemovePhoto: (id: string) => void;
}) {
  // Responsive sizing based on screen height
  const carouselHeight = Math.min(AVAILABLE_HEIGHT * 0.32, 170); // 32% of available height, max 170px
  const itemWidth = carouselHeight - 8; // Square photos with minimal padding
  const itemSpacing = 14;
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderPhotoItem = ({
    item,
    index,
  }: {
    item: PhotoItem | null;
    index: number;
  }) => {
    const photo = item;

    return (
      <TouchableOpacity
        style={[
          styles.carouselItem,
          {
            width: itemWidth,
            height: itemWidth,
            marginRight: index === 9 ? 0 : itemSpacing,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => photo && onRemovePhoto(photo.id)}
      >
        {photo ? (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.photo}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={styles.photoOverlay}
            >
              <View style={styles.removeButton}>
                <Ionicons name="close" size={18} color="#FFF" />
              </View>
            </LinearGradient>
          </View>
        ) : (
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
            style={styles.emptySlot}
          >
            <View style={styles.emptySlotContent}>
              <Ionicons
                name="image-outline"
                size={28}
                color="rgba(255, 255, 255, 0.4)"
              />
              <Text style={styles.emptySlotText}>{index + 1}</Text>
            </View>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  };

  // Create array of 10 items (photos + empty slots)
  const carouselData = Array.from({ length: 10 }, (_, index) => {
    return photos[index] || null;
  });

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageIndex = Math.floor(contentOffset.x / (itemWidth + itemSpacing));
    setCurrentIndex(pageIndex);
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={carouselData}
        renderItem={renderPhotoItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        snapToInterval={itemWidth + itemSpacing}
        decelerationRate="fast"
        snapToAlignment="start"
        bounces={false}
        keyExtractor={(item, index) => item?.id || `empty-${index}`}
        onScroll={onScroll}
        scrollEventThrottle={16}
        pagingEnabled={false}
        removeClippedSubviews={false}
      />

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {Array.from({ length: Math.ceil(10 / 3) }, (_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  Math.floor(currentIndex / 3) === index
                    ? OnboardingColors.background.input
                    : OnboardingColors.background.input,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function SelectPhotosButton({
  onPress,
  isComplete,
}: {
  onPress: () => void;
  isComplete: boolean;
}) {
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (isComplete) {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [isComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 1, 0]),
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [-width, width]) },
    ],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    onPress();
  };

  return (
    <Animated.View style={[styles.selectButtonContainer, animatedStyle]}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[
            OnboardingColors.background.input,
            OnboardingColors.background.input,
          ]}
          style={styles.selectButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name="images"
            size={24}
            color={OnboardingColors.icon.button}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.selectButtonText}>Select Photos</Text>

          {isComplete && (
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255, 255, 255, 0.4)",
                  "transparent",
                ]}
                style={styles.shimmerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function CompletionButton({
  isComplete,
  onPress,
}: {
  isComplete: boolean;
  onPress: () => void;
}) {
  const shimmer = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isComplete) {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
      scale.value = withSequence(
        withTiming(1.02, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    } else {
      shimmer.value = 0;
      scale.value = 1;
    }
  }, [isComplete]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 1, 0]),
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [-width, width]) },
    ],
  }));

  return (
    <Animated.View
      style={[styles.completionButtonContainer, animatedButtonStyle]}
    >
      <TouchableOpacity
        style={[
          styles.completionButton,
          !isComplete && styles.completionButtonDisabled,
        ]}
        onPress={onPress}
        disabled={!isComplete}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            isComplete
              ? OnboardingColors.background.buttonEnabled
              : [
                  OnboardingColors.background.input,
                  OnboardingColors.background.input,
                ]
          }
          style={styles.completionButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name="checkmark"
            size={22}
            color={
              isComplete
                ? OnboardingColors.text.button
                : OnboardingColors.text.buttonDisabled
            }
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.completionButtonText,
              !isComplete && styles.completionButtonTextDisabled,
            ]}
          >
            Complete Profile
          </Text>

          {isComplete && (
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255, 255, 255, 0.3)",
                  "transparent",
                ]}
                style={styles.shimmerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PhotoUploadScreen() {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });
  if (!fontsLoaded) return null;

  const isComplete = true; // Always allow completion - photos are optional

  const pickMultipleImages = async () => {
    try {
      setIsLoading(true);

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to upload a photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 10 - photos.length,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newPhotos: PhotoItem[] = result.assets.map((asset, index) => ({
          id: `photo_${Date.now()}_${index}`,
          uri: asset.uri,
        }));

        setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select photos. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const handleComplete = () => {
    if (isComplete) {
      console.log(`${photos.length} photos uploaded, proceeding to next step`);
      // Navigate to profile screen
      router.push("/gpt");
    }
  };

  const progressPercentage = (photos.length / 10) * 100;

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
        start={{ x: 1, y: 1.3 }}
        end={{ x: 0, y: 0 }}
      >
        {/* Title - aligned with back button */}
        <View style={[styles.titleContainer, { top: insets.top + 20 }]}>
          <Text style={styles.title}>Show your world</Text>
        </View>

        <View style={[styles.mainContainer, { paddingTop: insets.top + 80 }]}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.subtitle}>
                Add atleast 5 pictures (optional)
              </Text>
            </View>

            {/* Photo Grid */}
            <View style={styles.photoSection}>
              <PhotoCarousel photos={photos} onRemovePhoto={removePhoto} />
            </View>

            {/* Select Photos Button */}
            {photos.length < 10 && (
              <SelectPhotosButton
                onPress={pickMultipleImages}
                isComplete={isComplete}
              />
            )}

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>Photo Tips</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Ionicons
                    name="camera"
                    size={16}
                    color={OnboardingColors.icon.button}
                  />
                  <Text style={styles.tipText}>Include clear face photos</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons
                    name="sunny"
                    size={16}
                    color={OnboardingColors.icon.button}
                  />
                  <Text style={styles.tipText}>
                    Show your hobbies and interests
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons
                    name="heart"
                    size={16}
                    color={OnboardingColors.icon.button}
                  />
                  <Text style={styles.tipText}>Be authentic and genuine</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons
                    name="star"
                    size={16}
                    color={OnboardingColors.icon.button}
                  />
                  <Text style={styles.tipText}>
                    Photos are optional but recommended
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Completion Button - positioned at bottom */}
        <View
          style={[styles.bottomButtonContainer, { bottom: insets.bottom + 20 }]}
        >
          <CompletionButton isComplete={isComplete} onPress={handleComplete} />
        </View>
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
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  backButton: {
    position: "absolute",
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OnboardingColors.background.input,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 24,
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.015, 8),
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "center",
    marginBottom: 18,
    fontFamily: "Fraunces",
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingColors.text.secondary,
    textAlign: "center",
    fontFamily: "Fraunces",
    fontWeight: "300",
    lineHeight: 22,
  },
  progressSection: {
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.025, 16),
  },
  progressInfo: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: OnboardingColors.text.progress,
    fontFamily: "Fraunces",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  progressComplete: {
    color: OnboardingColors.icon.button,
    fontWeight: "700",
    fontFamily: "Fraunces",
  },
  progressBar: {
    width: width - 64,
    height: 6,
    backgroundColor: OnboardingColors.background.progressBackground,
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: OnboardingColors.background.progressFill,
    borderRadius: 3,
  },
  thresholdIndicator: {
    position: "absolute",
    left: "50%",
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: OnboardingColors.background.progressFill,
    borderRadius: 1,
  },
  progressSubtext: {
    fontSize: 12,
    color: OnboardingColors.text.tertiary,
    fontFamily: "Fraunces",
    fontWeight: "400",
    marginTop: 6,
    textAlign: "center",
  },
  photoSection: {
    marginTop: 32,
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.025, 16),
  },
  carouselContainer: {
    height: Math.min(AVAILABLE_HEIGHT * 0.32, 170) + 25,
    marginBottom: 15,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 14,
    backgroundColor: OnboardingColors.background.input,
    borderWidth: 2,
    borderColor: OnboardingColors.border.input,
  },
  photoContainer: {
    flex: 1,
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 10,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptySlot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: OnboardingColors.border.input,
    borderStyle: "dashed",
    backgroundColor: OnboardingColors.background.input,
  },
  emptySlotContent: {
    alignItems: "center",
  },
  emptySlotText: {
    fontSize: 14,
    color: OnboardingColors.text.tertiary,
    fontFamily: "Fraunces",
    fontWeight: "600",
    marginTop: 6,
  },
  selectButtonContainer: {
    alignItems: "center",
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.025, 16),
  },
  selectButton: {
    width: width - 48,
    height: Math.max(AVAILABLE_HEIGHT * 0.065, 48),
    borderRadius: 20,
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  selectButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
    position: "relative",
    overflow: "hidden",
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: OnboardingColors.text.tertiary,
    fontFamily: "Fraunces",
  },
  smallProgressText: {
    fontSize: 13,
    color: OnboardingColors.text.tertiary,
    fontFamily: "Fraunces",
    textAlign: "center",
    marginBottom: 16,
  },
  tipsSection: {
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.08, 40),
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    marginBottom: 10,
    textAlign: "center",
  },
  tipsList: {
    backgroundColor: OnboardingColors.background.platformCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: OnboardingColors.text.secondary,
    fontFamily: "Fraunces",
    marginLeft: 10,
    flex: 1,
  },
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  completionButtonContainer: {
    alignItems: "center",
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.02, 10),
  },
  completionButton: {
    width: width - 48,
    height: Math.max(AVAILABLE_HEIGHT * 0.065, 48),
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.light,
    shadowRadius: OnboardingColors.shadow.radius.small,
    elevation: OnboardingColors.shadow.elevation.light,
  },
  completionButtonDisabled: {
    opacity: OnboardingColors.opacity.buttonDisabled,
  },
  completionButtonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: OnboardingColors.text.button,
    fontFamily: "Fraunces",
  },
  completionButtonTextDisabled: {
    color: OnboardingColors.text.buttonDisabled,
    fontFamily: "Fraunces",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
  },
  shimmerGradient: {
    flex: 1,
    width: 100,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: OnboardingColors.background.input,
  },
});
