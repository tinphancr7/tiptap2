import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import CustomSwitch from "@/components/ui/custom-switch";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrFormViewHide } from "react-icons/gr";
import type { BaseQuestionData } from "./question-preview";
import type { QuestionType } from "./types";
export type ActiveEditor =
  | "question"
  | "questionDescription"
  | "correctAnswer"
  | "correctAnswerDescription"
  | null;
export interface EditorState {
  activeEditor: ActiveEditor;
  questionType: QuestionType;
}
export interface QuestionComponentProps {
  editorState: EditorState;
  onEditorStateChange: (state: Partial<EditorState>) => void;
  onFocus: (editor: ActiveEditor) => void;
  onBlur: () => void;
}
interface SubjectiveQuestionProps extends QuestionComponentProps {
  data: BaseQuestionData;
  onDataChange: (data: Partial<BaseQuestionData>) => void;
}
export const SubjectiveQuestion: React.FC<SubjectiveQuestionProps> = ({
  data,
  onDataChange,
}) => {
  const [showQuestionDescription, setShowQuestionDescription] = useState(
    data.showQuestionDescription
  );
  const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
    useState(data.showCorrectAnswerDescription);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLeftToRight, setIsLeftToRight] = useState(false);
  const [characterLimitEnabled, setCharacterLimitEnabled] = useState(false);
  const [characterLimit, setCharacterLimit] = useState(100);
  const handleQuestionContentChange = (content: string) => {
    onDataChange({ questionTitle: content });
  };
  const handleQuestionDescriptionChange = (content: string) => {
    onDataChange({ questionDescription: content });
  };
  const handleCorrectAnswerChange = (content: string) => {
    onDataChange({ correctAnswer: content });
  };
  const handleCorrectAnswerDescriptionChange = (content: string) => {
    onDataChange({ correctAnswerDescription: content });
  };
  const handleQuestionDescriptionToggle = (show: boolean) => {
    setShowQuestionDescription(show);
    onDataChange({ showQuestionDescription: show });
  };
  const handleCorrectAnswerDescriptionToggle = (show: boolean) => {
    setShowCorrectAnswerDescription(show);
    onDataChange({ showCorrectAnswerDescription: show });
  };
  const handleCharacterLimitToggle = (enabled: boolean) => {
    setCharacterLimitEnabled(enabled);
    if (!enabled) {
      setCharacterLimit(100);
    }
  };
  const handleCharacterLimitChange = (limit: number) => {
    setCharacterLimit(limit);
  };
  return (
    <div className="space-y-4">
      {}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Output Direction
          </label>
          <CustomSwitch
            isSelected={isLandscape}
            onSelectionChange={setIsLandscape}
            label="Landscape"
            className="w-[120px]"
            selectedColor="#0958D9"
            unselectedColor="#d1d5db"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Placement Direction
          </label>
          <CustomSwitch
            isSelected={isLeftToRight}
            onSelectionChange={setIsLeftToRight}
            label="Left to right"
            className="w-[120px]"
            selectedColor="#0958D9"
            unselectedColor="#d1d5db"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="question"
          className="text-sm font-medium text-gray-700 mb-2 block"
        >
          Question
        </label>
        <div className="border rounded-lg ">
          <Toolbar />
          <div className="p-3">
            <Editor
              placeholder="Enter question here"
              onContentChange={handleQuestionContentChange}
            />
          </div>
        </div>
        {showQuestionDescription ? (
          <button
            onClick={() =>
              handleQuestionDescriptionToggle(!showQuestionDescription)
            }
            className=" w-fit font-medium ml-auto  text-sm h-8  flex items-center justify-center gap-1"
          >
            <GrFormViewHide size={16} />
            <span className="underline"> Hide description</span>
          </button>
        ) : (
          <button
            onClick={() =>
              handleQuestionDescriptionToggle(!showQuestionDescription)
            }
            className=" w-fit font-medium ml-auto  text-sm h-8  flex items-center justify-center gap-1"
          >
            <AiOutlinePlus size={16} />
            <span className="underline"> Add description</span>
          </button>
        )}
        {showQuestionDescription && (
          <div className="space-y-2">
            <label
              htmlFor="question-description"
              className="text-sm font-medium text-gray-700"
            >
              Description for question
            </label>
            <div className="border rounded-lg ">
              <Toolbar />
              <div className="p-3">
                <Editor
                  placeholder="Enter description for question"
                  onContentChange={handleQuestionDescriptionChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="correct-answer"
          className="text-sm font-medium text-gray-700"
        >
          Correct answer
        </label>
        <div className="border rounded-lg ">
          <Toolbar />
          <div className="p-3">
            <Editor
              placeholder="Enter correct answer here"
              onContentChange={handleCorrectAnswerChange}
            />
          </div>
        </div>
        {showCorrectAnswerDescription ? (
          <button
            onClick={() =>
              handleCorrectAnswerDescriptionToggle(
                !showCorrectAnswerDescription
              )
            }
            className=" w-fit font-medium ml-auto  text-sm h-8  flex items-center justify-center gap-1"
          >
            <GrFormViewHide size={16} />
            <span className="underline"> Hide description</span>
          </button>
        ) : (
          <button
            onClick={() =>
              handleCorrectAnswerDescriptionToggle(
                !showCorrectAnswerDescription
              )
            }
            className=" w-fit font-medium ml-auto  text-sm h-8  flex items-center justify-center gap-1"
          >
            <AiOutlinePlus size={16} />
            <span className="underline"> Add description</span>
          </button>
        )}
        {showCorrectAnswerDescription && (
          <div className="space-y-2">
            <label
              htmlFor="correct-answer-description"
              className="text-sm font-medium text-gray-700"
            >
              Description for correct answer
            </label>
            <div className="border rounded-lg ">
              <Toolbar />
              <div className="p-3">
                <Editor
                  placeholder="Enter description for correct answer"
                  onContentChange={handleCorrectAnswerDescriptionChange}
                />
              </div>
            </div>
          </div>
        )}
        {}
        <div className="flex items-center gap-1 p-1 border rounded-full w-fit">
          {}
          <CustomSwitch
            isSelected={characterLimitEnabled}
            onSelectionChange={handleCharacterLimitToggle}
            label="Character limit"
            className="w-[148px]"
            selectedColor="#0958D9"
            unselectedColor="#d1d5db"
          />
          {characterLimitEnabled && (
            <div className="flex items-center  px-1">
              <input
                type="number"
                value={characterLimit}
                onChange={(e) =>
                  handleCharacterLimitChange(
                    Math.max(0, Number(e.target.value))
                  )
                }
                className="w-10 h-7 border-0 border-b border-gray-500 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 text-center text-base font-semibold outline-none"
              />
              <span className="text-base text-gray-700 font-normal ">
                characters
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
