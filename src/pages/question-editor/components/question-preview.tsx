import React from "react";
import { Input } from "@heroui/react";
import type { FillInBlankData } from "./fill-in-blank-question";
import type {
  ArrangementData,
  MultipleChoiceData,
  QuestionGroupData,
  QuestionType,
} from "./types";
import { QuestionMode } from "./types";
export interface SubjectiveQuestionData {
  questionTitle: string;
  questionDescription: string;
  showQuestionDescription: boolean;
  correctAnswer: string;
  correctAnswerDescription: string;
  showCorrectAnswerDescription: boolean;
  isLeftToRight?: boolean;
}
interface QuestionPreviewProps {
  questionType: QuestionType;
  baseData: SubjectiveQuestionData;
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
      const placeholderPattern = new RegExp(`(\\{BLANK_\\d+\\})`, "g");
      const parts = workingSentence.split(placeholderPattern);
      parts.forEach((part) => {
        if (part.match(/^\{BLANK_\d+\}$/)) {
          const blankElement = blankElements.get(part);
          if (blankElement) {
            elements.push(blankElement);
          }
        } else if (part) {
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
    const renderPreviewSentence = () => {
      if (!arrangementData.mixedWordsWithBorder) {
        return <div className="text-lg mb-4">{arrangementData.sentence}</div>;
      }
      const sentenceElements: React.ReactElement[] = [];
      const mixedWords: string[] = [];
      arrangementData.mixedWordsWithBorder.forEach((wordInfo, index) => {
        if (!wordInfo.isMixed) {
          sentenceElements.push(
            <span key={`unmixed-${index}`} className="mr-2">
              {wordInfo.word}
            </span>
          );
        } else {
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

        {multipleChoiceData.options.some((option) =>
          option.inputs.some((input) => input.text.trim() !== "")
        ) && (
          <div className="space-y-4">
            <h5 className="font-medium text-sm mb-2">Correct answer:</h5>
            <div className="space-y-2">
              {multipleChoiceData.options.map((option) => {
                const optionText = option.inputs
                  .map((input) => input.text)
                  .filter((text) => text.trim() !== "")
                  .join(" ");
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
    const renderFillInBlankSubQuestion = (data: FillInBlankData) => {
      const getSortedBlanks = () => {
        return [...data.blanks].sort((a, b) => {
          const aIndex = data.sentence.indexOf(`{BLANK_${a.id}}`);
          const bIndex = data.sentence.indexOf(`{BLANK_${b.id}}`);
          return aIndex - bIndex;
        });
      };
      const sortedBlanks = getSortedBlanks();
      const renderSentenceWithBlanks = () => {
        if (!data.sentence) return null;
        if (data.blanks.length === 0) {
          return <span>{data.sentence}</span>;
        }
        const workingSentence = data.sentence;
        const elements: (string | React.ReactNode)[] = [];
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
        const placeholderPattern = new RegExp(`(\\{BLANK_\\d+\\})`, "g");
        const parts = workingSentence.split(placeholderPattern);
        parts.forEach((part) => {
          if (part.match(/^\{BLANK_\d+\}$/)) {
            const blankElement = blankElements.get(part);
            if (blankElement) {
              elements.push(blankElement);
            }
          } else if (part) {
            elements.push(part);
          }
        });
        return <>{elements}</>;
      };
      return (
        <div className="space-y-6 ">
          <div>
            <div>{renderSentenceWithBlanks()}</div>
          </div>
          {data.showFillInBlankDescription && data.fillInBlankDescription && (
            <div>
              <h5 className="font-medium text-sm">
                Description for fill in blank:
              </h5>
              <div
                className="text-gray-600  break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: data.fillInBlankDescription,
                }}
              />
            </div>
          )}
          {sortedBlanks.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Correct Answer:</h5>
              <div
                className={`${
                  data.answerLayout === "horizontal"
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
          {data.showCorrectAnswerFillInBlankDescription &&
            data.correctAnswerFillInBlankDescription && (
              <div className="space-y-2">
                <h5 className="font-medium text-sm mb-2">
                  Explanation for Correct Answer:
                </h5>
                <div
                  className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: data.correctAnswerFillInBlankDescription,
                  }}
                />
              </div>
            )}
        </div>
      );
    };
    const renderArrangementSubQuestion = (data: ArrangementData) => {
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
        if (!data.mixedWordsWithBorder) {
          return <div className="text-lg mb-4">{data.sentence}</div>;
        }
        const sentenceElements: React.ReactElement[] = [];
        const mixedWords: string[] = [];
        data.mixedWordsWithBorder.forEach((wordInfo, index) => {
          if (!wordInfo.isMixed) {
            sentenceElements.push(
              <span key={`unmixed-${index}`} className="mr-2">
                {wordInfo.word}
              </span>
            );
          } else {
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
            <div className="flex flex-wrap items-baseline">
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
          {renderPreviewSentence()}
          {data.showQuestionDescription && data.questionDescription && (
            <div>
              <h5 className="font-medium text-sm mb-2">
                Description for question:
              </h5>
              <div
                className="mt-2 text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: data.questionDescription,
                }}
              />
            </div>
          )}
        </div>
      );
    };
    const renderMultipleChoiceSubQuestion = (data: MultipleChoiceData) => {
      return (
        <div className="space-y-6">
          {data.showQuestionDescription && data.questionDescription && (
            <div>
              <h5 className="font-medium text-sm mb-2">
                Description for question:
              </h5>
              <div
                className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: data.questionDescription,
                }}
              />
            </div>
          )}

          {data.options.some((option) =>
            option.inputs.some((input) => input.text.trim() !== "")
          ) && (
            <div className="space-y-4">
              <h5 className="font-medium text-sm mb-2">Correct answer:</h5>
              <div className="space-y-2">
                {data.options.map((option) => {
                  const optionText = option.inputs
                    .map((input) => input.text)
                    .filter((text) => text.trim() !== "")
                    .join(" ");
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
          {data.showCorrectAnswerDescription &&
            data.correctAnswerDescription && (
              <div>
                <h5 className="font-medium text-sm mb-2">
                  Description for correct answer:
                </h5>
                <div
                  className="text-gray-600 text-sm break-words prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: data.correctAnswerDescription,
                  }}
                />
              </div>
            )}
        </div>
      );
    };
    const renderStandardSubQuestion = (data: SubjectiveQuestionData) => {
      return (
        <div className="space-y-4">
          {data.showQuestionDescription && data.questionDescription && (
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Description for question:
              </label>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.questionDescription,
                }}
              />
            </div>
          )}

          {data.correctAnswer && (
            <div>
              <h5 className="block text-sm font-medium text-gray-700 ">
                Correct answer:
              </h5>
              <div dangerouslySetInnerHTML={{ __html: data.correctAnswer }} />

              {data.showCorrectAnswerDescription &&
                data.correctAnswerDescription && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description for correct answer
                    </label>
                    <div className="">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data.correctAnswerDescription,
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
    const renderSubQuestionPreview = (
      question: QuestionGroupData["questions"][0]
    ) => {
      switch (question.type) {
        case QuestionMode.FILL_IN_BLANK:
          return question.fillInBlankData
            ? renderFillInBlankSubQuestion(question.fillInBlankData)
            : null;
        case QuestionMode.ARRANGING:
          return question.arrangementData
            ? renderArrangementSubQuestion(question.arrangementData)
            : null;
        case QuestionMode.MULTIPLE_CHOICE:
          return question.multipleChoiceData
            ? renderMultipleChoiceSubQuestion(question.multipleChoiceData)
            : null;
        case QuestionMode.SUBJECTIVE:
        case QuestionMode.OBJECTIVE:
          return question.subjectiveData
            ? renderStandardSubQuestion(question.subjectiveData)
            : null;
        default:
          return null;
      }
    };
    const renderIndividualQuestion = (
      question: QuestionGroupData["questions"][0],
      index: number
    ) => {
      const getQuestionTitle = () => {
        switch (question.type) {
          case QuestionMode.FILL_IN_BLANK:
            return (
              question.fillInBlankData?.sentence || "Fill in blank question"
            );
          case QuestionMode.ARRANGING:
            return question.arrangementData?.sentence || "Arrangement question";
          case QuestionMode.MULTIPLE_CHOICE:
            return (
              question.multipleChoiceData?.questionTitle ||
              "Multiple choice question"
            );
          case QuestionMode.SUBJECTIVE:
          case QuestionMode.OBJECTIVE:
            return question.subjectiveData?.questionTitle || "Question";
          default:
            return "Question";
        }
      };

      const questionTitle = getQuestionTitle();

      return (
        <div key={question.id} className="border-l-4 border-blue-200 pl-4">
          <div className="flex items-start space-x-2 mb-3">
            <span className=" font-bold flex-shrink-0">{index + 1}.</span>
            <div
              className="font-bold flex-1"
              dangerouslySetInnerHTML={{ __html: questionTitle }}
            />
          </div>
          <div className="space-y-3">{renderSubQuestionPreview(question)}</div>
        </div>
      );
    };
    return (
      <div className="space-y-6">
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
    const isLeftToRight = baseData.isLeftToRight || false;

    return (
      <div className="space-y-4">
        {baseData.questionTitle && (
          <div className={`${isLeftToRight ? "flex gap-6" : "space-y-3"}`}>
            <div className={`${isLeftToRight ? "flex-1" : ""}`}>
              <h3
                dangerouslySetInnerHTML={{ __html: baseData.questionTitle }}
              />
            </div>

            {baseData.showQuestionDescription &&
              baseData.questionDescription && (
                <div className={`${isLeftToRight ? "flex-1" : "mt-3"}`}>
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

        {baseData.correctAnswer && (
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Correct answer:
            </label>
            <div dangerouslySetInnerHTML={{ __html: baseData.correctAnswer }} />

            {baseData.showCorrectAnswerDescription &&
              baseData.correctAnswerDescription && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description for correct answer:
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
      {questionType === QuestionMode.FILL_IN_BLANK
        ? renderFillInBlankPreview()
        : questionType === QuestionMode.ARRANGING
          ? renderArrangementPreview()
          : questionType === QuestionMode.MULTIPLE_CHOICE
            ? renderMultipleChoicePreview()
            : questionType === QuestionMode.COMPOSITE
              ? renderQuestionGroupPreview()
              : renderStandardPreview()}
    </div>
  );
};
