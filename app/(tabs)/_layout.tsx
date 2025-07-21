import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "profile-screen") {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            );
          }
          if (route.name === "date") {
            return (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={size}
                color={color}
              />
            );
          }
          return null;
        },
      })}
    >
      <Tabs.Screen name="profile-screen" options={{ title: "Profile" }} />
      <Tabs.Screen name="date" options={{ title: "Date" }} />
    </Tabs>
  );
}
