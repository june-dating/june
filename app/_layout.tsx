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
import { OnboardingProvider } from "./contexts/OnboardingContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Mak: require("../assets/fonts/MAK-bold.otf"),
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <OnboardingProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Main App Screens */}
          <Stack.Screen name="index" />
          <Stack.Screen name="celebrate" />
          <Stack.Screen name="access" />
          <Stack.Screen name="juneconvo" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="photo-upload" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="chat-screen" />
          <Stack.Screen name="gpt" />
          {/* Tabs Navigator */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Profile Screens */}
          <Stack.Screen name="Profilescreens/june-thinks" />
          <Stack.Screen name="Profilescreens/june-tips" />
          <Stack.Screen name="Profilescreens/june-looking-for" />
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
    </OnboardingProvider>
  );
}
