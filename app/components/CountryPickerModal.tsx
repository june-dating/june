import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingColors } from "../colors/index";

const { width, height } = Dimensions.get("window");

export interface Country {
  name: string;
  code: string;
  callingCode: string;
  flag: string;
}

const countries: Country[] = [
  { name: "United States", code: "US", callingCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", callingCode: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "GB", callingCode: "+44", flag: "🇬🇧" },
  { name: "Australia", code: "AU", callingCode: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "DE", callingCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", callingCode: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "IT", callingCode: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", callingCode: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "NL", callingCode: "+31", flag: "🇳🇱" },
  { name: "Switzerland", code: "CH", callingCode: "+41", flag: "🇨🇭" },
  { name: "Japan", code: "JP", callingCode: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", callingCode: "+82", flag: "🇰🇷" },
  { name: "China", code: "CN", callingCode: "+86", flag: "🇨🇳" },
  { name: "India", code: "IN", callingCode: "+91", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", callingCode: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", callingCode: "+52", flag: "🇲🇽" },
  { name: "Argentina", code: "AR", callingCode: "+54", flag: "🇦🇷" },
  { name: "Chile", code: "CL", callingCode: "+56", flag: "🇨🇱" },
  { name: "Colombia", code: "CO", callingCode: "+57", flag: "🇨🇴" },
  { name: "Peru", code: "PE", callingCode: "+51", flag: "🇵🇪" },
  { name: "South Africa", code: "ZA", callingCode: "+27", flag: "🇿🇦" },
  { name: "Nigeria", code: "NG", callingCode: "+234", flag: "🇳🇬" },
  { name: "Egypt", code: "EG", callingCode: "+20", flag: "🇪🇬" },
  { name: "Israel", code: "IL", callingCode: "+972", flag: "🇮🇱" },
  { name: "Turkey", code: "TR", callingCode: "+90", flag: "🇹🇷" },
  { name: "Russia", code: "RU", callingCode: "+7", flag: "🇷🇺" },
  { name: "Ukraine", code: "UA", callingCode: "+380", flag: "🇺🇦" },
  { name: "Poland", code: "PL", callingCode: "+48", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", callingCode: "+420", flag: "🇨🇿" },
  { name: "Sweden", code: "SE", callingCode: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", callingCode: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", callingCode: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", callingCode: "+358", flag: "🇫🇮" },
  { name: "Belgium", code: "BE", callingCode: "+32", flag: "🇧🇪" },
  { name: "Austria", code: "AT", callingCode: "+43", flag: "🇦🇹" },
  { name: "Portugal", code: "PT", callingCode: "+351", flag: "🇵🇹" },
  { name: "Ireland", code: "IE", callingCode: "+353", flag: "🇮🇪" },
  { name: "Greece", code: "GR", callingCode: "+30", flag: "🇬🇷" },
  { name: "New Zealand", code: "NZ", callingCode: "+64", flag: "🇳🇿" },
  { name: "Singapore", code: "SG", callingCode: "+65", flag: "🇸🇬" },
  { name: "Malaysia", code: "MY", callingCode: "+60", flag: "🇲🇾" },
  { name: "Thailand", code: "TH", callingCode: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", callingCode: "+84", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", callingCode: "+63", flag: "🇵🇭" },
  { name: "Indonesia", code: "ID", callingCode: "+62", flag: "🇮🇩" },
  { name: "Pakistan", code: "PK", callingCode: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", callingCode: "+880", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "LK", callingCode: "+94", flag: "🇱🇰" },
  { name: "UAE", code: "AE", callingCode: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", callingCode: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "QA", callingCode: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "KW", callingCode: "+965", flag: "🇰🇼" },
].sort((a, b) => a.name.localeCompare(b.name));

interface CountryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCountry: (country: Country) => void;
  selectedCountry?: Country;
}

export const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  visible,
  onClose,
  onSelectCountry,
  selectedCountry,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.callingCode.includes(searchQuery)
  );

  const handleSelectCountry = (country: Country) => {
    onSelectCountry(country);
    onClose();
    setSearchQuery("");
  };

  const renderCountryItem = ({ item }: { item: Country }) => {
    const isSelected = selectedCountry?.code === item.code;

    return (
      <TouchableOpacity
        style={[styles.countryItem, isSelected && styles.countryItemSelected]}
        onPress={() => handleSelectCountry(item)}
        activeOpacity={0.7}
      >
        <View style={styles.countryInfo}>
          <Text style={styles.flag}>{item.flag}</Text>
          <View style={styles.countryDetails}>
            <Text
              style={[
                styles.countryName,
                isSelected && styles.countryNameSelected,
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.callingCode,
                isSelected && styles.callingCodeSelected,
              ]}
            >
              {item.callingCode}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={OnboardingColors.icon.checkmark}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={24}
              color={OnboardingColors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Select Country</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons
              name="search"
              size={20}
              color={OnboardingColors.icon.tertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search countries or codes..."
              placeholderTextColor={OnboardingColors.text.tertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={OnboardingColors.icon.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Countries List */}
        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
          keyExtractor={(item) => item.code}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: OnboardingColors.text.primary,
    fontFamily: "Fraunces",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
  },
  countryItemSelected: {
    backgroundColor: "#F0F8FF",
    borderWidth: 2,
    borderColor: OnboardingColors.border.inputSelected,
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "500",
    color: OnboardingColors.text.primary,
    fontFamily: "Montserrat",
    marginBottom: 2,
  },
  countryNameSelected: {
    color: OnboardingColors.text.primary,
    fontWeight: "600",
  },
  callingCode: {
    fontSize: 14,
    color: OnboardingColors.text.secondary,
    fontFamily: "Montserrat",
  },
  callingCodeSelected: {
    color: OnboardingColors.text.primary,
    fontWeight: "500",
  },
});

// Default export for Expo Router compatibility
export default CountryPickerModal;
