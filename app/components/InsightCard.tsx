import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { InsightCardProps } from "../../types/ProfileTypes";

const ANIMATION_CONFIG = {
  spring: {
    damping: 15,
    stiffness: 300,
  },
};

export default function InsightCard({
  title,
  icon,
  color = "#8B5CF6",
  onPress,
  isFullWidth = false,
  iconLibrary = "Ionicons",
}: InsightCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, ANIMATION_CONFIG.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION_CONFIG.spring);
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
          colors={[
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0.3)",
            "rgba(255, 255, 255, 0.2)",
          ]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: color + "20" },
              ]}
            >
              <IconComponent name={icon} size={28} color={color} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardSubtitle, { color }]}>
                Tap to explore
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(30px)",
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
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.35)",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: "Montserrat",
    color: "rgba(0, 0, 0, 0.85)",
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardFooter: {
    marginTop: "auto",
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Montserrat",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.8,
  },
});
