import DifficultySelector from './DifficultySelector';
import TargetGroupSelector from './TargetGroupSelector';
import PriceInput from './PriceInput';
import NextStepButton from './NextStepButton';

interface RightPanelProps {
  selectedDifficulty: number[];
  onDifficultyChange: (difficulty: number) => void;
  targetGroups: string[];
  selectedTargetGroups: string[];
  onTargetGroupChange: (group: string) => void;
  price: string;
  onPriceChange: (price: string) => void;
  onNextStep: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  targetGroups,
  selectedTargetGroups,
  onTargetGroupChange,
  price,
  onPriceChange,
  onNextStep,
}) => {
  return (
    <div className="w-1/2 bg-white flex flex-col h-full ">
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-5">
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={onDifficultyChange}
          />

          <TargetGroupSelector
            targetGroups={targetGroups}
            selectedTargetGroups={selectedTargetGroups}
            onTargetGroupChange={onTargetGroupChange}
          />

          <PriceInput price={price} onPriceChange={onPriceChange} />
        </div>

        <div className="">
          <NextStepButton onNextStep={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
