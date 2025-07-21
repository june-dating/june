import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";

export default function DateScreen() {
  const [fontsLoaded] = useFonts({
    Fraunces: require("../../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Date Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontFamily: "Fraunces",
    color: "#222",
  },
});
