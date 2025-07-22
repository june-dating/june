"use client";

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
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
  // Increase carousel height and item size
  const carouselHeight = Math.min(AVAILABLE_HEIGHT * 0.4, 220); // 40% of available height, max 220px
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
  return (
    <View style={styles.selectButtonContainer}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.selectButtonGradient}>
          <Ionicons
            name="add"
            size={20}
            color={OnboardingColors.icon.button}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.selectButtonText}>Add Photos</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function CompletionButton({
  isComplete,
  onPress,
}: {
  isComplete: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.completionButtonContainer}>
      <TouchableOpacity
        style={[
          styles.doneButtonPhotoUpload,
          !isComplete && styles.completionButtonDisabled,
        ]}
        onPress={onPress}
        disabled={!isComplete}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.doneButtonTextPhotoUpload,
            !isComplete && styles.completionButtonTextDisabled,
          ]}
        >
          Next
        </Text>
        <Ionicons
          name="arrow-forward"
          size={22}
          color={
            isComplete
              ? OnboardingColors.icon.button
              : OnboardingColors.icon.buttonDisabled
          }
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </View>
  );
}

// F-pattern: Title and subtitle top left, then photo grid, then add button, then complete button bottom right
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
      router.push("/gpt");
    }
  };
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
        <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
          {/* F-pattern main content */}
          {/* Title and subtitle - top left */}
          <View style={styles.headerFPattern}>
            <Text style={styles.titleFPattern}>Show your world</Text>
            <Text style={styles.subtitleFPattern}>
              Add at least 5 pictures (optional)
            </Text>
          </View>
          {/* Photo Grid - left aligned, more vertical space */}
          <View style={styles.photoSectionFPattern}>
            <PhotoCarousel photos={photos} onRemovePhoto={removePhoto} />
          </View>
          {/* Add Photos Button - left aligned */}
          {photos.length < 10 && (
            <View style={styles.addButtonFPattern}>
              <SelectPhotosButton
                onPress={pickMultipleImages}
                isComplete={isComplete}
              />
            </View>
          )}
        </View>
        {/* Completion Button - bottom right */}
        <View
          style={[
            styles.bottomButtonContainer,
            {
              bottom: insets.bottom + 10,
              alignItems: "flex-end",
              paddingRight: 24,
            },
          ]}
        >
          {/* F-pattern end */}
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
    paddingTop: 20,
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
    height: 48, // reduced from 64
    marginTop: 8, // reduced from 16
  },
  content: {
    paddingHorizontal: 16, // reduced from 24
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 8, // fixed, less whitespace
  },
  title: {
    fontSize: 32, // reduced from 36
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    textAlign: "center",
    marginBottom: 10, // reduced from 18
    fontFamily: "Fraunces",
  },
  subtitle: {
    fontSize: 15, // slightly smaller
    color: OnboardingColors.text.secondary,
    textAlign: "center",
    fontFamily: "Fraunces",
    fontWeight: "300",
    lineHeight: 20, // slightly smaller
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
    marginTop: 16, // reduced from 32
    marginBottom: 10, // reduced
  },
  carouselContainer: {
    height: Math.min(AVAILABLE_HEIGHT * 0.5, 320) + 20, // much taller
    marginBottom: 0, // reduced to minimize gap with dots
  },
  carouselContent: {
    paddingHorizontal: 10, // reduced
  },
  carouselItem: {
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 18,
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
    padding: 24, // much larger overlay padding
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 10, // reduced
  },
  selectButton: {
    width: width - 64, // slightly narrower
    height: Math.max(AVAILABLE_HEIGHT * 0.055, 40), // reduced
    borderRadius: 16, // reduced
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OnboardingColors.border.input,
    position: "relative",
    overflow: "hidden",
  },
  selectButtonText: {
    fontSize: 15, // slightly smaller
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
    marginBottom: 6, // reduced
  },
  completionButton: {
    width: width - 64,
    height: Math.max(AVAILABLE_HEIGHT * 0.055, 40),
    borderRadius: 16,
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
    fontSize: 15,
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
    marginTop: 0, // minimal gap
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: OnboardingColors.background.input,
  },
  // Enhanced Select Photos button
  selectButtonContainerEnhanced: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 18,
  },
  selectButtonEnhanced: {
    width: width - 64,
    height: 52,
    borderRadius: 28,
    shadowColor: "#6D5FFD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  selectButtonGradientEnhanced: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 0,
    overflow: "hidden",
  },
  plusIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  selectButtonTextEnhanced: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Fraunces",
    letterSpacing: 0.5,
  },
  // Move photo grid lower
  photoSectionMoved: {
    marginTop: 80, // increased from 40
    marginBottom: 0,
  },
  // Move subtitle below photo grid
  headerContainerMoved: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  subtitleMoved: {
    fontSize: 15,
    color: OnboardingColors.text.secondary,
    textAlign: "center",
    fontFamily: "Fraunces",
    fontWeight: "300",
    lineHeight: 20,
  },
  // Add new styles for onboarding-style completion button
  completionButtonGradientOnboarding: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  completionButtonTextOnboarding: {
    fontSize: 18,
    fontWeight: "400",
    color: OnboardingColors.text.button,
    marginRight: 8,
    fontFamily: "Fraunces",
    letterSpacing: 0.7,
  },
  // F-pattern styles
  headerFPattern: {
    marginBottom: 32,
    alignItems: "flex-start",
  },
  titleFPattern: {
    fontSize: 36,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    marginBottom: 12,
    textAlign: "left",
    lineHeight: 44,
    fontFamily: "Fraunces",
  },
  subtitleFPattern: {
    fontSize: 16,
    color: OnboardingColors.text.secondary,
    textAlign: "left",
    lineHeight: 24,
    maxWidth: "85%",
    fontFamily: "Fraunces",
    fontWeight: "300",
  },
  photoSectionFPattern: {
    marginTop: 40, // moved down by 40px
  },
  addButtonFPattern: {
    alignItems: "flex-start",
    marginTop: 10,
  },
  doneButtonPhotoUpload: {
    flexDirection: "row",
    backgroundColor: OnboardingColors.background.input,
    borderRadius: 16, // match completionButton
    height: Math.max(AVAILABLE_HEIGHT * 0.09, 60), // increased height
    width: width - 64, // keep current width
    alignItems: "center",
    justifyContent: "center",
    shadowColor: OnboardingColors.shadow.primary,
    shadowOffset: OnboardingColors.shadow.offset,
    shadowOpacity: OnboardingColors.shadow.opacity.medium,
    shadowRadius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
    paddingHorizontal: 32, // match doneButton
    marginTop: 0, // no extra margin
  },
  doneButtonTextPhotoUpload: {
    fontSize: 20,
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
    fontWeight: "400",
    letterSpacing: 0.7,
  },
});
