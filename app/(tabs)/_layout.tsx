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
    },
    {
      name: "date",
      title: "Date",
      icon: "calendar-outline" as const,
      iconFocused: "calendar" as const,
      component: DateScreen,
    },
  ];

  return <SimpleTabNavigator tabs={tabs} initialTab="profile-screen" />;
}
