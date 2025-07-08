import React from "react";
import type { QuestionGroupData, QuestionGroupItem } from "./types";
import { QuestionPreview } from "./question-preview";

interface QuestionGroupPreviewProps {
  data: QuestionGroupData;
}

const renderQuestionPreview = (question: QuestionGroupItem) => {
  // Create base data for QuestionPreview component
  const getBaseData = () => {
    switch (question.type) {
      case "fill-in-blank":
      case "arrangement":
      case "multiple-choice":
        // For these types, QuestionPreview uses specific data, not baseData
        return {
          questionTitle: "",
          questionDescription: "",
          showQuestionDescription: false,
          correctAnswer: "",
          correctAnswerDescription: "",
          showCorrectAnswerDescription: false,
        };
      default:
        return (
          question.baseData || {
            questionTitle: "",
            questionDescription: "",
            showQuestionDescription: false,
            correctAnswer: "",
            correctAnswerDescription: "",
            showCorrectAnswerDescription: false,
          }
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="font-medium text-gray-900">{question.title}</div>
      <QuestionPreview
        questionType={question.type}
        baseData={getBaseData()}
        fillInBlankData={question.fillInBlankData}
        arrangementData={question.arrangementData}
        multipleChoiceData={question.multipleChoiceData}
      />
    </div>
  );
};

export const QuestionGroupPreview: React.FC<QuestionGroupPreviewProps> = ({
  data,
}) => {
  if (!data || !data.questions || data.questions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No questions added yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Title */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {data.groupTitle ? (
            <div dangerouslySetInnerHTML={{ __html: data.groupTitle }} />
          ) : (
            "Enter title here"
          )}
        </h2>
        {data.showGroupDescription && data.groupDescription && (
          <div className="text-sm text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: data.groupDescription }} />
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {data.questions.map((question, index) => (
          <div key={question.id} className="border-l-4 border-blue-200 pl-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-blue-600">
                {index + 1}.
              </span>
              <span className="text-sm text-gray-500">{question.title}</span>
            </div>
            {renderQuestionPreview(question)}
          </div>
        ))}
      </div>
    </div>
  );
};
