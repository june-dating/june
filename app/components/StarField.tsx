import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Star } from "../../types/ProfileTypes";

const { width, height } = Dimensions.get("window");

// Utility function to generate stars
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.1,
  }));
};

export default function StarField() {
  const stars = generateStars(15);

  return (
    <View style={styles.starField}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            {
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
            },
          ]}
          entering={FadeIn.delay(star.id * 100).duration(1000)}
        >
          <View style={[styles.star, { opacity: star.opacity }]} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starField: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 1,
  },
});
