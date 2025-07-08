import React from "react";
import { Input } from "@heroui/react";
import type { FillInBlankData } from "./fill-in-blank-question";
import type {
  ArrangementData,
  MultipleChoiceData,
  QuestionGroupData,
} from "./types";
import { QuestionGroupPreview } from "./question-group-preview";

export type QuestionType =
  | "subjective"
  | "objective"
  | "multiple-choice"
  | "fill-in-blank"
  | "arrangement"
  | "question-group";

export interface BaseQuestionData {
  questionTitle: string;
  questionDescription: string;
  showQuestionDescription: boolean;
  correctAnswer: string;
  correctAnswerDescription: string;
  showCorrectAnswerDescription: boolean;
}

interface QuestionPreviewProps {
  questionType: QuestionType;
  baseData: BaseQuestionData;
  fillInBlankData?: FillInBlankData;
  arrangementData?: ArrangementData;
  multipleChoiceData?: MultipleChoiceData;
  questionGroupData?: QuestionGroupData;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  questionType,
  baseData,
  fillInBlankData,
  arrangementData,
  multipleChoiceData,
  questionGroupData,
}) => {
  const renderFillInBlankPreview = () => {
    if (!fillInBlankData) return null;

    // Get blanks sorted by their appearance in the sentence (same as preview)
    const getSortedBlanks = () => {
      return [...fillInBlankData.blanks].sort((a, b) => {
        const aIndex = fillInBlankData.sentence.indexOf(`{BLANK_${a.id}}`);
        const bIndex = fillInBlankData.sentence.indexOf(`{BLANK_${b.id}}`);
        return aIndex - bIndex;
      });
    };

    const sortedBlanks = getSortedBlanks();

    const renderSentenceWithBlanks = () => {
      if (!fillInBlankData.sentence) return null;

      if (fillInBlankData.blanks.length === 0) {
        return <span>{fillInBlankData.sentence}</span>;
      }

      const workingSentence = fillInBlankData.sentence;
      const elements: (string | React.ReactNode)[] = [];

      // Create a map of blank placeholders to their numbered boxes
      const blankElements = new Map<string, React.ReactNode>();

      sortedBlanks.forEach((blank, index) => {
        const placeholder = `{BLANK_${blank.id}}`;
        const blankNumber = index + 1;

        const blankElement = (
          <span
            key={blank.id}
            className="inline-block mx-1 relative"
            style={{ verticalAlign: "baseline" }}
          >
            <span className="text-xs text-gray-600 absolute  left-1/2 transform -translate-x-1/2">
              ({blankNumber})
            </span>
            <span className="border-b-2 border-gray-800 w-16 inline-block" />
          </span>
        );

        blankElements.set(placeholder, blankElement);
      });

      // Split sentence by placeholders and process
      const placeholderPattern = new RegExp(`(\\{BLANK_\\d+\\})`, "g");
      const parts = workingSentence.split(placeholderPattern);

      parts.forEach((part) => {
        if (part.match(/^\{BLANK_\d+\}$/)) {
          // This is a placeholder - replace with numbered box
          const blankElement = blankElements.get(part);
          if (blankElement) {
            elements.push(blankElement);
          }
        } else if (part) {
          // This is regular text
          elements.push(part);
        }
      });

      return <>{elements}</>;
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">Fill in blank</h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-4 text-lg leading-9">
            {renderSentenceWithBlanks()}
          </div>
          {fillInBlankData.showFillInBlankDescription &&
            fillInBlankData.fillInBlankDescription && (
              <div
                className="mt-2 text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: fillInBlankData.fillInBlankDescription,
                }}
              />
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {sortedBlanks.map((blank, idx) => (
            <div key={blank.id} className="flex items-center gap-2">
              <span className="text-sm text-gray-600">({idx + 1})</span>
              <Input
                type="text"
                placeholder="Enter answer"
                value={blank.text}
                readOnly
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderArrangementPreview = () => {
    if (!arrangementData) return null;

    const WordToken = ({
      word,
      className,
    }: {
      word: string;
      className?: string;
    }) => (
      <div
        className={`inline-block bg-gray-100   px-3 py-1 text-sm ${className}`}
      >
        {word}
      </div>
    );

    // Tách ra những phần chưa được mix và những phần đã mix
    const renderPreviewSentence = () => {
      if (!arrangementData.mixedWordsWithBorder) {
        return <div className="text-lg mb-4">{arrangementData.sentence}</div>;
      }

      // Tạo preview với thanh ngang cho những từ bị mix
      const sentenceElements: React.ReactElement[] = [];
      const mixedWords: string[] = [];

      arrangementData.mixedWordsWithBorder.forEach((wordInfo, index) => {
        if (!wordInfo.isMixed) {
          // Từ chưa được mix - hiển thị bình thường
          sentenceElements.push(
            <span key={`unmixed-${index}`} className="mr-2">
              {wordInfo.word}
            </span>
          );
        } else {
          // Từ đã được mix - hiển thị thanh ngang
          mixedWords.push(wordInfo.word);
          sentenceElements.push(
            <span key={`blank-${index}`} className="inline-block mr-2">
              <span className="border-b border-gray-500 inline-block min-w-[60px] h-6"></span>
            </span>
          );
        }
      });

      return (
        <div className="space-y-4">
          {/* Hiển thị câu với thanh ngang cho những từ bị mix */}
          <div className="text-lg flex flex-wrap items-baseline">
            {sentenceElements}
          </div>

          {/* Hiển thị những từ đã được mix dưới dạng tokens */}
          {mixedWords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mixedWords.map((word, index) => (
                <WordToken
                  key={`preview-mixed-${index}`}
                  word={word}
                  className="bg-white rounded-full shadow-md border"
                />
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Rearrange this sentence
          </h3>
          {renderPreviewSentence()}
          {arrangementData.showQuestionDescription &&
            arrangementData.questionDescription && (
              <div
                className="mt-2 text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: arrangementData.questionDescription,
                }}
              />
            )}
        </div>
      </div>
    );
  };

  const renderMultipleChoicePreview = () => {
    if (!multipleChoiceData) return null;

    return (
      <div className="space-y-6">
        {multipleChoiceData.questionTitle && (
          <div>
            <h3 className="font-semibold text-lg mb-4">
              Choose correct question
            </h3>
            <div
              className="text-lg mb-4 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: multipleChoiceData.questionTitle,
              }}
            />
            {multipleChoiceData.showQuestionDescription &&
              multipleChoiceData.questionDescription && (
                <div
                  className="mt-2 text-gray-600 text-sm break-words prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: multipleChoiceData.questionDescription,
                  }}
                />
              )}
          </div>
        )}

        {multipleChoiceData.options.some((option) =>
          option.inputs.some((input) => input.text.trim() !== "")
        ) && (
          <div>
            <h4 className="font-medium mb-4">Correct answer</h4>
            <div className="space-y-3">
              {multipleChoiceData.options.map((option) => {
                // Combine all inputs from this option into a single string
                const optionText = option.inputs
                  .map((input) => input.text)
                  .filter((text) => text.trim() !== "")
                  .join(" ");

                // Only show option if it has actual content
                if (!optionText) return null;

                return (
                  <div
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      option.isCorrect
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      readOnly
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                    />
                    <span
                      className={`text-sm ${
                        option.isCorrect
                          ? "text-orange-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {optionText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {multipleChoiceData.showCorrectAnswerDescription &&
          multipleChoiceData.correctAnswerDescription && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div
                className="text-sm text-blue-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: multipleChoiceData.correctAnswerDescription,
                }}
              />
            </div>
          )}
      </div>
    );
  };

  const renderStandardPreview = () => {
    return (
      <div className="space-y-4">
        {/* Question Section - Only show if there's data */}
        {baseData.questionTitle && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <div className="tiptap">
              <div
                dangerouslySetInnerHTML={{ __html: baseData.questionTitle }}
              />
            </div>

            {/* Question Description - Only show if enabled and has content */}
            {baseData.showQuestionDescription &&
              baseData.questionDescription && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description for question
                  </label>
                  <div className="tiptap">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: baseData.questionDescription,
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Correct Answer Section - Only show if there's data */}
        {baseData.correctAnswer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct answer
            </label>
            <div className="tiptap">
              <div
                dangerouslySetInnerHTML={{ __html: baseData.correctAnswer }}
              />
            </div>

            {/* Correct Answer Description - Only show if enabled and has content */}
            {baseData.showCorrectAnswerDescription &&
              baseData.correctAnswerDescription && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description for correct answer
                  </label>
                  <div className="tiptap">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: baseData.correctAnswerDescription,
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sticky  p-5 bg-white">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
      {questionType === "fill-in-blank"
        ? renderFillInBlankPreview()
        : questionType === "arrangement"
          ? renderArrangementPreview()
          : questionType === "multiple-choice"
            ? renderMultipleChoicePreview()
            : questionType === "question-group"
              ? questionGroupData && (
                  <QuestionGroupPreview data={questionGroupData} />
                )
              : renderStandardPreview()}
    </div>
  );
};
