import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

const defaultPoints = [
  "Genuine and patient",
  "Great at meaningful conversations",
  "Creative and expressive",
  "Emotionally intelligent",
];

// Floating hearts for romantic theme
function FloatingHearts() {
  const hearts = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 8 + 4,
    opacity: Math.random() * 0.5 + 0.2,
    duration: Math.random() * 4000 + 3000,
  }));

  return (
    <View style={styles.heartContainer}>
      {hearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={[
            {
              position: "absolute",
              left: heart.x,
              top: heart.y,
              width: heart.size,
              height: heart.size,
            },
          ]}
          entering={FadeIn.delay(heart.id * 400).duration(2500)}
        >
          <FloatingHeart
            size={heart.size}
            opacity={heart.opacity}
            duration={heart.duration}
          />
        </Animated.View>
      ))}
    </View>
  );
}

function FloatingHeart({
  size,
  opacity,
  duration,
}: {
  size: number;
  opacity: number;
  duration: number;
}) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const rotate = useSharedValue(-5);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-15, { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.1, {
        duration: duration * 0.8,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    rotate.value = withRepeat(
      withTiming(5, {
        duration: duration * 0.9,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity,
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Ionicons name="heart" size={size} color="rgba(255, 108, 140, 0.6)" />
    </Animated.View>
  );
}

export default function JuneLookingFor() {
  const insets = useSafeAreaInsets();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePoints, setEditablePoints] = useState<string[]>(defaultPoints);

  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  const color = "#EF4444";
  const title = "June is looking for someone who is...";
  const icon = "heart";

  useEffect(() => {
    setEditablePoints(defaultPoints);
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    const filteredPoints = editablePoints.filter(
      (point) => point.trim() !== ""
    );
    setEditablePoints(filteredPoints);
    setIsEditMode(false);
    // In a real app, you'd send this to your backend here
    console.log("Saving points:", filteredPoints);
  };

  const handleCancel = () => {
    setEditablePoints(defaultPoints);
    setIsEditMode(false);
  };

  const updatePoint = (index: number, newText: string) => {
    const updatedPoints = [...editablePoints];
    updatedPoints[index] = newText;
    setEditablePoints(updatedPoints);
  };

  const addNewPoint = () => {
    setEditablePoints([...editablePoints, ""]);
  };

  const removePoint = (index: number) => {
    const updatedPoints = editablePoints.filter((_, i) => i !== index);
    setEditablePoints(updatedPoints);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        <FloatingHearts />

        {/* Romantic glass overlay */}
        <View style={styles.glassOverlay} />

        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="rgba(255, 255, 255, 0.9)"
            />
          </TouchableOpacity>

          {!isEditMode ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color="rgba(255, 255, 255, 0.9)"
                />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={styles.headerContent}
            entering={FadeInUp.delay(100).duration(800)}
          >
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={[`${color}60`, `${color}30`, "transparent"]}
                style={styles.iconGradientBg}
              />
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${color}25` },
                ]}
              >
                <Ionicons name={icon} size={36} color={color} />
                {/* Heartbeat effect */}
                <Animated.View style={styles.heartbeatRing} />
              </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Your ideal match qualities 💕</Text>
          </Animated.View>

          <View style={styles.content}>
            <View style={styles.lookingForHeader}>
              <View style={styles.headerBadge}>
                <Ionicons name="heart" size={16} color={color} />
                <Text style={styles.headerBadgeText}>Looking For</Text>
                <Ionicons name="heart" size={16} color={color} />
              </View>
            </View>

            <View style={styles.pointsWrapper}>
              {editablePoints.map((point: string, idx: number) => (
                <Animated.View
                  key={idx}
                  style={styles.pointContainer}
                  entering={FadeInUp.delay(idx * 150 + 600).duration(700)}
                >
                  <LinearGradient
                    colors={[
                      "rgba(255, 255, 255, 0.20)",
                      "rgba(255, 255, 255, 0.12)",
                    ]}
                    style={styles.qualityCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.cardGlow} />
                    <View style={styles.pointContent}>
                      <View
                        style={[
                          styles.bulletContainer,
                          { backgroundColor: color },
                        ]}
                      >
                        <Ionicons name="diamond" size={16} color="#FFF" />
                      </View>

                      {!isEditMode ? (
                        <Text style={styles.pointText}>{point}</Text>
                      ) : (
                        <View style={styles.editPointContainer}>
                          <TextInput
                            style={styles.editPointInput}
                            value={point}
                            onChangeText={(text) => updatePoint(idx, text)}
                            placeholder="Enter quality..."
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            multiline={true}
                            textAlignVertical="top"
                          />
                          <TouchableOpacity
                            style={styles.removePointButton}
                            onPress={() => removePoint(idx)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="close-circle"
                              size={22}
                              color="#FF6B6B"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>

            {isEditMode && (
              <Animated.View
                style={styles.addPointContainer}
                entering={FadeInUp.delay(700).duration(600)}
              >
                <TouchableOpacity
                  style={[styles.addPointButton, { borderColor: color + "70" }]}
                  onPress={addNewPoint}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[`${color}30`, `${color}20`]}
                    style={styles.addPointGradient}
                  >
                    <Ionicons name="heart-outline" size={24} color={color} />
                    <Text style={[styles.addPointText, { color: color }]}>
                      Add Quality
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            <View style={styles.footer}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.1)",
                  "rgba(255, 255, 255, 0.05)",
                ]}
                style={styles.footerCard}
              >
                <Text style={styles.footerText}>
                  "The heart wants what it wants" 💖
                </Text>
              </LinearGradient>
            </View>
          </View>
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
  heartContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(239, 68, 68, 0.04)",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  editButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    fontFamily: "Montserrat",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 23,
    backgroundColor: "rgba(76, 175, 80, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.4)",
    shadowColor: "rgba(76, 175, 80, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    fontFamily: "Montserrat",
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  scrollView: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContent: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  iconGradientBg: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -20,
    left: -20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "rgba(239, 68, 68, 0.5)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    position: "relative",
  },
  heartbeatRing: {
    position: "absolute",
    width: 95,
    height: 95,
    borderRadius: 47.5,
    borderWidth: 2,
    borderColor: "rgba(239, 68, 68, 0.3)",
    opacity: 0.7,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.95)",
    fontFamily: "Fraunces",
    lineHeight: 32,
    letterSpacing: 0.5,
    fontWeight: "600",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.75)",
    fontFamily: "Montserrat",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
  },
  lookingForHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    gap: 8,
  },
  headerBadgeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "Fraunces",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  pointsWrapper: {
    gap: 18,
  },
  pointContainer: {
    marginBottom: 4,
  },
  qualityCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "rgba(239, 68, 68, 0.2)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(239, 68, 68, 0.6)",
    shadowColor: "rgba(239, 68, 68, 0.8)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  pointContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 22,
  },
  bulletContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    flexShrink: 0,
    shadowColor: "rgba(239, 68, 68, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  pointText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
    fontWeight: "400",
    flex: 1,
    fontFamily: "Fraunces",
  },
  editPointContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  editPointInput: {
    flex: 1,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 48,
    fontWeight: "400",
    fontFamily: "Fraunces",
  },
  removePointButton: {
    marginLeft: 12,
    padding: 6,
    marginTop: 6,
  },
  addPointContainer: {
    marginTop: 28,
    marginBottom: 20,
  },
  addPointButton: {
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  addPointGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 26,
  },
  addPointText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    fontFamily: "Fraunces",
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerCard: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  footerText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Fraunces",
    fontStyle: "italic",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
