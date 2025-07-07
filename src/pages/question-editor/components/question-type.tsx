import React, { useState, useMemo, useRef } from "react";
import {
  Select,
  SelectItem,
  Button,
  Input,
  Textarea,
  Switch,
} from "@heroui/react";
import { MdAdd, MdSwapHoriz, MdSwapVert } from "react-icons/md";
import CustomSelect from "@/components/form/custom-select";
import InputField from "@/components/form/input-field";

type ActiveEditor =
  | "question"
  | "questionDescription"
  | "correctAnswer"
  | "correctAnswerDescription"
  | "fillInBlank"
  | "fillInBlankDescription"
  | "correctAnswerFillInBlankDescription"
  | null;

type Blank = {
  id: number;
  start: number;
  end: number;
  text: string;
};

type Selection = {
  start: number;
  end: number;
  text: string;
} | null;

// Simple EditorToolbar component
const EditorToolbar = ({
  showDescriptionToggleButton = false,
  isDescriptionShown = false,
  onToggleDescription,
}: {
  showDescriptionToggleButton?: boolean;
  isDescriptionShown?: boolean;
  onToggleDescription?: () => void;
}) => {
  return (
    <div className="flex items-center justify-end gap-2 mt-2 border-t pt-2">
      {showDescriptionToggleButton && (
        <Button variant="bordered" size="sm" onClick={onToggleDescription}>
          {isDescriptionShown ? "Hide description" : "Show description"}
        </Button>
      )}
    </div>
  );
};

