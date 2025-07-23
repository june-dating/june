import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";

export const OnboardingDebug: React.FC = () => {
  const { onboardingData } = useOnboarding();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug: Onboarding Data</Text>
      <Text style={styles.data}>{JSON.stringify(onboardingData, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    borderRadius: 8,
    maxWidth: 200,
    zIndex: 1000,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 12,
  },
  data: {
    color: "white",
    fontSize: 10,
    fontFamily: "monospace",
  },
});

// Default export for Expo Router compatibility
export default OnboardingDebug;
