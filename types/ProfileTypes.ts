// Types for Profile Screen Components

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  personality: string;
  facePhotos: Array<{ id: string; uri: any }>;
}

export interface InsightCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  iconLibrary: "Ionicons" | "MaterialCommunityIcons";
  route: string;
  isFullWidth?: boolean;
}

export interface FacePhoto {
  id: string;
  uri: any;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface InsightCardProps {
  title: string;
  icon: any;
  color?: string;
  onPress: () => void;
  isFullWidth?: boolean;
  iconLibrary?: "Ionicons" | "MaterialCommunityIcons";
}

// Edit Profile Types
export interface EditProfileData {
  // Basic Info
  name: string;
  age: number;
  aboutMe: string;
  
  // Demographics
  gender: string;
  lookingFor: string;
  ethnicity: string;
  
  // Location
  location: string;
  hometown: string;
  
  // Physical
  height: string;
  
  // Lifestyle
  drinking: string;
  smoking: string;
  
  // Professional/Education
  occupation: string;
  education: string;
  placeOfStudy: string;
  
  // Personal
  lifeGoal: string;
  languages: string[];
}

export interface PickerOption {
  label: string;
  value: string;
}

export interface EditProfileFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

export interface EditProfilePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  icon: string;
} 