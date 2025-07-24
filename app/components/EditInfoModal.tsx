import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardTypeOptions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EditProfileData, PickerOption } from "../../types/ProfileTypes";

const { width, height } = Dimensions.get("window");

const HEIGHT_OPTIONS: PickerOption[] = [
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

const LIFESTYLE_OPTIONS: PickerOption[] = [
  { label: "Active", value: "active" },
  { label: "Balanced", value: "balanced" },
  { label: "Relaxed", value: "relaxed" },
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

const RELIGION_OPTIONS: PickerOption[] = [
  { label: "Hindu", value: "hindu" },
  { label: "Muslim", value: "muslim" },
  { label: "Christian", value: "christian" },
  { label: "Sikh", value: "sikh" },
  { label: "Buddhist", value: "buddhist" },
  { label: "Jain", value: "jain" },
  { label: "Jewish", value: "jewish" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

// Extend EditProfileData for local modal use
export interface EditInfoModalForm extends EditProfileData {
  religion?: string;
  lifestyle?: string;
}

interface EditInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Partial<EditInfoModalForm>) => void;
  initialData?: Partial<EditInfoModalForm>;
}

export default function EditInfoModal({
  visible,
  onClose,
  onSave,
  initialData = {},
}: EditInfoModalProps) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<Partial<EditInfoModalForm>>(initialData);

  const updateField = (
    field: keyof EditInfoModalForm,
    value: string | number | string[]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView
          intensity={120}
          style={StyleSheet.absoluteFill}
          tint="light"
        />
        <Animated.View
          style={[
            styles.modalContainer,
            { marginTop: insets.top + height * 0.04 },
          ]}
          entering={FadeInDown.duration(350)}
        >
          <LinearGradient
            colors={["#fff7efcc", "#f7e9d7cc", "#fff7efb0"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Drag indicator */}
            <View style={styles.dragIndicatorWrap}>
              <View style={styles.dragIndicator} />
            </View>
            <Text style={styles.title}>Tell us more about you</Text>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Name */}
              <Field
                label="Name"
                value={form.name || ""}
                onChangeText={(v: string) => updateField("name", v)}
                placeholder="Your name"
              />
              {/* Age */}
              <Field
                label="Age"
                value={form.age ? String(form.age) : ""}
                onChangeText={(v: string) => updateField("age", Number(v))}
                placeholder="Your age"
                keyboardType="numeric"
              />
              {/* Height */}
              <PickerField
                label="Height"
                value={form.height || ""}
                onValueChange={(v: string) => updateField("height", v)}
                options={HEIGHT_OPTIONS}
              />
              {/* Religion */}
              <PickerField
                label="Religion"
                value={form.religion || ""}
                onValueChange={(v: string) => updateField("religion", v)}
                options={RELIGION_OPTIONS}
              />
              {/* Location */}
              <Field
                label="Location"
                value={form.location || ""}
                onChangeText={(v: string) => updateField("location", v)}
                placeholder="City, Country"
              />
              {/* Home */}
              <Field
                label="Home"
                value={form.hometown || ""}
                onChangeText={(v: string) => updateField("hometown", v)}
                placeholder="Where is your home?"
              />
              {/* Education */}
              <PickerField
                label="Education"
                value={form.education || ""}
                onValueChange={(v: string) => updateField("education", v)}
                options={EDUCATION_OPTIONS}
              />
              {/* Lifestyle */}
              <PickerField
                label="Lifestyle"
                value={form.lifestyle || ""}
                onValueChange={(v: string) => updateField("lifestyle", v)}
                options={LIFESTYLE_OPTIONS}
              />
              {/* Occupation */}
              <PickerField
                label="Occupation"
                value={form.occupation || ""}
                onValueChange={(v: string) => updateField("occupation", v)}
                options={OCCUPATION_OPTIONS}
              />
              {/* Life Goal */}
              <Field
                label="Life Goal"
                value={form.lifeGoal || ""}
                onChangeText={(v: string) => updateField("lifeGoal", v)}
                placeholder="What drives you?"
              />
              {/* Language Spoken */}
              <PickerField
                label="Language Spoken"
                value={form.languages?.[0] || ""}
                onValueChange={(v: string) => updateField("languages", [v])}
                options={LANGUAGE_OPTIONS}
              />
            </ScrollView>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType || "default"}
      />
    </View>
  );
}

function PickerField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: PickerOption[];
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options.map((opt: PickerOption) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.pickerOption,
                value === opt.value && styles.pickerOptionSelected,
              ]}
              onPress={() => onValueChange(opt.value)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  value === opt.value && styles.pickerOptionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.96,
    height: height * 0.92,
    maxHeight: height * 0.96,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 30,
    borderWidth: 1.5,
    borderColor: "#eee2d2",
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  gradient: {
    flex: 1,
    padding: 32,
    borderRadius: 32,
  },
  dragIndicatorWrap: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 2,
  },
  dragIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e0d3c2",
    opacity: 0.7,
  },
  title: {
    fontFamily: "Fraunces",
    fontSize: 28,
    fontWeight: "800",
    color: "#2D1E0F",
    textAlign: "center",
    marginBottom: 22,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
    minHeight: 200,
    maxHeight: height * 0.65,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontFamily: "Montserrat",
    fontSize: 15,
    fontWeight: "700",
    color: "#7B6F63",
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  textInput: {
    fontFamily: "Montserrat",
    fontSize: 16,
    color: "#2D1E0F",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.2,
    borderColor: "#eee2d2",
  },
  pickerWrapper: {
    flexDirection: "row",
    marginTop: 2,
  },
  pickerOption: {
    backgroundColor: "#f7e9d7",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 12,
    borderWidth: 1.2,
    borderColor: "#eee2d2",
  },
  pickerOptionSelected: {
    backgroundColor: "#FFA72622",
    borderColor: "#FFA726",
  },
  pickerOptionText: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: "#7B6F63",
  },
  pickerOptionTextSelected: {
    color: "#FFA726",
    fontWeight: "800",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#eee2d2",
    borderRadius: 22,
    paddingVertical: 14,
    marginRight: 12,
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#FFA726",
    borderRadius: 22,
    paddingVertical: 14,
    marginLeft: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#7B6F63",
    fontFamily: "Montserrat",
    fontWeight: "700",
    fontSize: 16,
  },
  saveText: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: "800",
    fontSize: 16,
  },
});
