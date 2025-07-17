"use client";

import { Ionicons } from "@expo/vector-icons";
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
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.3)",
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
          colors={["#F0EFFF", "#C6B2FF"]}
          style={styles.selectButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name="images"
            size={24}
            color="#5E2CA5"
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
              ? ["#8B5FBF", "#5E2CA5"]
              : ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
          }
          style={styles.completionButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name="checkmark"
            size={22}
            color={isComplete ? "#FFF" : "rgba(255, 255, 255, 0.4)"}
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
      router.push("/profile-screen");
    }
  };

  const progressPercentage = (photos.length / 10) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#3A1B6B", "#5E2CA5", "#8B5FBF"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 20 }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Title - aligned with back button */}
        <View style={[styles.titleContainer, { top: insets.top + 20 }]}>
          <Text style={styles.title}>Show your world</Text>
        </View>

        <View style={[styles.mainContainer, { paddingTop: insets.top + 80 }]}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.subtitle}>
                Add photos to show who you are (optional)
              </Text>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  {photos.length}/10 selected
                  {photos.length > 0 && (
                    <Text style={styles.progressComplete}> ✓ Great!</Text>
                  )}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercentage}%` },
                    ]}
                  />
                  {/* Minimum threshold indicator */}
                  <View style={styles.thresholdIndicator} />
                </View>
                <Text style={styles.progressSubtext}>
                  {photos.length === 0
                    ? "Add photos to enhance your profile"
                    : `${10 - photos.length} more slots available`}
                </Text>
              </View>
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
                  <Ionicons name="camera" size={16} color="#C6B2FF" />
                  <Text style={styles.tipText}>Include clear face photos</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="sunny" size={16} color="#C6B2FF" />
                  <Text style={styles.tipText}>
                    Show your hobbies and interests
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="heart" size={16} color="#C6B2FF" />
                  <Text style={styles.tipText}>Be authentic and genuine</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="star" size={16} color="#C6B2FF" />
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
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
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.04, 28),
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.022, 15),
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "400",
    lineHeight: 22,
  },
  progressSection: {
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.025, 16),
  },
  progressInfo: {
    alignItems: "center",
  },
  progressText: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.022, 14),
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "System",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  progressComplete: {
    color: "#C6B2FF",
    fontWeight: "700",
  },
  progressBar: {
    width: width - 64,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#C6B2FF",
    borderRadius: 3,
  },
  thresholdIndicator: {
    position: "absolute",
    left: "50%", // 50% represents the 5/10 minimum threshold
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: "#F0EFFF",
    borderRadius: 1,
  },
  progressSubtext: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.018, 12),
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "System",
    fontWeight: "400",
    marginTop: 6,
    textAlign: "center",
  },
  photoSection: {
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.025, 16),
  },
  carouselContainer: {
    height: Math.min(AVAILABLE_HEIGHT * 0.32, 170) + 25, // Responsive height with larger photos
    marginBottom: 15,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 14,
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
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
  },
  emptySlotContent: {
    alignItems: "center",
  },
  emptySlotText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "System",
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
    borderRadius: Math.max(AVAILABLE_HEIGHT * 0.032, 24),
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  selectButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden",
  },
  selectButtonText: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.024, 16),
    fontWeight: "700",
    color: "#5E2CA5",
    fontFamily: "System",
  },
  tipsSection: {
    marginBottom: Math.max(AVAILABLE_HEIGHT * 0.08, 40),
  },
  tipsTitle: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.024, 16),
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
    marginBottom: 10,
    textAlign: "center",
  },
  tipsList: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.02, 13),
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "System",
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
    borderRadius: Math.max(AVAILABLE_HEIGHT * 0.032, 24),
    overflow: "hidden",
    shadowColor: "#8B5FBF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  completionButtonDisabled: {
    shadowOpacity: 0.1,
  },
  completionButtonGradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  completionButtonText: {
    fontSize: Math.max(AVAILABLE_HEIGHT * 0.024, 16),
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  completionButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.4)",
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
  },
});
