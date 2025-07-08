import React from "react";
import { Input } from "@heroui/react";
import type { FillInBlankData } from "./fill-in-blank-question";
import type {
  ArrangementData,
  MultipleChoiceData,
  QuestionGroupData,
} from "./types";

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
            className="inline-block relative"
            style={{ verticalAlign: "baseline" }}
          >
            <span className="text-xs text-gray-500 absolute left-1/2 transform -translate-x-1/2 ">
              ({blankNumber})
            </span>
            <span
              className="border-b-2 border-gray-600 inline-block min-w-[40px]"
              style={{ width: `${Math.max(blank.text.length * 8, 40)}px` }}
            />
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
      <div className="space-y-6 ">
        <div>
          <h3 className="font-semibold text-lg mb-2">Fill in blank</h3>
          <div>{renderSentenceWithBlanks()}</div>
        </div>
        {fillInBlankData.showFillInBlankDescription &&
          fillInBlankData.fillInBlankDescription && (
            <div>
              <h5 className="font-medium text-sm">
                Description for fill in blank:
              </h5>
              <div
                className="text-gray-600  break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: fillInBlankData.fillInBlankDescription,
                }}
              />
            </div>
          )}
        {sortedBlanks.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Correct Answer:</h5>
            <div
              className={`${
                fillInBlankData.answerLayout === "horizontal"
                  ? "grid grid-cols-1 sm:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              }`}
            >
              {sortedBlanks.map((blank, idx) => (
                <div key={blank.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">({idx + 1})</span>
                  <Input
                    type="text"
                    placeholder="Enter answer"
                    value={blank.text}
                    readOnly
                    className="w-fit"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {fillInBlankData.showCorrectAnswerFillInBlankDescription &&
          fillInBlankData.correctAnswerFillInBlankDescription && (
            <div className="space-y-2">
              <h5 className="font-medium text-sm mb-2">
                Explanation for Correct Answer:
              </h5>
              <div
                className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: fillInBlankData.correctAnswerFillInBlankDescription,
                }}
              />
            </div>
          )}
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
        className={`inline-block bg-gray-100 px-3 py-1 text-sm ${className}`}
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
      <div className="space-y-5">
        <h3 className="font-semibold text-lg mb-4">Rearrange this sentence</h3>
        {renderPreviewSentence()}
        {arrangementData.showQuestionDescription &&
          arrangementData.questionDescription && (
            <div>
              <h5 className="font-medium text-sm mb-2">
                Description for question:
              </h5>
              <div
                className="mt-2 text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: arrangementData.questionDescription,
                }}
              />
            </div>
          )}

        {/* Mixed Answer Section */}
        {arrangementData.mixedWords.length > 0 && (
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-sm mb-2">Mixed Answer:</h5>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div
                  className={`flex flex-wrap items-center ${
                    arrangementData.mixedAnswerLayout === "vertical"
                      ? "flex-col items-start"
                      : ""
                  }`}
                >
                  {arrangementData.mixedWordsWithBorder
                    ? arrangementData.mixedWordsWithBorder.map(
                        (wordInfo, index) =>
                          wordInfo.isMixed ? (
                            <WordToken
                              key={`mixed-${index}`}
                              word={wordInfo.word}
                              className="border m-1 rounded-full bg-white shadow-lg"
                            />
                          ) : (
                            <span
                              key={`mixed-${index}`}
                              className="inline-block text-sm px-1"
                            >
                              {wordInfo.word}
                            </span>
                          )
                      )
                    : arrangementData.mixedWords.map((word, index) => (
                        <WordToken key={`mixed-${index}`} word={word} />
                      ))}
                </div>
              </div>
            </div>

            {/* Mixed Answer Description */}
            {arrangementData.showMixedAnswerDescription &&
              arrangementData.mixedAnswerDescription && (
                <div>
                  <h5 className="font-medium text-sm mb-2">
                    Description for mixed answer:
                  </h5>
                  <div
                    className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: arrangementData.mixedAnswerDescription,
                    }}
                  />
                </div>
              )}
          </div>
        )}

        {/* Correct Answer Section */}
        {arrangementData.mixedWords.length > 0 &&
          arrangementData.correctOrder.length > 0 && (
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-sm mb-2">Correct Answer:</h5>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div
                    className={`flex flex-wrap items-center ${
                      arrangementData.correctAnswerLayout === "vertical"
                        ? "flex-col items-start"
                        : ""
                    }`}
                  >
                    {arrangementData.correctOrderWithBorder
                      ? arrangementData.correctOrderWithBorder.map(
                          (wordInfo, index) =>
                            wordInfo.isMixed ? (
                              <WordToken
                                key={`correct-${index}`}
                                word={wordInfo.word}
                                className="border m-1 rounded-full bg-white shadow-lg"
                              />
                            ) : (
                              <span
                                key={`correct-${index}`}
                                className="inline-block text-sm px-1"
                              >
                                {wordInfo.word}
                              </span>
                            )
                        )
                      : arrangementData.correctOrder.map((word, index) => (
                          <WordToken
                            key={`correct-${index}`}
                            word={word}
                            className="bg-green-50 border-green-200"
                          />
                        ))}
                  </div>
                </div>
              </div>

              {/* Correct Answer Description */}
              {arrangementData.showCorrectAnswerDescription &&
                arrangementData.correctAnswerDescription && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">
                      Description for correct answer:
                    </h5>
                    <div
                      className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: arrangementData.correctAnswerDescription,
                      }}
                    />
                  </div>
                )}
            </div>
          )}
      </div>
    );
  };

  const renderMultipleChoicePreview = () => {
    if (!multipleChoiceData) return null;

    return (
      <div className="space-y-6">
        {multipleChoiceData.questionTitle && (
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Choose correct question
            </h3>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: multipleChoiceData.questionTitle,
              }}
            />
            {multipleChoiceData.showQuestionDescription &&
              multipleChoiceData.questionDescription && (
                <div className="mt-3">
                  <h5 className="font-medium text-sm mb-2">
                    Description for question:
                  </h5>
                  <div
                    className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: multipleChoiceData.questionDescription,
                    }}
                  />
                </div>
              )}
          </div>
        )}

        {/* Show all options with checkboxes */}
        {multipleChoiceData.options.some((option) =>
          option.inputs.some((input) => input.text.trim() !== "")
        ) && (
          <div className="space-y-4">
            <h5 className="font-medium text-sm mb-2">Correct answer</h5>
            <div className="space-y-2">
              {multipleChoiceData.options.map((option) => {
                const optionText = option.inputs
                  .map((input) => input.text)
                  .filter((text) => text.trim() !== "")
                  .join(" ");

                // Only show option if it has actual content
                if (!optionText) return null;

                return (
                  <div key={option.id} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        option.isCorrect
                          ? "border-orange-400 bg-orange-400"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {option.isCorrect && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{optionText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {multipleChoiceData.showCorrectAnswerDescription &&
          multipleChoiceData.correctAnswerDescription && (
            <div>
              <h5 className="font-medium text-sm mb-2">
                Description for correct answer:
              </h5>
              <div
                className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: multipleChoiceData.correctAnswerDescription,
                }}
              />
            </div>
          )}
      </div>
    );
  };

  const renderQuestionGroupPreview = () => {
    if (!questionGroupData) return null;

    const renderIndividualQuestion = (
      question: QuestionGroupData["questions"][0],
      index: number
    ) => {
      return (
        <div key={question.id} className="border-l-4 border-blue-200 pl-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium text-blue-600">
              {index + 1}.
            </span>
            <span className="text-sm text-gray-500">{question.title}</span>
          </div>
          <div className="space-y-3">
            {/* Use the same logic as the main preview functions */}
            {question.type === "fill-in-blank" && question.fillInBlankData && (
              <div>
                {/* Fill in blank preview with full logic */}
                {(() => {
                  const fillInBlankData = question.fillInBlankData;

                  // Get blanks sorted by their appearance in the sentence
                  const getSortedBlanks = () => {
                    return [...fillInBlankData.blanks].sort((a, b) => {
                      const aIndex = fillInBlankData.sentence.indexOf(
                        `{BLANK_${a.id}}`
                      );
                      const bIndex = fillInBlankData.sentence.indexOf(
                        `{BLANK_${b.id}}`
                      );
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
                          className="inline-block relative"
                          style={{ verticalAlign: "baseline" }}
                        >
                          <span className="text-xs text-gray-500 absolute left-1/2 transform -translate-x-1/2 ">
                            ({blankNumber})
                          </span>
                          <span
                            className="border-b-2 border-gray-600 inline-block min-w-[40px]"
                            style={{
                              width: `${Math.max(blank.text.length * 8, 40)}px`,
                            }}
                          />
                        </span>
                      );

                      blankElements.set(placeholder, blankElement);
                    });

                    // Split sentence by placeholders and process
                    const placeholderPattern = new RegExp(
                      `(\\{BLANK_\\d+\\})`,
                      "g"
                    );
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
                        <h3 className="font-semibold text-lg mb-2">
                          Fill in blank
                        </h3>
                        <div>{renderSentenceWithBlanks()}</div>
                      </div>
                      {fillInBlankData.showFillInBlankDescription &&
                        fillInBlankData.fillInBlankDescription && (
                          <div>
                            <h5 className="font-medium text-sm">
                              Description for fill in blank:
                            </h5>
                            <div
                              className="text-gray-600 break-words prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: fillInBlankData.fillInBlankDescription,
                              }}
                            />
                          </div>
                        )}
                      {sortedBlanks.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">
                            Correct Answer:
                          </h5>
                          <div
                            className={`${
                              fillInBlankData.answerLayout === "horizontal"
                                ? "grid grid-cols-1 sm:grid-cols-3 gap-4"
                                : "flex flex-col gap-3"
                            }`}
                          >
                            {sortedBlanks.map((blank, idx) => (
                              <div
                                key={blank.id}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-600">
                                  ({idx + 1})
                                </span>
                                <Input
                                  type="text"
                                  placeholder="Enter answer"
                                  value={blank.text}
                                  readOnly
                                  className="w-fit"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            {question.type === "arrangement" && question.arrangementData && (
              <div>
                {/* Arrangement preview with full logic */}
                {(() => {
                  const arrangementData = question.arrangementData;

                  const WordToken = ({
                    word,
                    className,
                  }: {
                    word: string;
                    className?: string;
                  }) => (
                    <div
                      className={`inline-block bg-gray-100 px-3 py-1 text-sm ${className}`}
                    >
                      {word}
                    </div>
                  );

                  const renderPreviewSentence = () => {
                    if (!arrangementData.mixedWordsWithBorder) {
                      return (
                        <div className="text-lg mb-4">
                          {arrangementData.sentence}
                        </div>
                      );
                    }

                    const sentenceElements: React.ReactElement[] = [];
                    const mixedWords: string[] = [];

                    arrangementData.mixedWordsWithBorder.forEach(
                      (wordInfo, index) => {
                        if (!wordInfo.isMixed) {
                          sentenceElements.push(
                            <span key={`unmixed-${index}`} className="mr-2">
                              {wordInfo.word}
                            </span>
                          );
                        } else {
                          mixedWords.push(wordInfo.word);
                          sentenceElements.push(
                            <span
                              key={`blank-${index}`}
                              className="inline-block mr-2"
                            >
                              <span className="border-b border-gray-500 inline-block min-w-[60px] h-6"></span>
                            </span>
                          );
                        }
                      }
                    );

                    return (
                      <div className="space-y-4">
                        <div className="text-lg flex flex-wrap items-baseline">
                          {sentenceElements}
                        </div>
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
                    <div className="space-y-5">
                      <h3 className="font-semibold text-lg mb-4">
                        Rearrange this sentence
                      </h3>
                      {renderPreviewSentence()}
                      {arrangementData.showQuestionDescription &&
                        arrangementData.questionDescription && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">
                              Description for question:
                            </h5>
                            <div
                              className="mt-2 text-gray-600 text-sm break-words prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: arrangementData.questionDescription,
                              }}
                            />
                          </div>
                        )}
                    </div>
                  );
                })()}
              </div>
            )}
            {question.type === "multiple-choice" &&
              question.multipleChoiceData && (
                <div>
                  {/* Multiple choice preview with full logic */}
                  {(() => {
                    const multipleChoiceData = question.multipleChoiceData;

                    return (
                      <div className="space-y-6">
                        {multipleChoiceData.questionTitle && (
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              Choose correct question
                            </h3>
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: multipleChoiceData.questionTitle,
                              }}
                            />
                            {multipleChoiceData.showQuestionDescription &&
                              multipleChoiceData.questionDescription && (
                                <div className="mt-3">
                                  <h5 className="font-medium text-sm mb-2">
                                    Description for question:
                                  </h5>
                                  <div
                                    className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        multipleChoiceData.questionDescription,
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        )}

                        {/* Show all options with checkboxes */}
                        {multipleChoiceData.options.some((option) =>
                          option.inputs.some(
                            (input) => input.text.trim() !== ""
                          )
                        ) && (
                          <div className="space-y-4">
                            <h5 className="font-medium text-sm mb-2">
                              Correct answer
                            </h5>
                            <div className="space-y-2">
                              {multipleChoiceData.options.map((option) => {
                                const optionText = option.inputs
                                  .map((input) => input.text)
                                  .filter((text) => text.trim() !== "")
                                  .join(" ");

                                if (!optionText) return null;

                                return (
                                  <div
                                    key={option.id}
                                    className="flex items-center gap-3"
                                  >
                                    <div
                                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                        option.isCorrect
                                          ? "border-orange-400 bg-orange-400"
                                          : "border-gray-300 bg-white"
                                      }`}
                                    >
                                      {option.isCorrect && (
                                        <svg
                                          className="w-3 h-3 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-sm">
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
                            <div>
                              <h5 className="font-medium text-sm mb-2">
                                Description for correct answer:
                              </h5>
                              <div
                                className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    multipleChoiceData.correctAnswerDescription,
                                }}
                              />
                            </div>
                          )}
                      </div>
                    );
                  })()}
                </div>
              )}
            {(question.type === "subjective" ||
              question.type === "objective") &&
              question.baseData && (
                <div>
                  {/* Standard preview with full logic */}
                  {(() => {
                    const baseData = question.baseData;

                    return (
                      <div className="space-y-4">
                        {baseData.questionTitle && (
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              Question
                            </h3>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: baseData.questionTitle,
                              }}
                            />
                            {baseData.showQuestionDescription &&
                              baseData.questionDescription && (
                                <div className="mt-3">
                                  <h5 className="font-medium text-sm mb-2">
                                    Description for question
                                  </h5>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: baseData.questionDescription,
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        )}

                        {baseData.correctAnswer && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">
                              Correct answer
                            </h5>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: baseData.correctAnswer,
                              }}
                            />
                            {baseData.showCorrectAnswerDescription &&
                              baseData.correctAnswerDescription && (
                                <div className="mt-3">
                                  <h5 className="font-medium text-sm mb-2">
                                    Description for correct answer
                                  </h5>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: baseData.correctAnswerDescription,
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Group Title */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {questionGroupData.groupTitle ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: questionGroupData.groupTitle,
                }}
              />
            ) : (
              "Enter title here"
            )}
          </h2>
          {questionGroupData.showGroupDescription &&
            questionGroupData.groupDescription && (
              <div className="text-sm text-gray-600">
                <div
                  dangerouslySetInnerHTML={{
                    __html: questionGroupData.groupDescription,
                  }}
                />
              </div>
            )}
        </div>

        {/* Questions */}
        {questionGroupData.questions &&
        questionGroupData.questions.length > 0 ? (
          <div className="space-y-8">
            {questionGroupData.questions.map((question, index) =>
              renderIndividualQuestion(question, index)
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No questions added yet
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
            <h3 dangerouslySetInnerHTML={{ __html: baseData.questionTitle }} />

            {/* Question Description - Only show if enabled and has content */}
            {baseData.showQuestionDescription &&
              baseData.questionDescription && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 ">
                    Description for question:
                  </label>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: baseData.questionDescription,
                    }}
                  />
                </div>
              )}
          </div>
        )}

        {/* Correct Answer Section - Only show if there's data */}
        {baseData.correctAnswer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Correct answer
            </label>
            <div dangerouslySetInnerHTML={{ __html: baseData.correctAnswer }} />

            {/* Correct Answer Description - Only show if enabled and has content */}
            {baseData.showCorrectAnswerDescription &&
              baseData.correctAnswerDescription && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description for correct answer
                  </label>
                  <div className="">
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
    <div className="sticky tiptap p-5 bg-white">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
      {questionType === "fill-in-blank"
        ? renderFillInBlankPreview()
        : questionType === "arrangement"
          ? renderArrangementPreview()
          : questionType === "multiple-choice"
            ? renderMultipleChoicePreview()
            : questionType === "question-group"
              ? renderQuestionGroupPreview()
              : renderStandardPreview()}
    </div>
  );
};
