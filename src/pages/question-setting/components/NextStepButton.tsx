import { RiArrowRightSLine } from 'react-icons/ri';

interface NextStepButtonProps {
  onNextStep: () => void;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({ onNextStep }) => {
  return (
    <div>
      <button
        onClick={onNextStep}
        className="w-full bg-primary text-white h-12 px-6 rounded-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <span> Next step</span>

        <RiArrowRightSLine size={18} />
      </button>
    </div>
  );
};

export default NextStepButton;
