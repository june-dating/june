import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Phone number formatting function
const formatPhoneNumber = (text: string) => {
  // Remove all non-digits
  const cleaned = text.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 3) return `(${cleaned}`;
  if (cleaned.length <= 6)
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
    6,
    10
  )}`;
};

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  const handlePhoneChange = (text: string) => {
    // Remove formatting to get raw digits
    const cleaned = text.replace(/\D/g, "");

    // Limit to 10 digits
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  const handleInstagramChange = (text: string) => {
    // Remove @ symbol if user types it
    const cleaned = text.replace("@", "");
    setInstagram(cleaned);
  };

  const displayPhone = formatPhoneNumber(phone);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#5E2CA5", "#9440dd"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 20 }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + 80,
                paddingBottom: insets.bottom + 40,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Alice Seef"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.phoneInputContainer}>
                    <Text style={styles.phonePrefix}>+1</Text>
                    <TextInput
                      style={styles.phoneInput}
                      value={displayPhone}
                      onChangeText={handlePhoneChange}
                      placeholder="(123) 456-7890"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>

              {/* Instagram Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Instagram Handle</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.instagramInputContainer}>
                    <Text style={styles.instagramPrefix}>@</Text>
                    <TextInput
                      style={styles.instagramInput}
                      value={instagram}
                      onChangeText={handleInstagramChange}
                      placeholder="username"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              </View>

              {/* Gender Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderBox,
                      gender === "male" && styles.genderBoxSelected,
                    ]}
                    onPress={() => setGender("male")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "male" && styles.genderTextSelected,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.genderBox,
                      gender === "female" && styles.genderBoxSelected,
                    ]}
                    onPress={() => setGender("female")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === "female" && styles.genderTextSelected,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => router.push("/gpt")}
              >
                <LinearGradient
                  colors={["#F0EFFF", "#C6B2FF"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  backButton: {
    position: "absolute",
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9440dd",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
    fontFamily: "System",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    minHeight: height * 0.6,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    fontFamily: "System",
    letterSpacing: 0.3,
  },
  inputWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#9440dd",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  input: {
    height: 56,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "System",
    fontWeight: "500",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  phonePrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
    fontFamily: "System",
    letterSpacing: 0.3,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "System",
    fontWeight: "500",
  },
  instagramInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instagramPrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9440dd",
    marginRight: 8,
    fontFamily: "System",
    letterSpacing: 0.3,
  },
  instagramInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "System",
    fontWeight: "500",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 16,
  },
  genderBox: {
    flex: 1,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9440dd",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  genderBoxSelected: {
    backgroundColor: "rgba(148, 64, 221, 0.4)",
    borderColor: "rgba(240, 239, 255, 0.8)",
    shadowColor: "#9440dd",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "System",
    letterSpacing: 0.3,
  },
  genderTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    width: width - 64,
    height: 60,
    borderRadius: 30,
    shadowColor: "#9440dd",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonDisabled: {
    shadowOpacity: 0.2,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#9440dd",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: "rgba(148, 64, 221, 0.5)",
  },
});
