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
  "Be more spontaneous",
  "Open up sooner - people want to see the real you",
  "Try new activities outside your comfort zone",
];

// Sparkling light effect for tips theme
function SparklingLights() {
  const lights = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 6 + 3,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 3000 + 2000,
  }));

  return (
    <View style={styles.lightContainer}>
      {lights.map((light) => (
        <Animated.View
          key={light.id}
          style={[
            {
              position: "absolute",
              left: light.x,
              top: light.y,
              width: light.size,
              height: light.size,
            },
          ]}
          entering={FadeIn.delay(light.id * 300).duration(2000)}
        >
          <SparklingLight
            size={light.size}
            opacity={light.opacity}
            duration={light.duration}
          />
        </Animated.View>
      ))}
    </View>
  );
}

function SparklingLight({
  size,
  opacity,
  duration,
}: {
  size: number;
  opacity: number;
  duration: number;
}) {
  const scale = useSharedValue(0.5);
  const rotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    rotate.value = withRepeat(
      withTiming(360, { duration: duration * 1.5, easing: Easing.linear }),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: duration * 0.6,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.lightStar, animatedStyle]}>
      <View style={[styles.lightCore, { width: size, height: size }]} />
      <Animated.View
        style={[
          styles.lightGlow,
          glowStyle,
          { width: size * 2, height: size * 2 },
        ]}
      />
    </Animated.View>
  );
}

export default function JuneTips() {
  const insets = useSafeAreaInsets();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePoints, setEditablePoints] = useState<string[]>(defaultPoints);

  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  const color = "#F59E0B";
  const title = "June's tips to be a Better Date";
  const icon = "bulb";

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
        <SparklingLights />

        {/* Enhanced glass overlay with warm tint */}
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
                colors={[`${color}50`, `${color}25`, "transparent"]}
                style={styles.iconGradientBg}
              />
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${color}30` },
                ]}
              >
                <Ionicons name={icon} size={36} color={color} />
                {/* Pulsing effect for bulb */}
                <Animated.View style={styles.iconPulse} />
              </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Personalized advice to shine brighter ✨
            </Text>
          </Animated.View>

          <View style={styles.content}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipHeaderText}>💡 Pro Tips</Text>
            </View>

            <View style={styles.pointsWrapper}>
              {editablePoints.map((point: string, idx: number) => (
                <Animated.View
                  key={idx}
                  style={styles.pointContainer}
                  entering={FadeInUp.delay(idx * 150 + 500).duration(600)}
                >
                  <LinearGradient
                    colors={[
                      "rgba(255, 255, 255, 0.18)",
                      "rgba(255, 255, 255, 0.10)",
                    ]}
                    style={styles.tipCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.tipAccent} />
                    <View style={styles.pointContent}>
                      <View
                        style={[
                          styles.bulletContainer,
                          { backgroundColor: color },
                        ]}
                      >
                        <Ionicons name="star" size={18} color="#FFF" />
                      </View>

                      {!isEditMode ? (
                        <Text style={styles.pointText}>{point}</Text>
                      ) : (
                        <View style={styles.editPointContainer}>
                          <TextInput
                            style={styles.editPointInput}
                            value={point}
                            onChangeText={(text) => updatePoint(idx, text)}
                            placeholder="Enter tip..."
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
                entering={FadeInUp.delay(600).duration(600)}
              >
                <TouchableOpacity
                  style={[styles.addPointButton, { borderColor: color + "60" }]}
                  onPress={addNewPoint}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[`${color}25`, `${color}15`]}
                    style={styles.addPointGradient}
                  >
                    <Ionicons name="add" size={24} color={color} />
                    <Text style={[styles.addPointText, { color: color }]}>
                      Add Tip
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
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
  lightContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  lightStar: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  lightCore: {
    backgroundColor: "#FFD700",
    borderRadius: 50,
    position: "absolute",
  },
  lightGlow: {
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderRadius: 50,
    position: "absolute",
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 193, 7, 0.03)",
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
    shadowColor: "rgba(245, 158, 11, 0.4)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    position: "relative",
  },
  iconPulse: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    opacity: 0.6,
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
  tipHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  tipHeaderText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "Fraunces",
    fontWeight: "600",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  pointsWrapper: {
    gap: 16,
  },
  pointContainer: {
    marginBottom: 4,
  },
  tipCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(245, 158, 11, 0.2)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  tipAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  pointContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    paddingLeft: 24,
  },
  bulletContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    flexShrink: 0,
    shadowColor: "rgba(245, 158, 11, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    marginTop: 24,
    marginBottom: 20,
  },
  addPointButton: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  addPointGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  addPointText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "Fraunces",
    letterSpacing: 0.5,
  },
});
