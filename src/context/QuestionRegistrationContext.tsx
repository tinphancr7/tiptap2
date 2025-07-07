import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface QuestionRegistrationData {
  // Category selection
  selectedCategory: string;

  // Difficulty
  selectedDifficulty: number[];

  // Target groups
  selectedTargetGroups: string[];

  // Price
  price: string;
}

interface QuestionRegistrationContextType {
  data: QuestionRegistrationData;
  updateData: (updates: Partial<QuestionRegistrationData>) => void;
  resetData: () => void;
}

const initialData: QuestionRegistrationData = {
  selectedCategory: "",
  selectedDifficulty: [],
  selectedTargetGroups: ["초1 ~ 초6", "유치원"],
  price: "",
};

const QuestionRegistrationContext = createContext<
  QuestionRegistrationContextType | undefined
>(undefined);

export { QuestionRegistrationContext };

interface QuestionRegistrationProviderProps {
  children: ReactNode;
}

export const QuestionRegistrationProvider: React.FC<
  QuestionRegistrationProviderProps
> = ({ children }) => {
  const [data, setData] = useState<QuestionRegistrationData>(initialData);

  const updateData = (updates: Partial<QuestionRegistrationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <QuestionRegistrationContext.Provider
      value={{ data, updateData, resetData }}
    >
      {children}
    </QuestionRegistrationContext.Provider>
  );
};
