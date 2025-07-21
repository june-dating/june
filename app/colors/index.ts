// Onboarding Colors - Comprehensive color palette for all onboarding screens
// This file contains all colors used across name.tsx, birthday.tsx, gender.tsx, 
// looking-for.tsx, phone.tsx, and socials.tsx

export const OnboardingColors = {
  // ===== GRADIENT COLORS =====
  // Main background gradient colors (used in all screens)
  gradient: {
    primary: "#000000",    // Black - gradient start
    secondary: "#1a0a1a",  // Deep purple - gradient middle
    tertiary: "#2d0a2d",   // Dark purple - gradient end
  },

  // ===== TEXT COLORS =====
  text: {
    primary: "#FFF",                           // White text (titles, selected states)
    secondary: "rgba(255, 255, 255, 0.8)",   // Semi-transparent white (subtitles)
    tertiary: "rgba(255, 255, 255, 0.6)",    // More transparent white (placeholders, inactive)
    quaternary: "rgba(255, 255, 255, 0.5)",  // Very transparent white (disabled states)
    button: "#fff",                        // White text on buttons (matches index screen)
    buttonDisabled: "rgba(255,255,255,0.5)", // Disabled button text (semi-transparent white)
    editButton: "#FFF",                        // Edit button text (phone screen)
    changeLater: "rgba(255, 255, 255, 0.6)", // "Change later" text
    progress: "rgba(255, 255, 255, 0.8)",    // Progress text
    countryCode: "#FFF",                       // Country code text (+1)
    platformInput: "rgba(255, 255, 255, 0.6)", // Platform input text (unselected)
    platformInputSelected: "#FFF",             // Platform input text (selected)
    pickerTitle: "#FFF",                       // Date picker title
    headerButton: "#FFF",                      // Date picker header buttons
  },

  // ===== BACKGROUND COLORS =====
  background: {
    // Input/Container backgrounds
    input: "rgba(255, 255, 255, 0.15)",      // Main input background
    inputActive: "rgba(255, 255, 255, 0.2)", // Active input background
    inputSelected: "rgba(255, 255, 255, 0.3)", // Selected option background
    
    // Button backgrounds
    buttonEnabled: [
      "rgba(255,255,255,0.25)",
      "rgba(255,255,255,0.1)",
      "rgba(255,255,255,0.05)"
    ],       // Enabled button gradient (matches index screen)
    buttonDisabled: [
      "rgba(255,255,255,0.18)",
      "rgba(255,255,255,0.10)"
    ], // Slightly less visible for disabled
    
    // Platform-specific backgrounds
    platformCard: "rgba(255, 255, 255, 0.10)", // Match index screen button bg
    platformCardSelected: "rgba(255, 255, 255, 0.18)",
    platformIconContainer: "rgba(255, 255, 255, 0.1)", // Platform icon container
    platformIconContainerTyping: "rgba(255, 255, 255, 0.15)", // Typing state
    
    // Date picker backgrounds
    glassGradient: [
      "rgba(255, 255, 255, 0.08)",
      "rgba(255, 255, 255, 0.12)", 
      "rgba(255, 255, 255, 0.08)"
    ],
    innerGlow: "rgba(255, 255, 255, 0.05)",  // Inner glow effect
    headerButton: "rgba(255, 255, 255, 0.1)", // Date picker header button
    
    // Progress bar
    progressBackground: "rgba(255, 255, 255, 0.3)", // Progress bar background
    progressFill: "#FFF",                       // Progress bar fill
  },

  // ===== BORDER COLORS =====
  border: {
    input: "rgba(255, 255, 255, 0.2)",       // Default input border
    inputActive: "rgba(255, 255, 255, 0.5)", // Active input border
    inputSelected: "#FFF",                     // Selected option border
    platformCardSelected: "rgba(255, 255, 255, 0.8)", // Selected platform card border
    glassBorder: "rgba(255, 255, 255, 0.2)", // Glass effect border
    countryCode: "rgba(255, 255, 255, 0.3)", // Country code separator
    pickerHeader: "rgba(255, 255, 255, 0.1)", // Date picker header border
  },

  // ===== SHADOW COLORS =====
  shadow: {
    primary: "#8a4bb8",                       // Main shadow color (purple)
    offset: { width: 0, height: 8 },          // Shadow offset
    opacity: {
      light: 0.3,                             // Light shadow opacity
      medium: 0.4,                            // Medium shadow opacity
    },
    radius: {
      small: 12,                              // Small shadow radius
      medium: 16,                             // Medium shadow radius
    },
    elevation: {
      light: 8,                               // Light elevation (Android)
      medium: 12,                             // Medium elevation (Android)
    },
  },

  // ===== ICON COLORS =====
  icon: {
    primary: "#FFF",                          // Primary icon color (selected states)
    secondary: "rgba(255, 255, 255, 0.7)",   // Secondary icon color (unselected states)
    tertiary: "rgba(255, 255, 255, 0.8)",    // Tertiary icon color (calendar, key)
    checkmark: "#FFF",                        // Checkmark icon color
    button: "#8a4bb8",                        // Button icon color (enabled)
    buttonDisabled: "rgba(255,255,255,0.5)", // Button icon color (disabled)
  },

  // ===== SOCIAL PLATFORM COLORS =====
  social: {
    instagram: "#E4405F",                     // Instagram brand color
    twitter: "#1DA1F2",                       // Twitter/X brand color
    linkedin: "#0077B5",                      // LinkedIn brand color
  },

  // ===== OPACITY VALUES =====
  opacity: {
    buttonDisabled: 0.6,                      // Disabled button opacity
    inputDisabled: 0.6,                       // Disabled input opacity
  },

  // ===== STATUS BAR =====
  statusBar: "light-content",                 // Status bar style
} as const;

