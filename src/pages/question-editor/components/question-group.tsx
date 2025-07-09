import React, { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { FaCirclePlus, FaTrashCan } from "react-icons/fa6";
import { AiOutlinePlus } from "react-icons/ai";
import { GrFormViewHide } from "react-icons/gr";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import CustomSelect from "@/components/form/custom-select";
import type {
  QuestionGroupData,
  QuestionGroupItem,
  QuestionType,
  SubjectiveQuestionData,
  FillInBlankData,
  ArrangementData,
  MultipleChoiceData,
} from "./types";
import { QuestionMode } from "./types";
import { SubjectiveQuestion } from "./subjective-question";
import { FillInBlankQuestion } from "./fill-in-blank-question";
import { ArrangementQuestion } from "./arrangement-question";
import { MultipleChoiceQuestion } from "./multiple-choice-question";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";
interface QuestionGroupProps {
  data: QuestionGroupData;
  onDataChange: (data: Partial<QuestionGroupData>) => void;
}
interface SortableQuestionProps {
  question: QuestionGroupItem;
  isCollapsed: boolean;
  onToggleCollapse: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onQuestionTypeChange: (
    questionId: string,
    newType: Exclude<QuestionType, typeof QuestionMode.COMPOSITE>
  ) => void;
  renderQuestionEditor: (question: QuestionGroupItem) => React.ReactNode;
  questionsLength: number;
}
interface SortableGroupSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}
const SortableGroupSection: React.FC<SortableGroupSectionProps> = ({
  id,
  children,
  className = "",
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${
        isDragging
          ? "opacity-50 shadow-xl scale-105 bg-blue-50 border border-blue-200 rounded-lg"
          : ""
      } transition-all duration-200`}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className={`mt-2 text-gray-400 cursor-move hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-all duration-200 flex-shrink-0 ${
            isDragging ? "text-blue-500 bg-blue-100" : ""
          }`}
          title="Drag to reorder sections"
        >
          <MdDragIndicator />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
const SortableQuestion: React.FC<SortableQuestionProps> = ({
  question,
  isCollapsed,
  onToggleCollapse,
  onDeleteQuestion,
  onQuestionTypeChange,
  renderQuestionEditor,
  questionsLength,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
        isCollapsed ? "bg-gray-50" : "bg-white hover:shadow-sm"
      } ${isDragging ? "opacity-50 shadow-xl scale-105 bg-blue-50 border-blue-200" : ""}`}
    >
      {}
      <div
        className={`flex items-center gap-3 transition-all duration-200 ${
          isCollapsed ? "mb-0" : "mb-4"
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className={`text-gray-400 cursor-move hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-all duration-200 ${
            isDragging ? "text-blue-500 bg-blue-100" : ""
          }`}
          title="Drag to reorder questions"
        >
          <MdDragIndicator />
        </div>
        <span className="font-medium text-gray-700">{question.title}</span>
        <div className="ml-auto flex items-center gap-3">
          <CustomSelect
            label=""
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
            ]}
            selectedKeys={[question.type]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as Exclude<
                QuestionType,
                typeof QuestionMode.COMPOSITE
              >;
              onQuestionTypeChange(question.id, selected);
            }}
            className="w-[150px]"
          />
          <button
            onClick={() => onDeleteQuestion(question.id)}
            disabled={questionsLength <= 1}
            className="p-2 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <FaTrashCan size={18} />
          </button>
          <button
            onClick={() => onToggleCollapse(question.id)}
            className="p-2  bg-gray-100 rounded-md transition-all duration-200 hover:scale-105"
            title={isCollapsed ? "Expand question" : "Collapse question"}
          >
            <div className="transition-transform duration-200 font-bold ">
              {isCollapsed ? <BsArrowsCollapse /> : <BsArrowsExpand />}
            </div>
          </button>
        </div>
      </div>
      {}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        }`}
      >
        <div className="pl-6 pb-2">{renderQuestionEditor(question)}</div>
      </div>
    </div>
  );
};
export const QuestionGroup: React.FC<QuestionGroupProps> = ({
  data,
  onDataChange,
}) => {
  const [showGroupDescription, setShowGroupDescription] = useState(
    data.showGroupDescription
  );
  const [collapsedQuestions, setCollapsedQuestions] = useState<
    Record<string, boolean>
  >({});
  const [groupSectionOrder, setGroupSectionOrder] = useState<string[]>([
    "group-title",
    "group-description",
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleGroupTitleChange = (content: string) => {
    onDataChange({ groupTitle: content });
  };
  const handleGroupDescriptionChange = (content: string) => {
    onDataChange({ groupDescription: content });
  };
  const handleGroupDescriptionToggle = (show: boolean) => {
    setShowGroupDescription(show);
    onDataChange({ showGroupDescription: show });
  };
  const toggleQuestionCollapse = (questionId: string) => {
    setCollapsedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === "group-title" || active.id === "group-description") {
      if (active.id !== over.id) {
        const oldIndex = groupSectionOrder.indexOf(active.id as string);
        const newIndex = groupSectionOrder.indexOf(over.id as string);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(groupSectionOrder, oldIndex, newIndex);
          setGroupSectionOrder(newOrder);
        }
      }
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = data.questions.findIndex((q) => q.id === active.id);
      const newIndex = data.questions.findIndex((q) => q.id === over.id);
      const reorderedQuestions = arrayMove(data.questions, oldIndex, newIndex);
      const renumberedQuestions = reorderedQuestions.map((q, index) => ({
        ...q,
        title: `Question ${index + 1}`,
      }));
      onDataChange({ questions: renumberedQuestions });
    }
  };
  const createDefaultQuestionData = (
    type: Exclude<QuestionType, typeof QuestionMode.COMPOSITE>
  ) => {
    const subjectiveData: SubjectiveQuestionData = {
      questionTitle: "",
      questionDescription: "",
      showQuestionDescription: false,
      correctAnswer: "",
      correctAnswerDescription: "",
      showCorrectAnswerDescription: false,
    };
    switch (type) {
      case QuestionMode.FILL_IN_BLANK:
        return {
          subjectiveData,
          fillInBlankData: {
            sentence: "",
            fillInBlankDescription: "",
            showFillInBlankDescription: false,
            blanks: [],
            selection: null,
            correctAnswers: new Map(),
            answerLayout: "horizontal" as const,
            correctAnswerFillInBlankDescription: "",
            showCorrectAnswerFillInBlankDescription: false,
          } as FillInBlankData,
        };
      case QuestionMode.ARRANGING:
        return {
          subjectiveData,
          arrangementData: {
            sentence: "",
            mixedWords: [],
            correctOrder: [],
            questionDescription: "",
            showQuestionDescription: false,
            correctAnswerDescription: "",
            showCorrectAnswerDescription: false,
            mixedAnswerLayout: "horizontal" as const,
            correctAnswerLayout: "horizontal" as const,
            showMixedAnswerDescription: false,
            mixedAnswerDescription: "",
            mixedWordsWithBorder: [],
            correctOrderWithBorder: [],
          } as ArrangementData,
        };
      case QuestionMode.MULTIPLE_CHOICE:
        return {
          subjectiveData,
          multipleChoiceData: {
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
            answerLayout: "horizontal" as const,
            correctAnswerDescription: "",
            showCorrectAnswerDescription: false,
          } as MultipleChoiceData,
        };
      default:
        return { subjectiveData };
    }
  };
  const handleAddQuestion = () => {
    const newQuestion: QuestionGroupItem = {
      id: Date.now().toString(),
      title: `Question ${data.questions.length + 1}`,
      type: QuestionMode.SUBJECTIVE,
      ...createDefaultQuestionData(QuestionMode.SUBJECTIVE),
    };
    onDataChange({
      questions: [...data.questions, newQuestion],
    });
  };
  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = data.questions.filter((q) => q.id !== questionId);
    const renumberedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      title: `Question ${index + 1}`,
    }));
    onDataChange({ questions: renumberedQuestions });
  };
  const handleQuestionTypeChange = (
    questionId: string,
    newType: Exclude<QuestionType, typeof QuestionMode.COMPOSITE>
  ) => {
    const updatedQuestions = data.questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          type: newType,
          ...createDefaultQuestionData(newType),
        };
      }
      return q;
    });
    onDataChange({ questions: updatedQuestions });
  };
  const handleQuestionDataChange = (
    questionId: string,
    dataType:
      | "subjectiveData"
      | "fillInBlankData"
      | "arrangementData"
      | "multipleChoiceData",
    questionData: Partial<
      | SubjectiveQuestionData
      | FillInBlankData
      | ArrangementData
      | MultipleChoiceData
    >
  ) => {
    const updatedQuestions = data.questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          [dataType]: { ...q[dataType], ...questionData },
        };
      }
      return q;
    });
    onDataChange({ questions: updatedQuestions });
  };
  const renderQuestionEditor = (question: QuestionGroupItem) => {
    switch (question.type) {
      case QuestionMode.FILL_IN_BLANK:
        return (
          <FillInBlankQuestion
            data={question.fillInBlankData!}
            onDataChange={(data) =>
              handleQuestionDataChange(question.id, "fillInBlankData", data)
            }
          />
        );
      case QuestionMode.ARRANGING:
        return (
          <ArrangementQuestion
            data={question.arrangementData!}
            onDataChange={(data) =>
              handleQuestionDataChange(question.id, "arrangementData", data)
            }
          />
        );
      case QuestionMode.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            data={question.multipleChoiceData!}
            onDataChange={(data) =>
              handleQuestionDataChange(question.id, "multipleChoiceData", data)
            }
          />
        );
      default:
        return (
          <SubjectiveQuestion
            data={question.subjectiveData!}
            onDataChange={(data) =>
              handleQuestionDataChange(question.id, "subjectiveData", data)
            }
          />
        );
    }
  };
  const renderGroupSections = () => {
    const sections = {
      "group-title": (
        <SortableGroupSection id="group-title" className="space-y-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Group Title/Description
            </label>
            <div className="space-y-2">
              <div>
                <Toolbar />
                <div className="border p-4 space-y-2 rounded-b-lg">
                  <label className="text-lg font-medium">Question Group</label>
                  <Editor
                    placeholder="Enter group title here"
                    onContentChange={handleGroupTitleChange}
                  />
                </div>
                {showGroupDescription ? (
                  <button
                    onClick={() =>
                      handleGroupDescriptionToggle(!showGroupDescription)
                    }
                    className="w-fit font-medium ml-auto text-sm h-8 flex items-center justify-center gap-1"
                  >
                    <GrFormViewHide size={16} />
                    <span className="underline">Hide description</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleGroupDescriptionToggle(!showGroupDescription)
                    }
                    className="w-fit font-medium ml-auto text-sm h-8 flex items-center justify-center gap-1"
                  >
                    <AiOutlinePlus size={16} />
                    <span className="underline">Add description</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </SortableGroupSection>
      ),
      "group-description": showGroupDescription ? (
        <SortableGroupSection id="group-description" className="space-y-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description for group
            </label>
            <div className="border rounded-lg">
              <Toolbar />
              <div className="p-3">
                <Editor
                  placeholder="Enter description for group"
                  onContentChange={handleGroupDescriptionChange}
                />
              </div>
            </div>
          </div>
        </SortableGroupSection>
      ) : null,
    };
    return groupSectionOrder
      .map((sectionId) => sections[sectionId as keyof typeof sections])
      .filter(Boolean);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <SortableContext
          items={groupSectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">{renderGroupSections()}</div>
        </SortableContext>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Questions</label>
          <SortableContext
            items={data.questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {data.questions.map((question) => (
                <SortableQuestion
                  key={question.id}
                  question={question}
                  isCollapsed={collapsedQuestions[question.id] || false}
                  onToggleCollapse={toggleQuestionCollapse}
                  onDeleteQuestion={handleDeleteQuestion}
                  onQuestionTypeChange={handleQuestionTypeChange}
                  renderQuestionEditor={renderQuestionEditor}
                  questionsLength={data.questions.length}
                />
              ))}
            </div>
          </SortableContext>

          <div className="mt-6 flex items-start gap-2">
            <div className="mt-2 text-gray-400 p-1">
              <MdDragIndicator className="opacity-0" />
            </div>
            <div className="flex-1">
              <button
                onClick={handleAddQuestion}
                className="w-fit px-4 py-2 text-white rounded-lg bg-primary transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <FaCirclePlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Add more to group
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};
