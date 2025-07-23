import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface TabConfig {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap | keyof typeof FontAwesome6.glyphMap;
  iconFocused:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof FontAwesome6.glyphMap;
  component: React.ComponentType<any>;
  iconType?: "ionicons" | "fontawesome6";
}

interface SimpleTabNavigatorProps {
  tabs: TabConfig[];
  initialTab?: string;
}

export default function SimpleTabNavigator({
  tabs,
  initialTab,
}: SimpleTabNavigatorProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.name);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Calculate tab width for animation
  const tabBarWidth = width * 0.85;
  const tabWidth = (tabBarWidth - 32) / tabs.length; // 32 for horizontal padding

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.name === activeTab);
    Animated.spring(slideAnimation, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: false,
      tension: 70,
      friction: 12,
    }).start();
  }, [activeTab, tabWidth, tabs]);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Render tab content
  const renderTabContent = () => {
    const currentTab = tabs.find((tab) => tab.name === activeTab);
    if (!currentTab) return null;

    const TabComponent = currentTab.component;
    return <TabComponent />;
  };

  return (
    <View style={styles.container}>
      {/* Tab Content */}
      <View style={styles.contentContainer}>{renderTabContent()}</View>

      {/* Floating Tab Bar with Glass Effect */}
      <View
        style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 0 }]}
      >
        <BlurView intensity={40} tint="dark" style={styles.tabBarBlur}>
          <View style={styles.tabBar}>
            {/* Animated Sliding Indicator */}
            <Animated.View
              style={[
                styles.slidingIndicator,
                {
                  width: tabWidth,
                  transform: [{ translateX: slideAnimation }],
                },
              ]}
            />

            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tabButton, { width: tabWidth }]}
                onPress={() => handleTabPress(tab.name)}
                activeOpacity={0.7}
              >
                <Animated.View style={styles.tabContent}>
                  {tab.iconType === "fontawesome6" ? (
                    <FontAwesome6
                      name={
                        activeTab === tab.name
                          ? (tab.iconFocused as keyof typeof FontAwesome6.glyphMap)
                          : (tab.icon as keyof typeof FontAwesome6.glyphMap)
                      }
                      size={22}
                      color={activeTab === tab.name ? "#FFFFFF" : "#DDDDDD"}
                      style={styles.tabIcon}
                    />
                  ) : (
                    <Ionicons
                      name={
                        activeTab === tab.name
                          ? (tab.iconFocused as keyof typeof Ionicons.glyphMap)
                          : (tab.icon as keyof typeof Ionicons.glyphMap)
                      }
                      size={22}
                      color={activeTab === tab.name ? "#FFFFFF" : "#DDDDDD"}
                      style={styles.tabIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: activeTab === tab.name ? "#FFFFFF" : "#DDDDDD",
                        fontWeight: activeTab === tab.name ? "600" : "400",
                      },
                    ]}
                  >
                    {tab.title}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  contentContainer: {
    flex: 1,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  tabBarBlur: {
    borderRadius: 35,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(26, 26, 26, 0.3)",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 12,
    maxWidth: width * 0.85,
    minWidth: width * 0.7,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  slidingIndicator: {
    position: "absolute",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 50,
    top: 12,
    left: 16,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 52,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: "center",
  },
});