export default function QuestionEditor() {
  // State for standard question types
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [showQuestionDescription, setShowQuestionDescription] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [correctAnswerDescription, setCorrectAnswerDescription] = useState("");
  const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
    useState(false);

  // Common state
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null);
  const [questionType, setQuestionType] = useState("fill-in-blank");

  // State for Fill in Blank question type
  const [sentence, setSentence] = useState(
    "The sun rises in the east and sets in the west"
  );
  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [correctAnswers, setCorrectAnswers] = useState<Map<number, string>>(
    new Map()
  );
  const [fillInBlankDescription, setFillInBlankDescription] = useState("");
  const [showFillInBlankDescription, setShowFillInBlankDescription] =
    useState(false);
  const [answerLayout, setAnswerLayout] = useState<"horizontal" | "vertical">(
    "horizontal"
  );
  const [
    correctAnswerFillInBlankDescription,
    setCorrectAnswerFillInBlankDescription,
  ] = useState("");
  const [
    showCorrectAnswerFillInBlankDescription,
    setShowCorrectAnswerFillInBlankDescription,
  ] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const sortedBlanks = useMemo(() => {
    return [...blanks].sort((a, b) => a.start - b.start);
  }, [blanks]);

  const handleSelection = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      setSelection({ start, end, text: sentence.substring(start, end) });
    } else {
      setSelection(null);
    }
  };

  const addBlank = () => {
    if (!selection) return;

    // Prevent overlapping blanks
    const isOverlapping = blanks.some(
      (blank) => selection.start < blank.end && selection.end > blank.start
    );
    if (isOverlapping) {
      alert("Cannot create overlapping blanks.");
      return;
    }

    const newBlankId =
      (blanks.length > 0 ? Math.max(...blanks.map((b) => b.id)) : 0) + 1;
    const newBlank: Blank = { ...selection, id: newBlankId };
    setBlanks([...blanks, newBlank]);
    setCorrectAnswers((prev) => new Map(prev).set(newBlankId, newBlank.text));
    setSelection(null);
  };

  const removeBlank = (id: number) => {
    setBlanks(blanks.filter((b) => b.id !== id));
    setCorrectAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.delete(id);
      return newAnswers;
    });
  };

  const handleAnswerChange = (blankId: number, value: string) => {
    setCorrectAnswers((prev) => new Map(prev).set(blankId, value));
  };

  const renderSentenceWithBlanks = () => {
    if (blanks.length === 0) {
      // Return an array so callers can always .map over the result
      return [<span key="full-sentence">{sentence}</span>];
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedBlanks.forEach((blank, index) => {
      // Text before the blank
      if (blank.start > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {sentence.substring(lastIndex, blank.start)}
          </span>
        );
      }
      // The blank itself
      parts.push(
        <span
          key={`blank-${blank.id}`}
          className="cursor-pointer relative inline-block bg-gray-100 rounded-full px-3 py-1 border border-gray-300"
          onClick={() => removeBlank(blank.id)}
        >
          {blank.text}
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full">
            {index + 1}
          </span>
        </span>
      );
      lastIndex = blank.end;
    });

    // Text after the last blank
    if (lastIndex < sentence.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{sentence.substring(lastIndex)}</span>
      );
    }

    return parts;
  };

  const handleFocus = (editor: ActiveEditor) => {
    setActiveEditor(editor);
  };

  const handleBlur = () => {
    // Use a timeout to allow click events on the toolbar to register
    setTimeout(() => {
      if (
        document.activeElement?.closest(".editor-toolbar-container") === null
      ) {
        setActiveEditor(null);
      }
    }, 100);
  };

  const handleToggleQuestionDescription = () => {
    setShowQuestionDescription(!showQuestionDescription);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
  };

  const handleToggleCorrectAnswerDescription = () => {
    setShowCorrectAnswerDescription(!showCorrectAnswerDescription);
  };

  const handleToggleFillInBlankDescription = () => {
    setShowFillInBlankDescription(!showFillInBlankDescription);
  };

  const handleToggleCorrectAnswerFillInBlankDescription = () => {
    setShowCorrectAnswerFillInBlankDescription(
      !showCorrectAnswerFillInBlankDescription
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* Left Column: Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Top Row Controls */}
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Choose category
            </label>
            <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-sm font-medium">English</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-sm font-medium">...</span>
              <span className="mx-2 text-gray-400">/</span>
              <Select
                defaultSelectedKeys={["problem"]}
                className="w-full"
                variant="bordered"
              >
                <SelectItem key="problem">
                  Question types: What is the man's prob...
                </SelectItem>
                <SelectItem key="summary">
                  Question types: Summarize the text
                </SelectItem>
              </Select>
            </div>
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
                { label: "Subjective", value: "subjective" },
                { label: "Objective", value: "objective" },
                { label: "Multiple Choice", value: "multiple-choice" },
                { label: "Fill in blank", value: "fill-in-blank" },
              ]}
              selectedKeys={[questionType]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setQuestionType(selected);
              }}
              className="w-full md:w-[150px]"
            />
          </div>
        </div>

        {questionType === "fill-in-blank" ? (
          <>
            {/* Fill in Blank Editor Fields */}
            <div className="space-y-2" ref={editorRef}>
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Description/Question
                </label>
              </div>
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 relative"
                onFocus={() => handleFocus("fillInBlank")}
                onBlur={handleBlur}
              >
                {selection && (
                  <Button
                    onClick={addBlank}
                    className="absolute z-10 -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg"
                  >
                    <MdAdd className="w-4 h-4 mr-2" />
                    Add to fill in blank
                  </Button>
                )}
                <h3 className="font-semibold text-lg mb-2">Fill in blank</h3>
                <Textarea
                  placeholder="Type your sentence here..."
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  onSelect={handleSelection}
                  className="w-full min-h-[100px] text-lg border-none shadow-none focus-visible:ring-0"
                />
                <div className="mt-4 p-2 bg-gray-50 rounded min-h-[60px]">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg">
                    {renderSentenceWithBlanks()}
                  </div>
                </div>
                <div className="editor-toolbar-container">
                  {activeEditor === "fillInBlank" && (
                    <EditorToolbar
                      showDescriptionToggleButton={true}
                      isDescriptionShown={showFillInBlankDescription}
                      onToggleDescription={handleToggleFillInBlankDescription}
                    />
                  )}
                </div>
              </div>
            </div>

            {showFillInBlankDescription && (
              <div className="space-y-2">
                <label
                  htmlFor="fill-in-blank-description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description for fill in blank
                </label>
                <div
                  className="bg-white border border-gray-200 rounded-lg p-2"
                  onFocus={() => handleFocus("fillInBlankDescription")}
                  onBlur={handleBlur}
                >
                  <Textarea
                    id="fill-in-blank-description"
                    placeholder="Enter description here"
                    className="border-none shadow-none focus-visible:ring-0 min-h-[120px]"
                    value={fillInBlankDescription}
                    onChange={(e) =>
                      handleDescriptionChange(e, setFillInBlankDescription)
                    }
                  />
                  <div className="editor-toolbar-container">
                    {activeEditor === "fillInBlankDescription" && (
                      <EditorToolbar />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Correct answer
              </label>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div
                  className={`flex items-start gap-4 ${
                    answerLayout === "horizontal" ? "flex-wrap" : "flex-col"
                  }`}
                >
                  {sortedBlanks.map((blank, idx) => (
                    <div
                      key={blank.id}
                      className="relative bg-[#fcfcfc] p-1.5 rounded-xl shadow-sm"
                    >
                      <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center justify-center min-h-[38px]">
                        <span className="text-gray-800">
                          {correctAnswers.get(blank.id) || ""}
                        </span>
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-[#ff0000] text-white text-xs font-bold rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                  {sortedBlanks.length > 0 && (
                    <div className="bg-[#fcfcfc] p-1.5 rounded-xl shadow-sm min-h-[56px] w-24">
                      <div className="bg-white border border-gray-200 rounded-full h-full w-full" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant={
                      answerLayout === "horizontal" ? "solid" : "bordered"
                    }
                    size="sm"
                    isIconOnly
                    onClick={() => setAnswerLayout("horizontal")}
                  >
                    <MdSwapHoriz className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={answerLayout === "vertical" ? "solid" : "bordered"}
                    size="sm"
                    isIconOnly
                    onClick={() => setAnswerLayout("vertical")}
                  >
                    <MdSwapVert className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="bordered"
                    size="sm"
                    onClick={handleToggleCorrectAnswerFillInBlankDescription}
                  >
                    {showCorrectAnswerFillInBlankDescription
                      ? "Hide description"
                      : "Show description"}
                  </Button>
                </div>
                {showCorrectAnswerFillInBlankDescription && (
                  <div
                    className="mt-4 bg-white border border-gray-200 rounded-lg p-2"
                    onFocus={() =>
                      handleFocus("correctAnswerFillInBlankDescription")
                    }
                    onBlur={handleBlur}
                  >
                    <Textarea
                      id="correct-answer-fill-in-blank-description"
                      placeholder="Enter description for correct answer here"
                      className="border-none shadow-none focus-visible:ring-0 min-h-[120px]"
                      value={correctAnswerFillInBlankDescription}
                      onChange={(e) =>
                        setCorrectAnswerFillInBlankDescription(e.target.value)
                      }
                    />
                    <div className="editor-toolbar-container">
                      {activeEditor ===
                        "correctAnswerFillInBlankDescription" && (
                        <EditorToolbar />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Standard Editor Fields */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="output-direction"
                  className="text-sm font-medium text-gray-700"
                >
                  Output Direction
                </label>
                <Switch id="output-direction" />
                <span className="text-sm text-gray-500">Landscape</span>
              </div>
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="placement-direction"
                  className="text-sm font-medium text-gray-700"
                >
                  Placement Direction
                </label>
                <Switch id="placement-direction" defaultSelected />
                <span className="text-sm text-gray-500">Left to right</span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="question"
                className="text-sm font-medium text-gray-700"
              >
                Question
              </label>
              <div
                className="bg-white border border-gray-200 rounded-lg p-2"
                onFocus={() => handleFocus("question")}
                onBlur={handleBlur}
              >
                <Textarea
                  id="question"
                  placeholder="Enter title here"
                  className="border-none shadow-none focus-visible:ring-0 min-h-[80px]"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                />
                <div className="editor-toolbar-container">
                  {activeEditor === "question" && (
                    <EditorToolbar
                      showDescriptionToggleButton={true}
                      isDescriptionShown={showQuestionDescription}
                      onToggleDescription={handleToggleQuestionDescription}
                    />
                  )}
                </div>
              </div>
            </div>

            {showQuestionDescription && (
              <div className="space-y-2">
                <label
                  htmlFor="question-description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description for question
                </label>
                <div
                  className="bg-white border border-gray-200 rounded-lg p-2"
                  onFocus={() => handleFocus("questionDescription")}
                  onBlur={handleBlur}
                >
                  <Textarea
                    id="question-description"
                    placeholder="Enter description here"
                    className="border-none shadow-none focus-visible:ring-0 min-h-[120px]"
                    value={questionDescription}
                    onChange={(e) =>
                      handleDescriptionChange(e, setQuestionDescription)
                    }
                  />
                  <div className="editor-toolbar-container">
                    {activeEditor === "questionDescription" && (
                      <EditorToolbar />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="correct-answer"
                className="text-sm font-medium text-gray-700"
              >
                Correct answer
              </label>
              <div
                className="bg-white border border-gray-200 rounded-lg p-2"
                onFocus={() => handleFocus("correctAnswer")}
                onBlur={handleBlur}
              >
                <Textarea
                  id="correct-answer"
                  placeholder="Enter correct answer here"
                  className="border-none shadow-none focus-visible:ring-0 min-h-[100px]"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                />
                <div className="editor-toolbar-container">
                  {activeEditor === "correctAnswer" && (
                    <EditorToolbar
                      showDescriptionToggleButton={true}
                      isDescriptionShown={showCorrectAnswerDescription}
                      onToggleDescription={handleToggleCorrectAnswerDescription}
                    />
                  )}
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
                <div
                  className="bg-white border border-gray-200 rounded-lg p-2"
                  onFocus={() => handleFocus("correctAnswerDescription")}
                  onBlur={handleBlur}
                >
                  <Textarea
                    id="correct-answer-description"
                    placeholder="Enter description here"
                    className="border-none shadow-none focus-visible:ring-0 min-h-[120px]"
                    value={correctAnswerDescription}
                    onChange={(e) =>
                      handleDescriptionChange(e, setCorrectAnswerDescription)
                    }
                  />
                  <div className="editor-toolbar-container">
                    {activeEditor === "correctAnswerDescription" && (
                      <EditorToolbar />
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Column: Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
          {questionType === "fill-in-blank" ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Fill in blank</h3>
                <div className="flex flex-wrap items-end gap-x-2 gap-y-4 text-lg leading-9">
                  {renderSentenceWithBlanks().map((part, index) => {
                    if (
                      React.isValidElement(part) &&
                      part.key &&
                      typeof part.key === "string" &&
                      part.key.startsWith("blank-")
                    ) {
                      const blankIndex = sortedBlanks.findIndex(
                        (b) => `blank-${b.id}` === part.key
                      );
                      return (
                        <div
                          key={index}
                          className="inline-flex flex-col items-center"
                        >
                          <span className="text-xs -mb-1">
                            ({blankIndex + 1})
                          </span>
                          <span className="border-b-2 border-gray-800 w-20 inline-block" />
                        </div>
                      );
                    }
                    return part;
                  })}
                </div>
                {showFillInBlankDescription && fillInBlankDescription && (
                  <p className="mt-2 text-gray-600 text-sm break-words">
                    {fillInBlankDescription}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {sortedBlanks.map((blank, idx) => (
                  <div key={blank.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">({idx + 1})</span>
                    <Input
                      type="text"
                      placeholder="Enter answer"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold break-words">
                  {questionTitle || "Enter title here"}
                </h3>
                {questionDescription && (
                  <p className="mt-2 text-gray-600 text-sm break-words">
                    {questionDescription}
                  </p>
                )}
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800">
                  Correct Answer
                </h4>
                <div className="mt-2 text-sm text-gray-600 break-words">
                  {correctAnswer || (
                    <span className="text-gray-400">
                      Correct answer not set.
                    </span>
                  )}
                </div>
                {correctAnswerDescription && (
                  <div className="mt-2 text-xs text-gray-500 break-words">
                    <p className="font-semibold">Description:</p>
                    {correctAnswerDescription}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
