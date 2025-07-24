import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleEditPress = () => {
    router.push("/edit-profile");
  };

  return (
    <BlurView
      intensity={40}
      tint="light"
      style={[styles.header, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/pink1.png")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>June</Text>
      </View>
      <TouchableOpacity onPress={handleEditPress}>
        <Ionicons
          name="create-outline"
          size={30}
          color="#222"
          style={{
            marginRight: 10,
          }}
        />
      </TouchableOpacity>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderBottomWidth: 0.5,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 45,
    height: 40,
    resizeMode: "contain",
  },
  logoText: {
    fontFamily: "MAK",
    fontSize: 30,
    color: "#000",
    marginLeft: 4,
    fontWeight: "bold",
    height: 30,
  },
});