// Type definitions for better TypeScript support
export type OnboardingColorScheme = typeof OnboardingColors;
export type GradientColors = typeof OnboardingColors.gradient;
export type TextColors = typeof OnboardingColors.text;
export type BackgroundColors = typeof OnboardingColors.background;
export type BorderColors = typeof OnboardingColors.border;
export type ShadowColors = typeof OnboardingColors.shadow;
export type IconColors = typeof OnboardingColors.icon;
export type SocialColors = typeof OnboardingColors.social;

// Helper functions for common color combinations
export const getGradientColors = () => OnboardingColors.gradient;
export const getTextColor = (variant: keyof TextColors) => OnboardingColors.text[variant];
export const getBackgroundColor = (variant: keyof BackgroundColors) => OnboardingColors.background[variant];
export const getBorderColor = (variant: keyof BorderColors) => OnboardingColors.border[variant];
export const getIconColor = (variant: keyof IconColors) => OnboardingColors.icon[variant];
export const getSocialColor = (platform: keyof SocialColors) => OnboardingColors.social[platform];

// Common color combinations used across screens
export const CommonColorCombinations = {
  // Input styling
  input: {
    backgroundColor: OnboardingColors.background.input,
    borderColor: OnboardingColors.border.input,
    textColor: OnboardingColors.text.primary,
    placeholderColor: OnboardingColors.text.tertiary,
  },
  
  // Selected input styling
  inputSelected: {
    backgroundColor: OnboardingColors.background.inputSelected,
    borderColor: OnboardingColors.border.inputSelected,
    textColor: OnboardingColors.text.primary,
  },
  
  // Button styling
  buttonEnabled: {
    gradient: OnboardingColors.background.buttonEnabled,
    textColor: OnboardingColors.text.button,
    iconColor: OnboardingColors.icon.button,
  },
  
  // Disabled button styling
  buttonDisabled: {
    gradient: OnboardingColors.background.buttonDisabled,
    textColor: OnboardingColors.text.buttonDisabled,
    iconColor: OnboardingColors.icon.buttonDisabled,
    opacity: OnboardingColors.opacity.buttonDisabled,
  },
  
  // Shadow styling
  shadow: {
    color: OnboardingColors.shadow.primary,
    offset: OnboardingColors.shadow.offset,
    opacity: OnboardingColors.shadow.opacity.medium,
    radius: OnboardingColors.shadow.radius.medium,
    elevation: OnboardingColors.shadow.elevation.medium,
  },
} as const;

// Default export to satisfy React component requirement
export default OnboardingColors; 