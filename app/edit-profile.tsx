/**
 * Edit Profile Screen - Production-ready dating profile editor
 *
 * Features:
 * - Clean, modern design inspired by Hinge/Tinder
 * - Custom modal pickers sliding from bottom
 * - Proper spacing and typography
 * - Black text on light backgrounds for readability
 */

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
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
import { EditProfileData, PickerOption } from "../types/ProfileTypes";
import { OnboardingColors } from "./colors";
import StarField from "./components/StarField";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Enhanced picker options
const GENDER_OPTIONS: PickerOption[] = [
  { label: "Woman", value: "woman" },
  { label: "Man", value: "man" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const PRONOUNS_OPTIONS: PickerOption[] = [
  { label: "She/Her", value: "she/her" },
  { label: "He/Him", value: "he/him" },
  { label: "They/Them", value: "they/them" },
  { label: "She/They", value: "she/they" },
  { label: "He/They", value: "he/they" },
  { label: "Other", value: "other" },
];

const LOOKING_FOR_OPTIONS: PickerOption[] = [
  { label: "Women", value: "women" },
  { label: "Men", value: "men" },
  { label: "Non-binary people", value: "non-binary" },
  { label: "Everyone", value: "everyone" },
];

const AGE_OPTIONS: PickerOption[] = Array.from({ length: 63 }, (_, i) => ({
  label: `${i + 18}`,
  value: `${i + 18}`,
}));

const HEIGHT_OPTIONS: PickerOption[] = [
  // Feet and inches
  { label: `4'10" (147 cm)`, value: `4'10"` },
  { label: `4'11" (150 cm)`, value: `4'11"` },
  { label: `5'0" (152 cm)`, value: `5'0"` },
  { label: `5'1" (155 cm)`, value: `5'1"` },
  { label: `5'2" (157 cm)`, value: `5'2"` },
  { label: `5'3" (160 cm)`, value: `5'3"` },
  { label: `5'4" (163 cm)`, value: `5'4"` },
  { label: `5'5" (165 cm)`, value: `5'5"` },
  { label: `5'6" (168 cm)`, value: `5'6"` },
  { label: `5'7" (170 cm)`, value: `5'7"` },
  { label: `5'8" (173 cm)`, value: `5'8"` },
  { label: `5'9" (175 cm)`, value: `5'9"` },
  { label: `5'10" (178 cm)`, value: `5'10"` },
  { label: `5'11" (180 cm)`, value: `5'11"` },
  { label: `6'0" (183 cm)`, value: `6'0"` },
  { label: `6'1" (185 cm)`, value: `6'1"` },
  { label: `6'2" (188 cm)`, value: `6'2"` },
  { label: `6'3" (191 cm)`, value: `6'3"` },
  { label: `6'4" (193 cm)`, value: `6'4"` },
  { label: `6'5" (196 cm)`, value: `6'5"` },
  { label: `6'6" (198 cm)`, value: `6'6"` },
  { label: `6'7" (201 cm)`, value: `6'7"` },
];

const EDUCATION_OPTIONS: PickerOption[] = [
  { label: "High School", value: "high-school" },
  { label: "Some College", value: "some-college" },
  { label: "Associate's Degree", value: "associates" },
  { label: "Bachelor's Degree", value: "bachelors" },
  { label: "Master's Degree", value: "masters" },
  { label: "PhD/Doctorate", value: "phd" },
  { label: "Trade School", value: "trade-school" },
  { label: "Professional School", value: "professional" },
  { label: "Other", value: "other" },
];

const OCCUPATION_OPTIONS: PickerOption[] = [
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Finance", value: "finance" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Law", value: "law" },
  { label: "Consulting", value: "consulting" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Arts & Entertainment", value: "arts" },
  { label: "Food & Hospitality", value: "hospitality" },
  { label: "Non-profit", value: "non-profit" },
  { label: "Government", value: "government" },
  { label: "Retail", value: "retail" },
  { label: "Transportation", value: "transportation" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Construction", value: "construction" },
  { label: "Student", value: "student" },
  { label: "Entrepreneur", value: "entrepreneur" },
  { label: "Freelancer", value: "freelancer" },
  { label: "Retired", value: "retired" },
  { label: "Other", value: "other" },
];

const DRINKING_OPTIONS: PickerOption[] = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "Socially", value: "socially" },
  { label: "Regularly", value: "regularly" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const SMOKING_OPTIONS: PickerOption[] = [
  { label: "Never", value: "never" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Socially", value: "socially" },
  { label: "Regularly", value: "regularly" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const ETHNICITY_OPTIONS: PickerOption[] = [
  { label: "Asian", value: "asian" },
  { label: "Black/African American", value: "black" },
  { label: "Hispanic/Latino", value: "hispanic" },
  { label: "White/Caucasian", value: "white" },
  { label: "Middle Eastern", value: "middle-eastern" },
  { label: "Native American", value: "native-american" },
  { label: "Pacific Islander", value: "pacific-islander" },
  { label: "Mixed", value: "mixed" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const LANGUAGE_OPTIONS: PickerOption[] = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Italian", value: "italian" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Chinese (Mandarin)", value: "chinese-mandarin" },
  { label: "Chinese (Cantonese)", value: "chinese-cantonese" },
  { label: "Japanese", value: "japanese" },
  { label: "Korean", value: "korean" },
  { label: "Arabic", value: "arabic" },
  { label: "Hindi", value: "hindi" },
  { label: "Russian", value: "russian" },
  { label: "Dutch", value: "dutch" },
  { label: "Swedish", value: "swedish" },
  { label: "Norwegian", value: "norwegian" },
  { label: "Other", value: "other" },
];

// Custom Modal Picker Component
interface ModalPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: PickerOption[];
  title: string;
  selectedValue: string;
}

const ModalPicker: React.FC<ModalPickerProps> = ({
  visible,
  onClose,
  onSelect,
  options,
  title,
  selectedValue,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleOptionPress = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={styles.modalCloseButton} />
          </View>

          {/* Options */}
          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  selectedValue === option.value && styles.modalOptionSelected,
                ]}
                onPress={() => handleOptionPress(option.value)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedValue === option.value &&
                      styles.modalOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Fraunces: require("../assets/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
    MAK: require("../assets/fonts/MAK-bold.otf"),
  });

  const [profileData, setProfileData] = useState<EditProfileData>({
    name: "Alice",
    age: 23,
    aboutMe: "",
    gender: "woman",
    pronouns: "she/her",
    lookingFor: "men",
    ethnicity: "",
    location: "New York City, USA",
    hometown: "",
    height: "5'6\"",
    drinking: "",
    smoking: "",
    occupation: "",
    education: "",
    placeOfStudy: "",
    lifeGoal: "",
    languages: [],
  });

  // Modal picker state
  const [modalPickerVisible, setModalPickerVisible] = useState(false);
  const [currentPickerField, setCurrentPickerField] = useState<
    keyof EditProfileData | null
  >(null);
  const [currentPickerOptions, setCurrentPickerOptions] = useState<
    PickerOption[]
  >([]);
  const [currentPickerTitle, setCurrentPickerTitle] = useState("");

  if (!fontsLoaded) return null;

  const updateField = (
    field: keyof EditProfileData,
    value: string | number | string[]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const openPicker = (
    field: keyof EditProfileData,
    options: PickerOption[],
    title: string
  ) => {
    setCurrentPickerField(field);
    setCurrentPickerOptions(options);
    setCurrentPickerTitle(title);
    setModalPickerVisible(true);
  };

  const handlePickerSelect = (value: string) => {
    if (currentPickerField) {
      if (currentPickerField === "age") {
        updateField(currentPickerField, parseInt(value, 10));
      } else if (currentPickerField === "languages") {
        updateField(currentPickerField, [value]);
      } else {
        updateField(currentPickerField, value);
      }
    }
  };

  const getDisplayValue = (field: keyof EditProfileData): string => {
    const value = profileData[field];
    if (field === "age") {
      return value ? String(value) : "";
    } else if (field === "languages") {
      return Array.isArray(value) && value.length > 0 ? value[0] : "";
    } else {
      return value ? String(value) : "";
    }
  };

  const getSelectedLabel = (
    field: keyof EditProfileData,
    options: PickerOption[]
  ): string => {
    const value = getDisplayValue(field);
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : `Select ${field}...`;
  };

  const renderTextInput = (
    label: string,
    field: keyof EditProfileData,
    icon: string,
    placeholder?: string,
    multiline: boolean = false,
    keyboardType: any = "default"
  ) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon as any} size={18} color="#333" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        value={String(profileData[field])}
        onChangeText={(text) => updateField(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderPicker = (
    label: string,
    field: keyof EditProfileData,
    icon: string,
    options: PickerOption[]
  ) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon as any} size={18} color="#333" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => openPicker(field, options, `Select ${label}`)}
      >
        <Text
          style={[
            styles.pickerButtonText,
            !getDisplayValue(field) && styles.pickerButtonPlaceholder,
          ]}
        >
          {getSelectedLabel(field, options)}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[
          OnboardingColors.gradient.primary,
          OnboardingColors.gradient.secondary,
          OnboardingColors.gradient.tertiary,
        ]}
        style={styles.gradient}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      >
        <StarField />

        {/* Header */}
        <BlurView
          intensity={40}
          tint="light"
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </BlurView>

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 120 },
            ]}
          >
            {/* Basic Information */}
            {renderSection(
              "Basic Information",
              <>
                {renderTextInput("Name", "name", "person", "Your first name")}
                {renderPicker("Age", "age", "calendar", AGE_OPTIONS)}
                {renderTextInput(
                  "About Me",
                  "aboutMe",
                  "chatbubble-ellipses",
                  "Tell us about yourself...",
                  true
                )}
              </>
            )}

            {/* Identity */}
            {renderSection(
              "Identity",
              <>
                {renderPicker("Gender", "gender", "person", GENDER_OPTIONS)}
                {renderPicker(
                  "Pronouns",
                  "pronouns",
                  "chatbubble",
                  PRONOUNS_OPTIONS
                )}
                {renderPicker(
                  "Looking For",
                  "lookingFor",
                  "heart",
                  LOOKING_FOR_OPTIONS
                )}
                {renderPicker(
                  "Ethnicity",
                  "ethnicity",
                  "people",
                  ETHNICITY_OPTIONS
                )}
              </>
            )}

            {/* Location */}
            {renderSection(
              "Location",
              <>
                {renderTextInput(
                  "Current Location",
                  "location",
                  "location",
                  "City, State/Country"
                )}
                {renderTextInput(
                  "Hometown",
                  "hometown",
                  "home",
                  "Where you grew up"
                )}
              </>
            )}

            {/* Physical */}
            {renderSection(
              "Physical",
              <>{renderPicker("Height", "height", "resize", HEIGHT_OPTIONS)}</>
            )}

            {/* Lifestyle */}
            {renderSection(
              "Lifestyle",
              <>
                {renderPicker("Drinking", "drinking", "wine", DRINKING_OPTIONS)}
                {renderPicker("Smoking", "smoking", "ban", SMOKING_OPTIONS)}
              </>
            )}

            {/* Professional & Education */}
            {renderSection(
              "Professional & Education",
              <>
                {renderPicker(
                  "Occupation",
                  "occupation",
                  "briefcase",
                  OCCUPATION_OPTIONS
                )}
                {renderPicker(
                  "Education Level",
                  "education",
                  "school",
                  EDUCATION_OPTIONS
                )}
                {renderTextInput(
                  "Place of Study",
                  "placeOfStudy",
                  "library",
                  "University of..."
                )}
              </>
            )}

            {/* Personal */}
            {renderSection(
              "Personal",
              <>
                {renderTextInput(
                  "Life Goal",
                  "lifeGoal",
                  "flag",
                  "What drives you in life?"
                )}
                {renderPicker(
                  "Languages",
                  "languages",
                  "language",
                  LANGUAGE_OPTIONS
                )}
              </>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal Picker */}
        <ModalPicker
          visible={modalPickerVisible}
          onClose={() => setModalPickerVisible(false)}
          onSelect={handlePickerSelect}
          options={currentPickerOptions}
          title={currentPickerTitle}
          selectedValue={getDisplayValue(currentPickerField || "name")}
        />
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
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: "Montserrat",
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: "600",
    fontSize: 14,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: "Fraunces",
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    marginLeft: 4,
  },
  fieldContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  textInput: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "#000",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 12,
    minHeight: 40,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  pickerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    padding: 12,
    minHeight: 40,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerButtonText: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "#000",
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: "#999",
  },

  // Modal Picker Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.4,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalCloseButton: {
    minWidth: 60,
  },
  modalCloseText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  modalTitle: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  modalScrollView: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.4 - 100, // Account for header and padding
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionSelected: {
    backgroundColor: "#f8f9ff",
  },
  modalOptionText: {
    fontFamily: "Montserrat",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  modalOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "500",
  },

  // Legacy styles (kept for compatibility)
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  picker: {
    height: 40,
    color: "#000",
  },
  pickerItem: {
    color: "#000",
    fontSize: 15,
  },
  bottomPadding: {
    height: 50,
  },
});
