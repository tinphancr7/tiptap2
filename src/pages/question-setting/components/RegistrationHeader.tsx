import { IoClose } from "react-icons/io5";

interface RegistrationHeaderProps {
  currentStep: number;
  steps: string[];
}

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="py-4 flex items-center justify-between font-inter rounded-md ">
      <h1 className="text-xl font-semibold text-gray-800">Register Question</h1>

      <div className="flex items-center space-x-6 md:space-x-8">
        <div className="flex items-center space-x-2">
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold shadow-sm ${
              currentStep === 0
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <span
            className={`font-medium text-sm whitespace-nowrap ${
              currentStep === 0 ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {steps[0]}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold shadow-sm ${
              currentStep === 1
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <span
            className={`font-medium text-sm whitespace-nowrap ${
              currentStep === 1 ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {steps[1]}
          </span>
        </div>

        <button className="flex items-center gap-1 px-4 py-2.5 bg-white text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 shadow-sm">
          <IoClose size={20} />
          Close
        </button>
      </div>
    </div>
  );
};

export default RegistrationHeader;
