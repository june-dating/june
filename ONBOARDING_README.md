# Multi-Screen Onboarding Flow

A sleek, animated onboarding experience built with React Native Expo and React Navigation.

## Features

### 🎨 Modern UI Design
- Large input fields with minimal labels
- Clean typography and generous white space
- Soft pastel backgrounds (different per screen)
- Big, bold buttons with smooth animations

### ✨ Smooth Animations
- **Progress Bar**: Animated linear progress bar that grows with each step
- **Micro-interactions**: Button press animations and check icons for valid inputs
- **Screen Transitions**: Buttery smooth horizontal slide animations
- **Loading Shimmer**: 1-second fake loading after each "Next" button

### 📱 7-Step Flow
1. **Name Input** - Full name collection with validation
2. **Birthday Input** - MM/DD/YYYY format with auto-formatting
3. **Gender Selection** - Male/Female/Other + custom text input
4. **Looking For** - Same options as gender with custom input
5. **Instagram Handle** - Username with @ prefix
6. **Email Input** - Email validation with verification
7. **Verification Code** - 6-digit code input

### 🛠 Technical Stack
- **React Native Expo** - Cross-platform development
- **React Navigation** - Stack navigation with custom transitions
- **React Native Reanimated** - Smooth animations and micro-interactions
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **TypeScript** - Type safety throughout

## File Structure

```
app/
├── components/
│   ├── ProgressBar.tsx      # Animated progress bar component
│   └── LoadingShimmer.tsx   # Loading animation component
├── onboarding/
│   └── name.tsx            # First onboarding screen
├── birthday.tsx            # Birthday input screen
├── gender.tsx              # Gender selection screen
├── looking-for.tsx         # Looking for screen
├── instagram.tsx           # Instagram handle screen
├── email.tsx               # Email input screen
├── verification.tsx        # Verification code screen
├── _layout.tsx            # Navigation layout
└── index.tsx              # Entry point
```

## Key Features

### Progress Animation
- Each screen shows current progress (1 of 7, 2 of 7, etc.)
- Animated progress bar grows from 14% → 28% → 42% → 56% → 70% → 84% → 100%
- Smooth transitions between steps

### Input Validation
- Real-time validation with visual feedback
- Check icons appear when inputs are valid
- Buttons are disabled until validation passes

### Micro-interactions
- Button scale animations on press
- Input fade-in animations on mount
- Check icon spring animations
- Loading shimmer effects

### Color Themes
Each screen has a unique pastel gradient:
- Name: Pink (#FF6B9D)
- Birthday: Teal (#4ECDC4)
- Gender: Green (#A8E6CF)
- Looking For: Orange (#FFB347)
- Instagram: Pink (#E91E63)
- Email: Purple (#9C27B0)
- Verification: Blue (#2196F3)

## Getting Started

1. Navigate to the app directory
2. Run `expo start`
3. Press "GET STARTED" to begin the onboarding flow
4. Follow the 7-step process with smooth animations

## Customization

### Adding New Screens
1. Create a new screen file in the `app/` directory
2. Add the screen to `_layout.tsx` Stack.Screen
3. Update progress percentages and step numbers
4. Choose a new gradient color theme

### Modifying Animations
- Adjust timing in `withTiming()` calls
- Modify spring configurations in `withSpring()`
- Update progress bar animation duration

### Styling Changes
- Modify gradient colors in each screen
- Adjust input field styling in shared components
- Update button designs and shadows

The onboarding flow provides a premium user experience with smooth animations, modern design, and intuitive navigation. 