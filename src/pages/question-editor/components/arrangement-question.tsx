import React, { useState } from "react";
import { MdSwapHoriz, MdSwapVert } from "react-icons/md";
import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import type { ArrangementData } from "./types";
import { FaRandom } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { GrFormViewHide } from "react-icons/gr";
interface ArrangementQuestionProps {
  data: ArrangementData;
  onDataChange: (data: Partial<ArrangementData>) => void;
}
export const ArrangementQuestion: React.FC<ArrangementQuestionProps> = ({
  data,
  onDataChange,
}) => {
  const [showQuestionDescription, setShowQuestionDescription] = useState(
    data.showQuestionDescription
  );
  const [showMixedAnswerDescription, setShowMixedAnswerDescription] = useState(
    data.showMixedAnswerDescription
  );
  const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
    useState(data.showCorrectAnswerDescription);
  const [textSelection, setTextSelection] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [mixedRegions, setMixedRegions] = useState<
    Array<{
      start: number;
      end: number;
      text: string;
    }>
  >([]);
  const handleQuestionDescriptionToggle = (show: boolean) => {
    setShowQuestionDescription(show);
    onDataChange({ showQuestionDescription: show });
  };
  const handleMixedAnswerDescriptionToggle = (show: boolean) => {
    setShowMixedAnswerDescription(show);
    onDataChange({ showMixedAnswerDescription: show });
  };
  const handleCorrectAnswerDescriptionToggle = (show: boolean) => {
    setShowCorrectAnswerDescription(show);
    onDataChange({ showCorrectAnswerDescription: show });
  };
  const handleSentenceChange = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    const words = plainText.trim() ? plainText.trim().split(/\s+/) : [];
    onDataChange({
      sentence: plainText,
      correctOrder: words,
      mixedWords: [], // Reset mixed words when sentence changes
      mixedWordsWithBorder: undefined,
      correctOrderWithBorder: undefined,
    });
    setMixedRegions([]);
    setWarningMessage("");
  };
  const handleTextSelection = (
    selectedText: string,
    start: number,
    end: number
  ) => {
    if (selectedText.trim()) {
      setTextSelection({
        start,
        end,
        text: selectedText,
      });
    } else {
      setTextSelection(null);
    }
  };
  const handleQuestionDescriptionChange = (content: string) => {
    onDataChange({ questionDescription: content });
  };
  const handleMixedAnswerDescriptionChange = (content: string) => {
    onDataChange({ mixedAnswerDescription: content });
  };
  const handleCorrectAnswerDescriptionChange = (content: string) => {
    onDataChange({ correctAnswerDescription: content });
  };
  const handleMixWords = () => {
    if (!textSelection || !textSelection.text.trim()) return;
    const selectedText = textSelection.text.trim();
    const selectedWords = selectedText.split(/\s+/);
    const originalWords = data.sentence.trim().split(/\s+/);
    const selectedStartIndex = originalWords.findIndex((_, index) => {
      const remainingWords = originalWords.slice(
        index,
        index + selectedWords.length
      );
      return remainingWords.join(" ") === selectedText;
    });
    if (selectedStartIndex === -1) {
      setWarningMessage("Cannot find selected text in the sentence");
      setTimeout(() => setWarningMessage(""), 3000);
      return;
    }
    const selectedEndIndex = selectedStartIndex + selectedWords.length - 1;
    const hasOverlap = mixedRegions.some((region) => {
      return !(
        selectedEndIndex < region.start || selectedStartIndex > region.end
      );
    });
    if (hasOverlap) {
      setWarningMessage(
        "This text region overlaps with previously mixed text. Please select a different region."
      );
      setTimeout(() => setWarningMessage(""), 3000);
      return;
    }
    const shuffled = [...selectedWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const newMixedWords = [...originalWords];
    for (let i = 0; i < selectedWords.length; i++) {
      newMixedWords[selectedStartIndex + i] = shuffled[i];
    }
    const newMixedRegions = [
      ...mixedRegions,
      {
        start: selectedStartIndex,
        end: selectedEndIndex,
        text: selectedText,
      },
    ];
    const mixedWordsWithBorder = newMixedWords.map((word, index) => ({
      word,
      index,
      isMixed: newMixedRegions.some(
        (region) => index >= region.start && index <= region.end
      ),
    }));
    const correctOrderWithBorder = originalWords.map((word, index) => ({
      word,
      index,
      isMixed: newMixedRegions.some(
        (region) => index >= region.start && index <= region.end
      ),
    }));
    onDataChange({
      mixedWords: newMixedWords,
      correctOrder: originalWords, // Keep original order
      mixedWordsWithBorder,
      correctOrderWithBorder,
    });
    setMixedRegions(newMixedRegions);
    setTextSelection(null);
    setWarningMessage("");
  };
  const WordToken = ({
    word,
    className,
  }: {
    word: string;
    className?: string;
  }) => (
    <div
      className={`inline-block bg-gray-100 border border-gray-300 rounded px-3 py-1 text-sm ${
        className || ""
      }`}
    >
      {word}
    </div>
  );
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Description/Question
        </label>
        <div>
          <Toolbar />
          <div className="border p-4 space-y-2 rounded-b-lg">
            <label className="text-lg font-medium ">
              Rearrange this sentence
            </label>
            <div className="relative">
              <Editor
                placeholder="Enter the sentence to be rearranged"
                onContentChange={handleSentenceChange}
                onTextSelection={handleTextSelection}
              />
              {textSelection && (
                <button
                  onClick={handleMixWords}
                  disabled={data.correctOrder.length === 0}
                  className="absolute bg-[#4068F6] text-white px-3 h-8 rounded-full shadow-lg z-10 whitespace-nowrap pointer-events-auto flex items-center justify-center hover:bg-[#3558E0] disabled:opacity-50 gap-1 disabled:cursor-not-allowed"
                  style={{
                    left: `${Math.min(textSelection.end * 7 + 10, 300)}px`,
                    top: "-35px",
                  }}
                >
                  <FaRandom />
                  Mix
                </button>
              )}
              {warningMessage && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-md text-sm z-20">
                  {warningMessage}
                </div>
              )}
            </div>
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
            <label className="text-sm font-medium text-gray-700">
              Description for question
            </label>
            <div className="border rounded-lg overflow-hidden">
              <Toolbar />
              <div className="p-3">
                <Editor
                  placeholder="Enter description for the rearrangement question"
                  onContentChange={handleQuestionDescriptionChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {data.mixedWords.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mixed answer
            </label>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div
                className={`flex flex-wrap items-center ${
                  data.mixedAnswerLayout === "vertical"
                    ? "flex-col items-start"
                    : ""
                }`}
              >
                {data.mixedWordsWithBorder
                  ? data.mixedWordsWithBorder.map((wordInfo, index) =>
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
                  : data.mixedWords.map((word, index) => (
                      <WordToken key={`mixed-${index}`} word={word} />
                    ))}
              </div>
              <div className="mt-4 flex items-center gap-2 bg-[#F0F0F0] px-3 py-2 rounded-md">
                <button
                  className={`border rounded-full h-8 w-10 flex items-center justify-center ${
                    data.mixedAnswerLayout === "horizontal"
                      ? "bg-[#BAE0FF] border-[#1677FF]"
                      : "bg-[#F0F0F0]"
                  }`}
                  onClick={() =>
                    onDataChange({ mixedAnswerLayout: "horizontal" })
                  }
                >
                  <MdSwapHoriz className="h-4 w-4" />
                </button>
                <button
                  className={`border rounded-full h-8 w-10 flex items-center justify-center ${
                    data.mixedAnswerLayout === "vertical"
                      ? "bg-[#BAE0FF] border-[#1677FF]"
                      : "bg-[#F0F0F0]"
                  }`}
                  onClick={() =>
                    onDataChange({ mixedAnswerLayout: "vertical" })
                  }
                >
                  <MdSwapVert className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (!data.mixedWordsWithBorder || mixedRegions.length === 0)
                      return;
                    const newMixedWords = [...data.correctOrder];
                    const allMixedWords: string[] = [];
                    const allMixedPositions: number[] = [];
                    mixedRegions.forEach((region) => {
                      for (let i = region.start; i <= region.end; i++) {
                        allMixedWords.push(data.correctOrder[i]);
                        allMixedPositions.push(i);
                      }
                    });
                    const shuffledMixedWords = [...allMixedWords];
                    for (let i = shuffledMixedWords.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [shuffledMixedWords[i], shuffledMixedWords[j]] = [
                        shuffledMixedWords[j],
                        shuffledMixedWords[i],
                      ];
                    }
                    shuffledMixedWords.forEach((word, index) => {
                      newMixedWords[allMixedPositions[index]] = word;
                    });
                    const mixedWordsWithBorder = newMixedWords.map(
                      (word, index) => ({
                        word,
                        index,
                        isMixed: mixedRegions.some(
                          (region) =>
                            index >= region.start && index <= region.end
                        ),
                      })
                    );
                    onDataChange({
                      mixedWords: newMixedWords,
                      mixedWordsWithBorder,
                    });
                  }}
                  disabled={data.mixedWords.length === 0}
                  className="border rounded-full gap-1 w-fit font-medium shadow-lg text-sm h-8 px-3 bg-white flex items-center justify-center"
                >
                  Remix
                  <FaRandom />
                </button>
                <button
                  onClick={() => {
                    setMixedRegions([]);
                    onDataChange({
                      mixedWords: [],
                      mixedWordsWithBorder: undefined,
                      correctOrderWithBorder: undefined,
                    });
                    setWarningMessage("");
                  }}
                  disabled={mixedRegions.length === 0}
                  className="border rounded-full gap-1 w-fit font-medium shadow-lg text-sm h-8 px-3 bg-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset All
                </button>
                <button
                  className="border rounded-full w-fit font-medium shadow-lg text-sm h-8 px-3 bg-white flex items-center justify-center"
                  onClick={() =>
                    handleMixedAnswerDescriptionToggle(
                      !showMixedAnswerDescription
                    )
                  }
                >
                  {showMixedAnswerDescription
                    ? "Hide description"
                    : "Show description"}
                </button>
              </div>
            </div>
          </div>
          {showMixedAnswerDescription && (
            <div className="space-y-2">
              <label
                htmlFor="mixed-answer-description"
                className="text-sm font-medium text-gray-700"
              >
                Description for mixed answer
              </label>
              <div className="border rounded-lg overflow-hidden">
                <Toolbar />
                <div className="p-3">
                  <Editor
                    placeholder="Enter description for mixed answer here"
                    onContentChange={handleMixedAnswerDescriptionChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {data.mixedWords.length > 0 && data.correctOrder.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Correct answer
            </label>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div
                className={`flex flex-wrap items-center ${
                  data.correctAnswerLayout === "vertical"
                    ? "flex-col items-start"
                    : ""
                }`}
              >
                {data.correctOrderWithBorder
                  ? data.correctOrderWithBorder.map((wordInfo, index) =>
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
                  : data.correctOrder.map((word, index) => (
                      <WordToken
                        key={`correct-${index}`}
                        word={word}
                        className="bg-green-50 border-green-200"
                      />
                    ))}
              </div>
              <div className="mt-4 flex items-center gap-2 bg-[#F0F0F0] px-3 py-2 rounded-md">
                <button
                  className={`border rounded-full h-8 w-10 flex items-center justify-center ${
                    data.correctAnswerLayout === "horizontal"
                      ? "bg-[#BAE0FF] border-[#1677FF]"
                      : "bg-[#F0F0F0]"
                  }`}
                  onClick={() =>
                    onDataChange({ correctAnswerLayout: "horizontal" })
                  }
                >
                  <MdSwapHoriz className="h-4 w-4" />
                </button>
                <button
                  className={`border rounded-full h-8 w-10 flex items-center justify-center ${
                    data.correctAnswerLayout === "vertical"
                      ? "bg-[#BAE0FF] border-[#1677FF]"
                      : "bg-[#F0F0F0]"
                  }`}
                  onClick={() =>
                    onDataChange({ correctAnswerLayout: "vertical" })
                  }
                >
                  <MdSwapVert className="h-4 w-4" />
                </button>
                <button
                  className="border rounded-full w-fit font-medium shadow-lg text-sm h-8 px-3 bg-white flex items-center justify-center"
                  onClick={() =>
                    handleCorrectAnswerDescriptionToggle(
                      !showCorrectAnswerDescription
                    )
                  }
                >
                  {showCorrectAnswerDescription
                    ? "Hide description"
                    : "Show description"}
                </button>
              </div>
            </div>
          </div>
          {showCorrectAnswerDescription && (
            <div className="space-y-2">
              <label
                htmlFor="correct-answer-description"
                className="text-sm font-medium text-gray-700"
              >
                Description for correct answer
              </label>
              <div className="border rounded-lg overflow-hidden">
                <Toolbar />
                <div className="p-3">
                  <Editor
                    placeholder="Enter description for correct answer here"
                    onContentChange={handleCorrectAnswerDescriptionChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
