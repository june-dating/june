import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mock user data - replace with actual user data
const user = {
  photo: require("../assets/images/img1.jpg"),
  name: "Aija Mayrock",
  age: 26,
  location: "New York, USA",
};

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleChatPress = () => {
    router.push("/chat-screen");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <MaskedView
        style={styles.maskedContainer}
        maskElement={
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.7)",
              "rgba(255, 255, 255, 0.9)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 0.8)",
            ]}
            style={styles.maskGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.3, 0.5, 0.7, 1]}
          />
        }
      >
        <ImageBackground
          source={user.photo}
          resizeMode="cover"
          style={styles.imageBackground}
          imageStyle={styles.backgroundImage}
        >
          {/* Additional gradient overlay for better blending */}
          <LinearGradient
            colors={[
              "rgba(148, 64, 221, 0.4)",
              "rgba(148, 64, 221, 0.2)",
              "transparent",
              "transparent",
              "rgba(0, 0, 0, 0.3)",
              "rgba(0, 0, 0, 0.8)",
            ]}
            style={styles.overlayGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.15, 0.3, 0.6, 0.8, 1]}
          />
        </ImageBackground>
      </MaskedView>

      {/* Content overlay - outside of masked view for better performance */}
      <View style={styles.contentOverlay}>
        {/* Filter button */}
        <TouchableOpacity
          style={[styles.filterButton, { top: insets.top + 5 }]}
          onPress={() => console.log("Filter pressed")}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        {/* Footer overlay */}
        <View
          style={[styles.footerOverlay, { paddingBottom: insets.bottom + 40 }]}
        >
          {/* User info section with heart button */}
          <View style={styles.userInfoRow}>
            <View style={styles.userInfoSection}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#4CAF50"
                  style={styles.verifiedBadge}
                />
              </View>
              <View style={styles.userDetailsRow}>
                <Text style={styles.userAge}>{user.age}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color="#bbb" />
                  <Text style={styles.userLocation}>{user.location}</Text>
                </View>
              </View>
            </View>

            {/* Heart button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.heartButton]}
              onPress={() => console.log("Heart pressed")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/images/june-preview.png")}
                style={styles.heartImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtonsContainer}>
            {/* Skip button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.crossButton]}
              onPress={() => console.log("Skip pressed")}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="sword-cross"
                size={20}
                color="#ff4458"
              />
            </TouchableOpacity>

            {/* Chat button */}
            <TouchableOpacity
              style={styles.chatButton}
              onPress={handleChatPress}
              activeOpacity={0.7}
            >
              <View style={styles.chatButtonContent}>
                <Ionicons name="chatbubbles" size={22} color="#ffffff" />
                <View style={styles.chatTextContainer}>
                  <Text style={styles.chatButtonText}>Chat</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  maskedContainer: {
    flex: 1,
  },
  maskGradient: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backgroundImage: {
    alignSelf: "stretch",
    resizeMode: "cover",
    marginLeft: -20,
  },
  overlayGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  filterButton: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 22,
    // backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  footerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfoSection: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userAge: {
    color: "#ddd",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userLocation: {
    color: "#ddd",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 8,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  crossButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ff4458",
  },
  chatButton: {
    width: 200,
    height: 56,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  chatButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  chatButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
  heartButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  heartImage: {
    width: 30,
    height: 30,
  },
  chatTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  verifiedBadge: {
    marginLeft: 8,
  },
});
