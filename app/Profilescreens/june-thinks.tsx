import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  "Deep listener",
  "Thoughtful ambivert",
  "Believer in real talk over small talk",
  "Poet at heart",
];

// Enhanced floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.4 + 0.1,
    duration: Math.random() * 4000 + 3000,
  }));

  return (
    <View style={styles.particleContainer}>
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            {
              position: "absolute",
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            },
          ]}
          entering={FadeIn.delay(particle.id * 200).duration(1500)}
        >
          <FloatingParticle
            size={particle.size}
            opacity={particle.opacity}
            duration={particle.duration}
          />
        </Animated.View>
      ))}
    </View>
  );
}

function FloatingParticle({
  size,
  opacity,
  duration,
}: {
  size: number;
  opacity: number;
  duration: number;
}) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-20, { duration: duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: duration * 0.7,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      <View style={[styles.particleInner, { width: size, height: size }]} />
    </Animated.View>
  );
}

export default function JuneThinks() {
  const insets = useSafeAreaInsets();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePoints, setEditablePoints] = useState<string[]>(defaultPoints);

  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  const color = "#8B5CF6";
  const title = "June thinks you're a...";
  const icon = "brain";

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
        <FloatingParticles />

        {/* Glass overlay for enhanced depth */}
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
                colors={[`${color}40`, `${color}20`, "transparent"]}
                style={styles.iconGradientBg}
              />
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${color}25` },
                ]}
              >
                <MaterialCommunityIcons name={icon} size={36} color={color} />
              </View>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Based on your personality and interactions
            </Text>
          </Animated.View>

          <View style={styles.content}>
            <View style={styles.pointsWrapper}>
              {editablePoints.map((point: string, idx: number) => (
                <Animated.View
                  key={idx}
                  style={styles.pointContainer}
                  entering={FadeInUp.delay(idx * 150 + 400).duration(600)}
                >
                  <LinearGradient
                    colors={[
                      "rgba(255, 255, 255, 0.15)",
                      "rgba(255, 255, 255, 0.08)",
                    ]}
                    style={styles.pointCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.pointContent}>
                      <View
                        style={[
                          styles.bulletContainer,
                          { backgroundColor: color },
                        ]}
                      >
                        <Text style={styles.bullet}>{idx + 1}</Text>
                      </View>

                      {!isEditMode ? (
                        <Text style={styles.pointText}>{point}</Text>
                      ) : (
                        <View style={styles.editPointContainer}>
                          <TextInput
                            style={styles.editPointInput}
                            value={point}
                            onChangeText={(text) => updatePoint(idx, text)}
                            placeholder="Enter point..."
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
                entering={FadeInUp.delay(500).duration(600)}
              >
                <TouchableOpacity
                  style={[styles.addPointButton, { borderColor: color + "60" }]}
                  onPress={addNewPoint}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[`${color}20`, `${color}10`]}
                    style={styles.addPointGradient}
                  >
                    <Ionicons name="add" size={24} color={color} />
                    <Text style={[styles.addPointText, { color: color }]}>
                      Add Point
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
  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: "absolute",
  },
  particleInner: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
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
    marginBottom: 40,
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
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
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
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "Montserrat",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
  },
  pointsWrapper: {
    gap: 16,
  },
  pointContainer: {
    marginBottom: 4,
  },
  pointCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    overflow: "hidden",
  },
  pointContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
  },
  bulletContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    flexShrink: 0,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bullet: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.95)",
    fontFamily: "Montserrat",
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
