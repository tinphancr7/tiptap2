import { useState } from "react";
import { useLocation } from "react-router-dom";
import CustomSelect from "@/components/form/custom-select";
import CategoryModal from "@/components/category-modal";
import {
  FillInBlankQuestion,
  type FillInBlankData,
} from "./components/fill-in-blank-question";
import { ArrangementQuestion } from "./components/arrangement-question";
import { MultipleChoiceQuestion } from "./components/multiple-choice-question";
import { QuestionGroup } from "./components/question-group";
import type {
  ArrangementData,
  MultipleChoiceData,
  QuestionGroupData,
  QuestionType,
} from "./components/types";
import { QuestionMode } from "./components/types";
import {
  SubjectiveQuestion,
  type ActiveEditor,
  type EditorState,
} from "./components/subjective-question";
import {
  QuestionPreview,
  type BaseQuestionData,
} from "./components/question-preview";
import { RegistrationHeader } from "../question-setting/components";
export default function QuestionEditor() {
  const location = useLocation();
  const registrationData = location.state || {
    selectedCategory: "",
    selectedDifficulty: [],
    selectedTargetGroups: [],
    price: "",
  };
  const [editorState, setEditorState] = useState<EditorState>({
    activeEditor: null,
    questionType: QuestionMode.COMPOSITE,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(
    registrationData.selectedCategory || ""
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [baseQuestionData, setBaseQuestionData] = useState<BaseQuestionData>({
    questionTitle: "",
    questionDescription: "",
    showQuestionDescription: false,
    correctAnswer: "",
    correctAnswerDescription: "",
    showCorrectAnswerDescription: false,
  });
  const [fillInBlankData, setFillInBlankData] = useState<FillInBlankData>({
    sentence: "",
    blanks: [],
    selection: null,
    correctAnswers: new Map(),
    fillInBlankDescription: "",
    showFillInBlankDescription: false,
    answerLayout: "horizontal",
    correctAnswerFillInBlankDescription: "",
    showCorrectAnswerFillInBlankDescription: false,
  });
  const [arrangementData, setArrangementData] = useState<ArrangementData>({
    sentence: "",
    mixedWords: [],
    correctOrder: [],
    questionDescription: "",
    showQuestionDescription: false,
    correctAnswerDescription: "",
    showCorrectAnswerDescription: false,
    mixedAnswerLayout: "horizontal",
    correctAnswerLayout: "horizontal",
    showMixedAnswerDescription: false,
    mixedAnswerDescription: "",
  });
  const [multipleChoiceData, setMultipleChoiceData] =
    useState<MultipleChoiceData>({
      questionTitle: "",
      questionDescription: "",
      showQuestionDescription: false,
      options: [
        {
          id: "1",
          inputs: [{ id: "1_input", text: "" }],
          isCorrect: false,
        },
        {
          id: "2",
          inputs: [{ id: "2_input", text: "" }],
          isCorrect: false,
        },
      ],
      answerLayout: "horizontal",
      correctAnswerDescription: "",
      showCorrectAnswerDescription: false,
    });
  const [questionGroupData, setQuestionGroupData] = useState<QuestionGroupData>(
    {
      groupTitle: "",
      groupDescription: "",
      showGroupDescription: false,
      questions: [
        {
          id: "1",
          title: "Question 1",
          type: QuestionMode.SUBJECTIVE,
          baseData: {
            questionTitle: "",
            questionDescription: "",
            showQuestionDescription: false,
            correctAnswer: "",
            correctAnswerDescription: "",
            showCorrectAnswerDescription: false,
          },
        },
      ],
    }
  );
  const formatCategoryPath = (path: string) => {
    if (!path) return "Select a category...";
    const parts = path.split(" > ");
    if (parts.length <= 2) {
      return path.replace(/ > /g, " / ");
    }
    return `${parts[0]} / ... / ${parts[parts.length - 1]}`;
  };
  const handleEditorStateChange = (state: Partial<EditorState>) => {
    setEditorState((prev) => ({ ...prev, ...state }));
  };
  const handleBaseQuestionDataChange = (data: Partial<BaseQuestionData>) => {
    setBaseQuestionData((prev) => ({ ...prev, ...data }));
  };
  const handleFillInBlankDataChange = (data: Partial<FillInBlankData>) => {
    setFillInBlankData((prev) => ({ ...prev, ...data }));
  };
  const handleArrangementDataChange = (data: Partial<ArrangementData>) => {
    setArrangementData((prev: ArrangementData) => ({ ...prev, ...data }));
  };
  const handleMultipleChoiceDataChange = (
    data: Partial<MultipleChoiceData>
  ) => {
    setMultipleChoiceData((prev: MultipleChoiceData) => ({ ...prev, ...data }));
  };
  const handleQuestionGroupDataChange = (data: Partial<QuestionGroupData>) => {
    setQuestionGroupData((prev: QuestionGroupData) => ({ ...prev, ...data }));
  };
  const handleFocus = (editor: ActiveEditor) => {
    setEditorState((prev) => ({ ...prev, activeEditor: editor }));
  };
  const handleBlur = () => {
    setTimeout(() => {
      if (
        document.activeElement?.closest(".editor-toolbar-container") === null
      ) {
        setEditorState((prev) => ({ ...prev, activeEditor: null }));
      }
    }, 100);
  };
  const handleQuestionTypeChange = (questionType: QuestionType) => {
    setEditorState((prev) => ({ ...prev, questionType }));
  };
  const steps = ["Setting general information", "Editor"];
  const [currentStep] = useState(0);
  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col">
      <div className="px-4 flex-shrink-0">
        <RegistrationHeader currentStep={currentStep} steps={steps} />
      </div>
      <div className="flex-1 px-4 pb-4 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-w-full flex-1">
          <div className="lg:col-span-7 p-5 space-y-5 bg-white  border-r border-gray-200">
            <div className="flex gap-4">
              <div className="w-full md:flex-1">
                <label className="mb-1.5 inline-block text-sm font-semibold">
                  Choose category
                </label>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-gray-300 transition-colors h-10 overflow-hidden"
                >
                  <div className="flex items-center justify-between h-full">
                    <span className="text-sm text-gray-700 line-clamp-1 flex-1 mr-2">
                      {formatCategoryPath(selectedCategory)}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
              <div className="w-full md:w-auto">
                <CustomSelect
                  label="Difficulty"
                  items={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },
                  ]}
                  defaultSelectedKeys={["1"]}
                  className="w-full md:w-[80px]"
                />
              </div>
              <div className="w-full md:w-auto">
                <CustomSelect
                  label="Type question"
                  items={[
                    { label: "Subjective", value: QuestionMode.SUBJECTIVE },
                    { label: "Objective", value: QuestionMode.OBJECTIVE },
                    {
                      label: "Multiple Choice",
                      value: QuestionMode.MULTIPLE_CHOICE,
                    },
                    {
                      label: "Fill in blank",
                      value: QuestionMode.FILL_IN_BLANK,
                    },
                    { label: "Arrangement", value: QuestionMode.ARRANGING },
                    { label: "Question Group", value: QuestionMode.COMPOSITE },
                  ]}
                  selectedKeys={[editorState.questionType]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as QuestionType;
                    handleQuestionTypeChange(selected);
                  }}
                  className="w-full md:w-[150px]"
                />
              </div>
            </div>
            {editorState.questionType === QuestionMode.FILL_IN_BLANK ? (
              <FillInBlankQuestion
                data={fillInBlankData}
                onDataChange={handleFillInBlankDataChange}
              />
            ) : editorState.questionType === QuestionMode.ARRANGING ? (
              <ArrangementQuestion
                data={arrangementData}
                onDataChange={handleArrangementDataChange}
              />
            ) : editorState.questionType === QuestionMode.MULTIPLE_CHOICE ? (
              <MultipleChoiceQuestion
                data={multipleChoiceData}
                onDataChange={handleMultipleChoiceDataChange}
              />
            ) : editorState.questionType === QuestionMode.COMPOSITE ? (
              <QuestionGroup
                data={questionGroupData}
                onDataChange={handleQuestionGroupDataChange}
              />
            ) : (
              <SubjectiveQuestion
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                data={baseQuestionData}
                onDataChange={handleBaseQuestionDataChange}
              />
            )}
          </div>
          <div className="col-span-5 bg-white">
            <QuestionPreview
              questionType={editorState.questionType}
              baseData={baseQuestionData}
              fillInBlankData={
                editorState.questionType === QuestionMode.FILL_IN_BLANK
                  ? fillInBlankData
                  : undefined
              }
              arrangementData={
                editorState.questionType === QuestionMode.ARRANGING
                  ? arrangementData
                  : undefined
              }
              multipleChoiceData={
                editorState.questionType === QuestionMode.MULTIPLE_CHOICE
                  ? multipleChoiceData
                  : undefined
              }
              questionGroupData={
                editorState.questionType === QuestionMode.COMPOSITE
                  ? questionGroupData
                  : undefined
              }
            />
          </div>
        </div>
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onConfirm={setSelectedCategory}
          initialSelectedPath={selectedCategory}
        />
      </div>
    </div>
  );
}
