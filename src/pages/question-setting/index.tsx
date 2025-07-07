import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import type { TreeMenuItem } from "@/hooks/useCategoryTree";
import CategoryModal from "@/components/category-modal";
import { MdArrowRight } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { RegistrationHeader, LeftPanel, RightPanel } from "./components";

const QuestionSettings = () => {
  const navigate = useNavigate();
  const [currentStep] = useState(0);

  // Local state for all form data
  const [selectedDifficulty, setSelectedDifficulty] = useState<number[]>([]);
  const [selectedTargetGroups, setSelectedTargetGroups] = useState<string[]>([
    "초1 ~ 초6",
    "유치원",
  ]);
  const [price, setPrice] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Use the category tree hook for local display only
  const { treeData, handleItemChange, getSelectedCategoryPath } =
    useCategoryTree();

  const steps = ["Setting general information", "Editor"];

  const targetGroups = [
    "초1 ~ 초6",
    "중1 ~ 중6",
    "고1 ~ 고6",
    "대1 ~ 대6",
    "성인",
    "유치원",
    "초등학교",
    "중학교",
    "고등학교",
  ];

  const handleNextStep = async () => {
    // Get the selected category from tree
    const selectedPath = getSelectedCategoryPath();

    // Prepare data to pass to next step
    const registrationData = {
      selectedCategory: selectedPath,
      selectedDifficulty: selectedDifficulty,
      selectedTargetGroups: selectedTargetGroups,
      price: price,
    };

    // Navigate to editor page with state
    navigate("/question-registration/editor", {
      state: registrationData,
    });
  };

  const handleCategoryConfirm = (_selectedPath: string) => {
    // Category will be handled by the tree component directly
    // This is just for the modal confirmation
  };

  const renderTreeItem = (
    item: TreeMenuItem,
    level: number,
    isExpanded: boolean,
    toggleExpand: () => void,
    onItemChange: (id: string, key: string, value: unknown) => void,
    isLastChild?: boolean
  ) => {
    const hasChildren = item.children && item.children.length > 0;

    const getAncestorLines = (currentLevel: number, isLastAtLevel: boolean) => {
      const lines = [];

      for (let i = 1; i <= currentLevel; i++) {
        const shouldDrawLine = i < currentLevel || !isLastAtLevel;
        lines.push(
          <div
            key={`vertical-${i}`}
            className="absolute border-l-2 border-dotted border-gray-400"
            style={{
              left: `${(i - 1) * 1.5 + 1.75}rem`,
              top: 0,
              bottom: shouldDrawLine ? 0 : "50%",
              width: "0px",
            }}
          />
        );
      }

      return lines;
    };

    const getCurrentNodeVerticalLine = () => {
      if (level === 0) return null;

      const isLastSibling = isLastChild;

      if (hasChildren && isExpanded && isLastSibling) {
        return (
          <div
            className="absolute border-l-2 border-dotted border-gray-400"
            style={{
              left: `${(level - 1) * 1.5 + 1.75}rem`,
              top: "50%",
              bottom: 0,
              width: "0px",
            }}
          />
        );
      }

      return null;
    };

    return (
      <div
        className={`relative  flex items-center py-3 gap-4 pr-10 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
          level === 0 ? "bg-gray-50 border-b" : ""
        }`}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={toggleExpand}
      >
        {getAncestorLines(level, isLastChild || false)}
        {getCurrentNodeVerticalLine()}

        {level > 0 && (
          <div
            className="absolute border-t-2 border-dotted border-gray-400"
            style={{
              left: `${(level - 1) * 1.5 + 1.75}rem`,
              top: "50%",
              width: "1.25rem",
              height: "0px",
            }}
          />
        )}

        <MdArrowRight
          className={`transition-transform flex-shrink-0 w-6 h-6 duration-200 ${
            hasChildren ? "" : "invisible"
          } ${isExpanded ? "rotate-90" : ""}`}
        />

        <div className="inline-flex items-center gap-1.5">
          <label
            onClick={(e) => e.stopPropagation()}
            className="flex items-center cursor-pointer relative"
          >
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={(e) =>
                onItemChange(item.id, "isChecked", e.target.checked)
              }
              className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FaCheck size={14} />
            </span>
          </label>
          <span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
            {item.label}
          </span>
        </div>
      </div>
    );
  };

  const handleDifficultyClick = (difficulty: number) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTargetGroupClick = (group: string) => {
    setSelectedTargetGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  return (
    <div className="h-screen flex flex-col px-4">
      <div className="flex-shrink-0">
        <RegistrationHeader currentStep={currentStep} steps={steps} />
      </div>

      {/* Main Content - takes remaining space with proper overflow handling */}
      <div className="flex flex-1 bg-gray-50 min-h-0 overflow-hidden">
        <LeftPanel
          treeData={treeData}
          onItemChange={handleItemChange}
          renderTreeItem={renderTreeItem}
        />

        <RightPanel
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={handleDifficultyClick}
          targetGroups={targetGroups}
          selectedTargetGroups={selectedTargetGroups}
          onTargetGroupChange={handleTargetGroupClick}
          price={price}
          onPriceChange={setPrice}
          onNextStep={handleNextStep}
        />
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onConfirm={handleCategoryConfirm}
        initialSelectedPath=""
      />
    </div>
  );
};

export default QuestionSettings;
