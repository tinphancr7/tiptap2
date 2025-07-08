import React, { useState } from "react";
import {
  MdDragIndicator,
  MdSwapHoriz,
  MdSwapVert,
  MdAdd,
} from "react-icons/md";
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
import { HiDotsVertical } from "react-icons/hi";
import type {
  MultipleChoiceData,
  MultipleChoiceOption,
  MultipleChoiceInput,
} from "./types";
import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import { AiOutlinePlus } from "react-icons/ai";
import { GrFormViewHide } from "react-icons/gr";
import { FaTrashCan } from "react-icons/fa6";
interface MultipleChoiceQuestionProps {
  data: MultipleChoiceData;
  onDataChange: (data: Partial<MultipleChoiceData>) => void;
}
interface SortableOptionProps {
  option: MultipleChoiceOption;
  answerLayout: string;
  showDropdown: string | null;
  onToggleDropdown: (optionId: string | null) => void;
  onOptionCorrectChange: (optionId: string) => void;
  onDeleteOption: (optionId: string) => void;
  onInputTextChange: (
    optionId: string,
    inputId: string,
    newText: string
  ) => void;
  onAddInputToOption: (optionId: string, inputId: string) => void;
  onDeleteInputFromOption: (optionId: string, inputId: string) => void;
  optionsLength: number;
}
const SortableOption: React.FC<SortableOptionProps> = ({
  option,
  answerLayout,
  showDropdown,
  onToggleDropdown,
  onOptionCorrectChange,
  onDeleteOption,
  onInputTextChange,
  onAddInputToOption,
  onDeleteInputFromOption,
  optionsLength,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 relative transition-all duration-200 ${
        isDragging
          ? "opacity-50 shadow-xl scale-105 bg-blue-50 border border-blue-200 rounded-lg"
          : ""
      }`}
    >
      {" "}
      <div className="border flex-1 border-gray-200 rounded-lg p-4 bg-gray-50 relative">
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2 pt-2">
            <div
              {...attributes}
              {...listeners}
              className={`text-gray-400 cursor-move hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-all duration-200 ${
                isDragging ? "text-blue-500 bg-blue-100" : ""
              }`}
              title="Drag to reorder options"
            >
              <MdDragIndicator />
            </div>
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={() => onOptionCorrectChange(option.id)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <div
              className={`${
                answerLayout === "vertical"
                  ? "space-y-2"
                  : "grid grid-cols-3 gap-x-2 gap-y-2"
              }`}
            >
              {option.inputs.map((input) => (
                <div key={input.id} className="w-full">
                  <input
                    type="text"
                    value={input.text}
                    onChange={(e) =>
                      onInputTextChange(option.id, input.id, e.target.value)
                    }
                    placeholder="Enter answer option"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              {}
              {answerLayout === "horizontal" && (
                <div className="w-full flex justify-start items-center">
                  <div className="relative dropdown-menu">
                    <button
                      onClick={() =>
                        onToggleDropdown(
                          showDropdown === option.id ? null : option.id
                        )
                      }
                      className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <HiDotsVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {showDropdown === option.id && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              const lastInput =
                                option.inputs[option.inputs.length - 1];
                              onAddInputToOption(option.id, lastInput.id);
                              onToggleDropdown(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-green-600">+</span>
                            Add input field
                          </button>
                          <button
                            onClick={() => {
                              const lastInput =
                                option.inputs[option.inputs.length - 1];
                              onDeleteInputFromOption(option.id, lastInput.id);
                              onToggleDropdown(null);
                            }}
                            disabled={option.inputs.length <= 1}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="text-red-600">—</span>
                            Delete input field
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {answerLayout === "vertical" && (
              <div className="flex justify-end mt-2">
                <div className="relative dropdown-menu">
                  <button
                    onClick={() =>
                      onToggleDropdown(
                        showDropdown === option.id ? null : option.id
                      )
                    }
                    className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <HiDotsVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {showDropdown === option.id && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            const lastInput =
                              option.inputs[option.inputs.length - 1];
                            onAddInputToOption(option.id, lastInput.id);
                            onToggleDropdown(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-green-600">+</span>
                          Add input field
                        </button>
                        <button
                          onClick={() => {
                            const lastInput =
                              option.inputs[option.inputs.length - 1];
                            onDeleteInputFromOption(option.id, lastInput.id);
                            onToggleDropdown(null);
                          }}
                          disabled={option.inputs.length <= 1}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-red-600">—</span>
                          Delete input field
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => onDeleteOption(option.id)}
        disabled={optionsLength <= 2}
        className=" p-1  hover:text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete option"
      >
        <FaTrashCan size={18} />
      </button>
    </div>
  );
};
export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  data,
  onDataChange,
}) => {
  const [showQuestionDescription, setShowQuestionDescription] = useState(
    data.showQuestionDescription
  );
  const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
    useState(data.showCorrectAnswerDescription);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.options.findIndex(
        (option) => option.id === active.id
      );
      const newIndex = data.options.findIndex(
        (option) => option.id === over.id
      );
      const reorderedOptions = arrayMove(data.options, oldIndex, newIndex);
      onDataChange({ options: reorderedOptions });
    }
  };
  const handleQuestionTitleChange = (content: string) => {
    onDataChange({ questionTitle: content });
  };
  const handleQuestionDescriptionChange = (content: string) => {
    onDataChange({ questionDescription: content });
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
  const handleInputTextChange = (
    optionId: string,
    inputId: string,
    newText: string
  ) => {
    const updatedOptions = data.options.map((option) =>
      option.id === optionId
        ? {
            ...option,
            inputs: option.inputs.map((input) =>
              input.id === inputId ? { ...input, text: newText } : input
            ),
          }
        : option
    );
    onDataChange({ options: updatedOptions });
  };
  const handleOptionCorrectChange = (optionId: string) => {
    const updatedOptions = data.options.map((option) =>
      option.id === optionId
        ? { ...option, isCorrect: !option.isCorrect }
        : option
    );
    onDataChange({ options: updatedOptions });
  };
  const handleDeleteOption = (optionId: string) => {
    const updatedOptions = data.options.filter(
      (option) => option.id !== optionId
    );
    onDataChange({ options: updatedOptions });
  };
  const handleAddInputToOption = (optionId: string, inputId: string) => {
    const updatedOptions = data.options.map((option) => {
      if (option.id === optionId) {
        const inputIndex = option.inputs.findIndex(
          (input) => input.id === inputId
        );
        const newInput: MultipleChoiceInput = {
          id: Date.now().toString(),
          text: "",
        };
        const newInputs = [...option.inputs];
        newInputs.splice(inputIndex + 1, 0, newInput);
        return { ...option, inputs: newInputs };
      }
      return option;
    });
    onDataChange({ options: updatedOptions });
  };
  const handleDeleteInputFromOption = (optionId: string, inputId: string) => {
    const updatedOptions = data.options.map((option) => {
      if (option.id === optionId && option.inputs.length > 1) {
        return {
          ...option,
          inputs: option.inputs.filter((input) => input.id !== inputId),
        };
      }
      return option;
    });
    onDataChange({ options: updatedOptions });
  };
  const handleAddNewOption = () => {
    const newOption: MultipleChoiceOption = {
      id: Date.now().toString(),
      inputs: [
        {
          id: Date.now().toString() + "_input",
          text: "",
        },
      ],
      isCorrect: false,
    };
    onDataChange({ options: [...data.options, newOption] });
  };
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as Element).closest(".dropdown-menu")
      ) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);
  return (
    <div className="space-y-4">
      <div className="space-y-2 ">
        <label className="text-sm font-medium ">Description/Question</label>
        <div className="relative">
          <Toolbar />
          <div className="border p-4 space-y-2 rounded-b-lg">
            <label className="text-lg font-medium ">
              Choose correct question
            </label>
            <Editor
              placeholder="Enter your question here"
              onContentChange={handleQuestionTitleChange}
            />
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
        </div>
      </div>
      {showQuestionDescription && (
        <div className="space-y-2">
          <label
            htmlFor="question-description"
            className="text-sm font-medium "
          >
            Description for question
          </label>
          <div className="border rounded-lg ">
            <Toolbar />
            <div className="p-3">
              <Editor
                placeholder="Enter description for fill in blank"
                onContentChange={handleQuestionDescriptionChange}
              />
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Correct answer
        </label>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.options.map((option) => option.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {data.options.map((option) => (
                  <SortableOption
                    key={option.id}
                    option={option}
                    answerLayout={data.answerLayout}
                    showDropdown={showDropdown}
                    onToggleDropdown={setShowDropdown}
                    onOptionCorrectChange={handleOptionCorrectChange}
                    onDeleteOption={handleDeleteOption}
                    onInputTextChange={handleInputTextChange}
                    onAddInputToOption={handleAddInputToOption}
                    onDeleteInputFromOption={handleDeleteInputFromOption}
                    optionsLength={data.options.length}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            onClick={handleAddNewOption}
            className=" mt-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-blue-600 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group font-medium w-fit"
          >
            <MdAdd className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            Add new option
          </button>
          <div className="mt-4 flex items-center gap-2 bg-gray-50 border px-3 py-2 rounded-lg">
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
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Description for correct answer
          </label>
          <div className="border rounded-lg overflow-hidden">
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
    </div>
  );
};
