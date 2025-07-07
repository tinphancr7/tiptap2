import { IoMdCheckmark } from 'react-icons/io';

interface TargetGroupSelectorProps {
  targetGroups: string[];
  selectedTargetGroups: string[];
  onTargetGroupChange: (group: string) => void;
}

const TargetGroupSelector: React.FC<TargetGroupSelectorProps> = ({
  targetGroups,
  selectedTargetGroups,
  onTargetGroupChange,
}) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Target Group</h3>
      <div className="grid grid-cols-5 gap-3">
        {targetGroups.map((group) => (
          <button
            key={group}
            onClick={() => onTargetGroupChange(group)}
            className={`relative px-3 py-3 rounded-md text-xs font-medium transition-colors border overflow-hidden ${
              selectedTargetGroups.includes(group)
                ? 'border border-primary bg-[#FFFBE6] text-primary'
                : 'border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
            }`}
          >
            {group}
            {selectedTargetGroups.includes(group) && (
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-primary">
                <IoMdCheckmark
                  size={12}
                  className="absolute text-white -bottom-5 -right-0"
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TargetGroupSelector;
