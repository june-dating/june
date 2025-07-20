# Updated File Structure

## Navigation Organization

The app now has two separate navigation stacks:

### 1. Main App Stack (`app/_layout.tsx`)
- `index.tsx` - Landing page
- `juneconvo.tsx` - June conversation screen (renamed from onboarding.tsx)
- `signup.tsx` - Signup screen
- `photo-upload.tsx` - Photo upload screen
- `profile-screen.tsx` - Profile screen
- `dashboard.tsx` - Dashboard
- `chat-screen.tsx` - Chat screen
- `gpt.tsx` - GPT screen

### 2. Onboarding Stack (`app/onboarding/_layout.tsx`)
- `name.tsx` - Name input
- `birthday.tsx` - Birthday input
- `gender.tsx` - Gender selection
- `looking-for.tsx` - Looking for selection
- `instagram.tsx` - Instagram handle
- `email.tsx` - Email input
- `verification.tsx` - Verification code

## File Organization

```
app/
├── _layout.tsx                    # Main app navigation
├── index.tsx                      # Landing page
├── juneconvo.tsx                  # June conversation (renamed)
├── signup.tsx                     # Signup screen
├── photo-upload.tsx               # Photo upload
├── profile-screen.tsx             # Profile screen
├── dashboard.tsx                  # Dashboard
├── chat-screen.tsx                # Chat screen
├── gpt.tsx                        # GPT screen
├── +not-found.tsx                 # 404 page
├── components/                    # Shared components
│   ├── ProgressBar.tsx
│   ├── LoadingShimmer.tsx
│   ├── ConvAI.tsx
│   └── VoiceAvatar.tsx
└── onboarding/                    # Onboarding flow
    ├── _layout.tsx               # Onboarding navigation
    ├── name.tsx                  # Step 1: Name
    ├── birthday.tsx              # Step 2: Birthday
    ├── gender.tsx                # Step 3: Gender
    ├── looking-for.tsx           # Step 4: Looking for
    ├── instagram.tsx             # Step 5: Instagram
    ├── email.tsx                 # Step 6: Email
    └── verification.tsx          # Step 7: Verification
```

## Navigation Flow

1. **Landing** (`/`) → **Onboarding** (`/onboarding/name`)
2. **Onboarding Flow**: name → birthday → gender → looking-for → instagram → email → verification
3. **Verification** → **Dashboard** (`/dashboard`)

## Key Changes

1. **Separated Navigation**: Main app and onboarding have different navigation stacks
2. **Organized Files**: All onboarding screens are in the `onboarding/` folder
3. **Renamed File**: `onboarding.tsx` → `juneconvo.tsx`
4. **Fixed Routes**: All onboarding routes now use `/onboarding/` prefix
5. **Clean Structure**: Clear separation between app screens and onboarding flow

## Benefits

- **Better Organization**: Related screens are grouped together
- **Easier Maintenance**: Onboarding logic is isolated
- **Cleaner Navigation**: Separate stacks for different app sections
- **Scalable**: Easy to add new screens to either stack
- **Type Safety**: Proper TypeScript support throughout 