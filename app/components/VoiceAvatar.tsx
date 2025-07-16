"use client";

import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface VoiceAvatarProps {
  isListening: boolean;
}

export default function VoiceAvatar({ isListening }: VoiceAvatarProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.3);
  const particleScale = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      // Main orb pulsing animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Continuous rotation
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );

      // Pulse ring animation
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.2, { duration: 1000 })
        ),
        -1,
        false
      );

      // Particle animation
      particleScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1200 }),
          withTiming(0.8, { duration: 1200 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
      rotation.value = withTiming(0, { duration: 500 });
      pulseOpacity.value = withTiming(0.3, { duration: 500 });
      particleScale.value = withTiming(1, { duration: 500 });
    }
  }, [isListening]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [
      { scale: interpolate(pulseOpacity.value, [0.2, 0.8], [1, 1.3]) },
    ],
  }));

  const animatedParticleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: particleScale.value }],
  }));

  return (
    <View style={styles.avatarContainer}>
      {/* Outer pulse ring */}
      <Animated.View style={[styles.pulseRing, animatedPulseStyle]}>
        <LinearGradient
          colors={["rgba(198, 178, 255, 0.3)", "rgba(240, 239, 255, 0.1)"]}
          style={styles.pulseGradient}
        />
      </Animated.View>

      {/* Particle effects */}
      <Animated.View style={[styles.particleContainer, animatedParticleStyle]}>
        {[...Array(8)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { rotate: `${index * 45}deg` },
                  { translateY: -80 },
                ],
              },
            ]}
          >
            <View style={styles.particleDot} />
          </View>
        ))}
      </Animated.View>

      {/* Main orb */}
      <Animated.View style={[styles.orb, animatedOrbStyle]}>
        <LinearGradient
          colors={["#C6B2FF", "#8B5FBF", "#5E2CA5"]}
          style={styles.orbGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Inner glow */}
        <View style={styles.innerGlow}>
          <LinearGradient
            colors={["rgba(240, 239, 255, 0.8)", "rgba(198, 178, 255, 0.2)"]}
            style={styles.innerGlowGradient}
          />
        </View>
      </Animated.View>

      {/* Sound waves when listening */}
      {isListening && (
        <View style={styles.soundWaves}>
          {[...Array(3)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.soundWave,
                {
                  animationDelay: `${index * 200}ms`,
                },
                animatedPulseStyle,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: "hidden",
  },
  pulseGradient: {
    flex: 1,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "rgba(198, 178, 255, 0.3)",
  },
  particleContainer: {
    position: "absolute",
    width: 200,
    height: 200,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    left: "50%",
    top: "50%",
    marginLeft: -2,
    marginTop: -2,
  },
  particleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F0EFFF",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
  orb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
    shadowColor: "#C6B2FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 70,
  },
  innerGlow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 60,
    overflow: "hidden",
  },
  innerGlowGradient: {
    flex: 1,
    borderRadius: 60,
  },
  soundWaves: {
    position: "absolute",
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  soundWave: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(240, 239, 255, 0.3)",
    borderRadius: 150,
  },
});
