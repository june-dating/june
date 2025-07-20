import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Mak: require("../assets/fonts/MAK-bold.otf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main App Screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="juneconvo" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="photo-upload" />
        <Stack.Screen name="profile-screen" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="chat-screen" />
        <Stack.Screen name="gpt" />

        {/* Onboarding Screens */}
        <Stack.Screen name="onboarding/name" />
        <Stack.Screen name="onboarding/birthday" />
        <Stack.Screen name="onboarding/gender" />
        <Stack.Screen name="onboarding/looking-for" />
        <Stack.Screen name="onboarding/socials" />
        <Stack.Screen name="onboarding/phone" />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" hidden={true} />
    </ThemeProvider>
  );
}
