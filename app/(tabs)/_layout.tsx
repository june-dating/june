import SimpleTabNavigator from "../components/SimpleTabNavigator";
import DateScreen from "./date";
import ProfileScreen from "./profile-screen";

export default function TabsLayout() {
  const tabs = [
    {
      name: "profile-screen",
      title: "Profile",
      icon: "person-outline" as const,
      iconFocused: "person" as const,
      component: ProfileScreen,
      iconType: "ionicons" as const,
    },
    {
      name: "date",
      title: "Dates",
      icon: "clover" as const,
      iconFocused: "clover" as const,
      component: DateScreen,
      iconType: "fontawesome6" as const,
    },
  ];

  return <SimpleTabNavigator tabs={tabs} initialTab="profile-screen" />;
}
