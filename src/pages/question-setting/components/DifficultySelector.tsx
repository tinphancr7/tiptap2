interface DifficultySelectorProps {
  selectedDifficulty: number[];
  onDifficultyChange: (difficulty: number) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Difficulty</h3>
      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onDifficultyChange(num)}
            className={`w-full h-11 rounded-md text-sm font-medium transition-colors ${
              selectedDifficulty.includes(num)
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
