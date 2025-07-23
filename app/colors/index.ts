// Onboarding Colors - Comprehensive color palette for all onboarding screens
// This file contains all colors used across name.tsx, birthday.tsx, gender.tsx, 
// looking-for.tsx, phone.tsx, and socials.tsx

export const OnboardingColors = {
  // ===== GRADIENT COLORS =====
  // Main background gradient colors (used in all screens)
  gradient: {
    primary: "#eee2d2",    // Cream - gradient start (matches index screen)
    secondary: "#eee2d2",  // Cream - gradient middle
    tertiary: "#eee2d2",   // Cream - gradient end
  },

  // ===== TEXT COLORS =====
  text: {
    primary: "#000000",                        // Black text (titles, selected states)
    secondary: "rgba(0, 0, 0, 0.8)",         // Semi-transparent black (subtitles)
    tertiary: "rgba(0, 0, 0, 0.6)",          // More transparent black (placeholders, inactive)
    quaternary: "rgba(0, 0, 0, 0.5)",        // Very transparent black (disabled states)
    button: "#eee2d2",                        // Cream text on buttons (matches index screen)
    buttonDisabled: "rgba(0,0,0,0.5)",       // Disabled button text (semi-transparent black)
    editButton: "#000000",                    // Edit button text (phone screen)
    changeLater: "rgba(0, 0, 0, 0.6)",       // "Change later" text
    progress: "rgba(0, 0, 0, 0.8)",          // Progress text
    countryCode: "#000000",                   // Country code text (+1)
    platformInput: "rgba(0, 0, 0, 0.6)",     // Platform input text (unselected)
    platformInputSelected: "#000000",         // Platform input text (selected)
    pickerTitle: "#000000",                   // Date picker title
    headerButton: "#000000",                  // Date picker header buttons
  },

  // ===== BACKGROUND COLORS =====
  background: {
    // Input/Container backgrounds
    input: "rgba(255, 255, 255, 0.9)",       // White input background
    inputActive: "rgba(255, 255, 255, 1.0)",  // Pure white active input background
    inputSelected: "rgba(0, 0, 0, 0.05)",     // Very light gray selected option background
    
    // Button backgrounds
    buttonEnabled: [
      "rgba(0, 0, 0, 1)", // Top
      "rgba(0, 0, 0, 0.95)", // Upper middle
      "rgba(0, 0, 0, 0.9)", // Center
      "rgba(0, 0, 0, 0.85)", // Lower middle
      "rgba(0, 0, 0, 0.8)", // Bottom
    ],       // Black button gradient (matches index screen)
    buttonDisabled: [
      "rgba(0, 0, 0, 0.6)",
      "rgba(0, 0, 0, 0.4)"
    ], // Disabled black buttons
    
    // Platform-specific backgrounds
    platformCard: "rgba(255, 255, 255, 0.9)", // White platform card background
    platformCardSelected: "rgba(0, 0, 0, 0.05)", // Very light gray selected platform card
    platformIconContainer: "rgba(255, 255, 255, 0.9)", // Platform icon container
    platformIconContainerTyping: "rgba(255, 255, 255, 1.0)", // Typing state
    
    // Date picker backgrounds
    glassGradient: [
      "rgba(255, 255, 255, 0.9)",
      "rgba(255, 255, 255, 0.95)", 
      "rgba(255, 255, 255, 0.9)"
    ],
    innerGlow: "rgba(255, 255, 255, 0.8)",  // Inner glow effect
    headerButton: "rgba(255, 255, 255, 0.9)", // Date picker header button
    
    // Progress bar
    progressBackground: "rgba(0, 0, 0, 0.2)", // Black progress bar background
    progressFill: "#000000",                  // Black progress bar fill
  },

  // ===== BORDER COLORS =====
  border: {
    input: "rgba(0, 0, 0, 0.2)",             // Black input border
    inputActive: "rgba(0, 0, 0, 0.5)",       // Active black input border
    inputSelected: "rgba(0, 0, 0, 0.3)",     // Lighter selected option border
    platformCardSelected: "rgba(0, 0, 0, 0.3)", // Lighter selected platform card border
    glassBorder: "rgba(0, 0, 0, 0.2)",       // Glass effect border
    countryCode: "rgba(0, 0, 0, 0.3)",       // Country code separator
    pickerHeader: "rgba(0, 0, 0, 0.1)",      // Date picker header border
  },

  // ===== SHADOW COLORS =====
  shadow: {
    primary: "rgba(0, 0, 0, 0.25)",           // Main shadow color (neutral black)
    offset: { width: 0, height: 4 },          // Shadow offset (reduced for cleaner look)
    opacity: {
      light: 0.1,                             // Light shadow opacity (more subtle)
      medium: 0.15,                           // Medium shadow opacity (more subtle)
    },
    radius: {
      small: 8,                               // Small shadow radius (reduced)
      medium: 12,                             // Medium shadow radius (reduced)
    },
    elevation: {
      light: 4,                               // Light elevation (Android, reduced)
      medium: 6,                              // Medium elevation (Android, reduced)
    },
  },

  // ===== ICON COLORS =====
  icon: {
    primary: "#fff",                       // Black primary icon color (selected states)
    secondary: "rgba(0, 0, 0, 0.24)",         // Secondary black icon color (unselected states)
    tertiary: "rgba(0, 0, 0, 0.8)",          // Tertiary black icon color (calendar, key)
    checkmark: "#000000",                     // Black checkmark icon color
    button: "#eee2d2",                        // Cream button icon color (enabled, matches index)
    buttonDisabled: "rgba(0,0,0,0.5)",       // Button icon color (disabled)
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
  statusBar: "dark-content",                  // Dark status bar style for light background
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