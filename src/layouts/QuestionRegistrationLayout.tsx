import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { RegistrationHeader } from "@/pages/question-setting/components";

interface QuestionRegistrationLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
  heightClass?: string;
}

const QuestionRegistrationLayout = ({
  children,
  backgroundColor = "bg-gray-50",
  heightClass = "h-screen",
}: QuestionRegistrationLayoutProps) => {
  const location = useLocation();

  // Xác định current step dựa trên pathname
  const getCurrentStep = () => {
    if (location.pathname.includes("/settings")) {
      return 0; // Setting general information
    }
    if (location.pathname.includes("/editor")) {
      return 1; // Editor
    }
    return 0;
  };

  const steps = ["Setting general information", "Editor"];
  const currentStep = getCurrentStep();

  return (
    <div className={`${heightClass} flex flex-col px-4 ${backgroundColor}`}>
      <div className="flex-shrink-0">
        <RegistrationHeader currentStep={currentStep} steps={steps} />
      </div>
      <div className={`flex flex-1 ${backgroundColor} min-h-0 overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

export default QuestionRegistrationLayout;
