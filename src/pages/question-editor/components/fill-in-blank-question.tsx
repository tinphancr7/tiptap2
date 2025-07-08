import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import { Button } from "@heroui/react";
import React, { useState, useRef, useEffect } from "react";
import { MdSwapHoriz, MdSwapVert } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { GrFormViewHide } from "react-icons/gr";
export type Blank = {
  id: number;
  start: number;
  end: number;
  text: string;
};

export type Selection = {
  start: number;
  end: number;
  text: string;
} | null;

export type AnswerLayout = "horizontal" | "vertical";

export interface FillInBlankData {
  sentence: string;
  blanks: Blank[];
  selection: Selection;
  correctAnswers: Map<number, string>;
  fillInBlankDescription: string;
  showFillInBlankDescription: boolean;
  answerLayout: AnswerLayout;
  correctAnswerFillInBlankDescription: string;
  showCorrectAnswerFillInBlankDescription: boolean;
}

interface FillInBlankQuestionProps {
  data: FillInBlankData;
  onDataChange: (data: Partial<FillInBlankData>) => void;
}

export const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
  data,
  onDataChange,
}) => {
  const [showFillInBlankDescription, setShowFillInBlankDescription] = useState(
    data.showFillInBlankDescription
  );
  const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
    useState(data.showCorrectAnswerFillInBlankDescription);

  // Text selection logic for fill-in-blank
  const [selectedText, setSelectedText] = useState<{
    text: string;
    start: number;
    end: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFillInBlankDescriptionToggle = (show: boolean) => {
    setShowFillInBlankDescription(show);
    onDataChange({ showFillInBlankDescription: show });
  };

  const handleCorrectAnswerDescriptionToggle = (show: boolean) => {
    setShowCorrectAnswerDescription(show);
    onDataChange({ showCorrectAnswerFillInBlankDescription: show });
  };

  const handleSentenceChange = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    onDataChange({ sentence: plainText });
  };

  const handleFillInBlankDescriptionChange = (content: string) => {
    onDataChange({ fillInBlankDescription: content });
  };

  const handleCorrectAnswerDescriptionChange = (content: string) => {
    onDataChange({ correctAnswerFillInBlankDescription: content });
  };

  // Helper function to get selection position for tooltip
  const getSelectionBoundingRect = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Get container position for relative positioning
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return null;

    return {
      top: rect.top - containerRect.top - 45, // Position above the selection
      left: rect.left - containerRect.left + rect.width, // Position at the end of selection
    };
  };

  // Handle text selection for fill-in-blank
  const handleTextSelection = (text: string, start: number, end: number) => {
    if (text.trim()) {
      // Show tooltip for fill-in-blank functionality
      setSelectedText({ text: text.trim(), start, end });

      // Get selection position after a small delay to ensure DOM is updated
      setTimeout(() => {
        const position = getSelectionBoundingRect();
        if (position) {
          setTooltipPosition(position);
        }
      }, 10);
    } else {
      // Clear selection when no text is selected
      setSelectedText(null);
      setTooltipPosition(null);
    }
  };

  // Handle adding selected text to blank
  const handleAddToBlank = () => {
    if (selectedText) {
      handleTextSelected(
        selectedText.text,
        selectedText.start,
        selectedText.end
      );
      setSelectedText(null);
      setTooltipPosition(null);
    }
  };

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest(".selection-tooltip")
      ) {
        setSelectedText(null);
        setTooltipPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // This function is called when text is selected OR when "Add to Blank" is clicked
  const handleTextSelected = (
    selectedText: string,
    start: number,
    end: number
  ) => {
    // If there's meaningful text and valid positions, this means user clicked "Add to Blank"
    if (selectedText.trim() && start >= 0 && end > start) {
      // Process the addition to blanks
      const selectedTextTrimmed = selectedText.trim();
      const currentSentence = data.sentence;

      // We'll check for exact position duplicates later, not just text duplicates
      // Allow same text at different positions

      // Find all occurrences of the selected text in the sentence
      const occurrences: { start: number; end: number }[] = [];
      let searchStart = 0;

      // First, try to find exact matches
      while (true) {
        const index = currentSentence.indexOf(selectedTextTrimmed, searchStart);
        if (index === -1) break;

        // Check if this occurrence overlaps with existing placeholders
        const beforeIndex = currentSentence.substring(0, index);

        // Check if we're completely inside a placeholder
        const beforePlaceholder = beforeIndex.lastIndexOf("{BLANK_");
        const beforePlaceholderEnd = beforeIndex.lastIndexOf("}");
        const isCompletelyInsidePlaceholder =
          beforePlaceholder > beforePlaceholderEnd && beforePlaceholder !== -1;

        // If not completely inside a placeholder, this is a valid occurrence
        if (!isCompletelyInsidePlaceholder) {
          occurrences.push({
            start: index,
            end: index + selectedTextTrimmed.length,
          });
        }

        searchStart = index + 1;
      }

      // If no exact matches found, check if text spans across placeholders
      if (occurrences.length === 0) {
        // Create a version of the sentence with placeholders replaced by original text
        let reconstructedSentence = currentSentence;
        data.blanks.forEach((blank) => {
          const placeholder = `{BLANK_${blank.id}}`;
          reconstructedSentence = reconstructedSentence.replace(
            placeholder,
            blank.text
          );
        });

        // Check if the text exists in the reconstructed sentence
        const existsInReconstructed =
          reconstructedSentence.includes(selectedTextTrimmed);

        if (existsInReconstructed) {
          alert(
            `Text "${selectedTextTrimmed}" overlap với blank hiện tại. Vui lòng xóa blank liên quan trước hoặc chọn text khác.`
          );
        } else {
          alert(
            `Không thể tìm thấy "${selectedTextTrimmed}" trong câu. Vui lòng thử chọn lại text.`
          );
        }
        return;
      }

      // Use the first available occurrence
      const { start: actualStart, end: actualEnd } = occurrences[0];

      // Check if this exact position already has a blank (overlap check)
      const positionOverlap = data.blanks.some((blank) => {
        // Check if the new blank would overlap with existing blank positions
        return (
          (actualStart >= blank.start && actualStart < blank.end) ||
          (actualEnd > blank.start && actualEnd <= blank.end) ||
          (actualStart <= blank.start && actualEnd >= blank.end)
        );
      });

      if (positionOverlap) {
        alert(
          `Text "${selectedTextTrimmed}" overlap với blank hiện tại. Vui lòng chọn vị trí khác.`
        );
        return;
      }

      const newBlank: Blank = {
        id: Date.now(),
        start: actualStart,
        end: actualEnd,
        text: selectedTextTrimmed,
      };

      const placeholder = `{BLANK_${newBlank.id}}`;

      // Use the actual positions for replacement
      const beforeText = currentSentence.substring(0, actualStart);
      const afterText = currentSentence.substring(actualEnd);
      const newSentence = beforeText + placeholder + afterText;

      const newBlanks = [...data.blanks, newBlank];

      onDataChange({
        blanks: newBlanks,
        sentence: newSentence,
        selection: null, // Clear selection after adding
      });
    } else {
      // Just store the selection info for potential use (when just selecting text)
      onDataChange({
        selection: selectedText.trim()
          ? {
              start,
              end,
              text: selectedText.trim(),
            }
          : null,
      });
    }
  };

  // Function to handle clicking on a blank to remove it
  const handleRemoveBlank = (blankToRemove: Blank) => {
    const placeholder = `{BLANK_${blankToRemove.id}}`;

    // Replace the placeholder back with the original text
    const newSentence = data.sentence.replace(placeholder, blankToRemove.text);

    // Remove the blank from the array
    const newBlanks = data.blanks.filter(
      (blank) => blank.id !== blankToRemove.id
    );

    // Update positions of remaining blanks if needed
    const updatedBlanks = newBlanks.map((blank) => {
      const blankPlaceholder = `{BLANK_${blank.id}}`;
      const blankPosition = newSentence.indexOf(blankPlaceholder);

      if (blankPosition !== -1) {
        return {
          ...blank,
          start: blankPosition,
          end: blankPosition + blank.text.length,
        };
      }

      return blank;
    });

    onDataChange({
      blanks: updatedBlanks,
      sentence: newSentence,
      selection: null,
    });
  };

  const getSortedBlanks = () => {
    return [...data.blanks].sort((a, b) => {
      const aIndex = data.sentence.indexOf(`{BLANK_${a.id}}`);
      const bIndex = data.sentence.indexOf(`{BLANK_${b.id}}`);
      return aIndex - bIndex;
    });
  };

  const renderSentenceWithBlanks = () => {
    if (!data.sentence)
      return <span className="text-gray-400">Enter text above...</span>;

    if (data.blanks.length === 0) {
      return <span>{data.sentence}</span>;
    }

    const workingSentence = data.sentence;
    const elements: (string | React.ReactNode)[] = [];

    const sortedBlanks = getSortedBlanks();

    const blankElements = new Map<string, React.ReactNode>();

    sortedBlanks.forEach((blank, index) => {
      const placeholder = `{BLANK_${blank.id}}`;
      const blankNumber = index + 1;

      const blankElement = (
        <span
          key={blank.id}
          className="inline-flex items-center border px-3 py-1 shadow-md rounded-full relative mr-1 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors"
          onClick={() => handleRemoveBlank(blank)}
          title="Click to remove this blank and restore original text"
        >
          {blank.text}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {blankNumber}
          </span>
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
    <>
      <div className="space-y-2 ">
        <label className="text-sm font-medium ">Description/Question</label>
        <div className="relative" ref={containerRef}>
          <Toolbar />
          <div className="border p-4 space-y-2 rounded-b-lg">
            <label className="text-lg font-medium ">Fill in blank</label>

            <Editor
              placeholder="Enter your fill in blank question here"
              onContentChange={handleSentenceChange}
              onTextSelection={handleTextSelection}
            />

            {/* Selection Tooltip */}
            {selectedText && tooltipPosition && (
              <div
                className="selection-tooltip absolute z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                }}
              >
                <Button
                  size="sm"
                  color="primary"
                  onClick={handleAddToBlank}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
                  startContent={
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">+</span>
                    </div>
                  }
                >
                  Add to fill in blank
                </Button>
              </div>
            )}

            {data.sentence && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="leading-relaxed">
                  {renderSentenceWithBlanks()}
                </div>
              </div>
            )}
            {showFillInBlankDescription ? (
              <button
                onClick={() =>
                  handleFillInBlankDescriptionToggle(
                    !showFillInBlankDescription
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
                  handleFillInBlankDescriptionToggle(
                    !showFillInBlankDescription
                  )
                }
                className=" w-fit font-medium ml-auto  text-sm h-8  flex items-center justify-center gap-1"
              >
                <AiOutlinePlus size={16} />
                <span className="underline"> Add description</span>
              </button>
            )}
            {/* <button
              onClick={() =>
                handleFillInBlankDescriptionToggle(!showFillInBlankDescription)
              }
              className=" w-fit font-medium ml-auto  text-sm h-8  flex items-center justify-center gap-1"
            >
              <AiOutlinePlus size={16} />
              <span className="underline"> Add description</span>
            </button> */}
          </div>
        </div>
      </div>

      {showFillInBlankDescription && (
        <div className="space-y-4">
          <label
            htmlFor="fill-in-blank-description"
            className="text-sm font-medium "
          >
            Description for fill in blank
          </label>
          <div className="border rounded-lg ">
            <Toolbar />
            <div className="p-3">
              <Editor
                placeholder="Enter description for fill in blank"
                onContentChange={handleFillInBlankDescriptionChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium ">Correct answer</label>

        {data.blanks.length > 0 && (
          <div
            className={`flex items-start gap-5 ${
              data.answerLayout === "horizontal" ? "flex-wrap" : "flex-col"
            }`}
          >
            {getSortedBlanks().map((blank, idx) => (
              <div key={blank.id} className="flex items-center gap-2">
                <span>({idx + 1})</span>
                <div className="relative bg-[#fcfcfc] py-2 px-3 rounded-md shadow-sm border">
                  <div className="bg-white border border-gray-200 rounded-full px-3 py-1 flex items-center justify-center shadow-md relative">
                    <span className="text-gray-800">{blank.text}</span>
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-[#ff0000] text-white text-xs font-bold rounded-full">
                      {idx + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center gap-2 bg-[#F0F0F0] px-3 py-2 rounded-md">
          <button
            className={`border rounded-full h-8 w-10 flex items-center justify-center ${
              data.answerLayout === "horizontal"
                ? "bg-[#BAE0FF] border-[#1677FF]"
                : "bg-[#F0F0F0]"
            }`}
            onClick={() => onDataChange({ answerLayout: "horizontal" })}
          >
            <MdSwapHoriz className="h-4 w-4" />
          </button>
          <button
            className={`border rounded-full h-8 w-10 flex items-center justify-center ${
              data.answerLayout === "vertical"
                ? "bg-[#BAE0FF] border-[#1677FF]"
                : "bg-[#F0F0F0]"
            }`}
            onClick={() => onDataChange({ answerLayout: "vertical" })}
          >
            <MdSwapVert className="h-4 w-4" />
          </button>
          <button
            className="border rounded-full w-fit font-medium shadow-lg  text-sm h-8 px-3 bg-white flex items-center justify-center"
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
        {showCorrectAnswerDescription && (
          <div className="mt-4">
            <div>
              <Toolbar />
              <div className="border rounded-b-lg p-4">
                <Editor
                  placeholder="Enter description for correct answer here"
                  onContentChange={handleCorrectAnswerDescriptionChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
