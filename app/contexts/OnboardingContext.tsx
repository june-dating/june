import React, { createContext, ReactNode, useContext, useState } from "react";

export interface OnboardingData {
  full_name: string;
  birth_date: string; // ISO date string for database compatibility
  gender: "male" | "female" | "everyone";
  looking_for: "male" | "female" | "everyone";
  instagram_username: string;
  twitter_username?: string;
  linkedin_username?: string;
  phone_number: string;
  phone_verified: boolean;
  sms_verification_code: string;
  access_code: string;
}

interface OnboardingContextType {
  onboardingData: Partial<OnboardingData>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  clearOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(
    {
      phone_verified: false,
    }
  );

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const clearOnboardingData = () => {
    setOnboardingData({ phone_verified: false });
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        clearOnboardingData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

// Default export for Expo Router compatibility
export default OnboardingProvider;
