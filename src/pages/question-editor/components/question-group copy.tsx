import React, {useState} from "react";
import {MdDragIndicator, MdAdd, MdDelete} from "react-icons/md";
import {FaCirclePlus} from "react-icons/fa6";
import EditorWithToolbar from "@/components/tiptap/editor-with-toolbar";
import CustomSelect from "@/components/form/custom-select";
import type {
	QuestionGroupData,
	QuestionGroupItem,
	QuestionType,
	BaseQuestionData,
	FillInBlankData,
	ArrangementData,
	MultipleChoiceData,
} from "./types";
import {SubjectiveQuestion} from "./subjective-question";
import {FillInBlankQuestion} from "./fill-in-blank-question";
import {ArrangementQuestion} from "./arrangement-question";
import {MultipleChoiceQuestion} from "./multiple-choice-question";

interface QuestionGroupProps {
	data: QuestionGroupData;
	onDataChange: (data: Partial<QuestionGroupData>) => void;
}

export const QuestionGroup: React.FC<QuestionGroupProps> = ({
	data,
	onDataChange,
}) => {
	const [showGroupDescription, setShowGroupDescription] = useState(
		data.showGroupDescription
	);

	const handleGroupTitleChange = (content: string) => {
		onDataChange({groupTitle: content});
	};

	const handleGroupDescriptionChange = (content: string) => {
		onDataChange({groupDescription: content});
	};

	const handleGroupDescriptionToggle = (show: boolean) => {
		setShowGroupDescription(show);
		onDataChange({showGroupDescription: show});
	};

	const createDefaultQuestionData = (
		type: Exclude<QuestionType, "question-group">
	) => {
		const baseData: BaseQuestionData = {
			questionTitle: "",
			questionDescription: "",
			showQuestionDescription: false,
			correctAnswer: "",
			correctAnswerDescription: "",
			showCorrectAnswerDescription: false,
		};

		switch (type) {
			case "fill-in-blank":
				return {
					baseData,
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
			case "arrangement":
				return {
					baseData,
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
			case "multiple-choice":
				return {
					baseData,
					multipleChoiceData: {
						questionTitle: "",
						questionDescription: "",
						showQuestionDescription: false,
						options: [
							{
								id: "1",
								inputs: [{id: "1_input", text: ""}],
								isCorrect: false,
							},
							{
								id: "2",
								inputs: [{id: "2_input", text: ""}],
								isCorrect: false,
							},
						],
						answerLayout: "horizontal" as const,
						correctAnswerDescription: "",
						showCorrectAnswerDescription: false,
					} as MultipleChoiceData,
				};
			default:
				return {baseData};
		}
	};

	const handleAddQuestion = () => {
		const newQuestion: QuestionGroupItem = {
			id: Date.now().toString(),
			title: `Question ${data.questions.length + 1}`,
			type: "subjective",
			...createDefaultQuestionData("subjective"),
		};
		onDataChange({
			questions: [...data.questions, newQuestion],
		});
	};

	const handleDeleteQuestion = (questionId: string) => {
		const updatedQuestions = data.questions.filter((q) => q.id !== questionId);
		// Renumber the questions
		const renumberedQuestions = updatedQuestions.map((q, index) => ({
			...q,
			title: `Question ${index + 1}`,
		}));
		onDataChange({questions: renumberedQuestions});
	};

	const handleQuestionTypeChange = (
		questionId: string,
		newType: Exclude<QuestionType, "question-group">
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
		onDataChange({questions: updatedQuestions});
	};

	const handleQuestionDataChange = (
		questionId: string,
		dataType:
			| "baseData"
			| "fillInBlankData"
			| "arrangementData"
			| "multipleChoiceData",
		questionData: Partial<
			BaseQuestionData | FillInBlankData | ArrangementData | MultipleChoiceData
		>
	) => {
		const updatedQuestions = data.questions.map((q) => {
			if (q.id === questionId) {
				return {
					...q,
					[dataType]: {...q[dataType], ...questionData},
				};
			}
			return q;
		});
		onDataChange({questions: updatedQuestions});
	};

	const renderQuestionEditor = (question: QuestionGroupItem) => {
		const editorState = {
			questionType: question.type,
			activeEditor: null,
		};

		switch (question.type) {
			case "fill-in-blank":
				return (
					<FillInBlankQuestion
						data={question.fillInBlankData!}
						onDataChange={(data) =>
							handleQuestionDataChange(question.id, "fillInBlankData", data)
						}
					/>
				);
			case "arrangement":
				return (
					<ArrangementQuestion
						data={question.arrangementData!}
						onDataChange={(data) =>
							handleQuestionDataChange(question.id, "arrangementData", data)
						}
					/>
				);
			case "multiple-choice":
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
						editorState={editorState}
						onEditorStateChange={() => {}}
						onFocus={() => {}}
						onBlur={() => {}}
						data={question.baseData!}
						onDataChange={(data) =>
							handleQuestionDataChange(question.id, "baseData", data)
						}
					/>
				);
		}
	};

	return (
		<>
			{/* Group Title and Description */}
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700">
					Group Title/Description
				</label>
				<div className="border p-4 rounded-lg">
					<div className="mb-4">
						<h3 className="text-lg font-medium mb-2">Question Group</h3>
						<EditorWithToolbar
							placeholder="Enter group title here"
							showDescriptionToggle={true}
							onDescriptionToggle={handleGroupDescriptionToggle}
							showDescription={showGroupDescription}
							onContentChange={handleGroupTitleChange}
						/>
					</div>
				</div>
			</div>

			{showGroupDescription && (
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Description for group
					</label>
					<EditorWithToolbar
						placeholder="Enter description for group"
						showDescriptionToggle={false}
						onContentChange={handleGroupDescriptionChange}
					/>
				</div>
			)}

			{/* Questions List */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<label className="text-sm font-medium text-gray-700">Questions</label>
				</div>

				<div className="space-y-6">
					{data.questions.map((question) => (
						<div
							key={question.id}
							className="border border-gray-200 rounded-lg p-4 "
						>
							{/* Question Header */}
							<div className="flex items-center gap-3 mb-4">
								<MdDragIndicator className="text-gray-400 cursor-move" />
								<span className="font-medium text-gray-700">
									{question.title}
								</span>
								<div className="ml-auto flex items-center gap-3">
									<CustomSelect
										label=""
										items={[
											{label: "Subjective", value: "subjective"},
											{label: "Objective", value: "objective"},
											{label: "Multiple Choice", value: "multiple-choice"},
											{label: "Fill in blank", value: "fill-in-blank"},
											{label: "Arrangement", value: "arrangement"},
										]}
										selectedKeys={[question.type]}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0] as Exclude<
												QuestionType,
												"question-group"
											>;
											handleQuestionTypeChange(question.id, selected);
										}}
										className="w-[150px]"
									/>
									<button
										onClick={() => handleDeleteQuestion(question.id)}
										disabled={data.questions.length <= 1}
										className="p-2 text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<MdDelete className="w-4 h-4" />
									</button>
								</div>
							</div>

							{/* Question Content */}
							<div className="pl-6">{renderQuestionEditor(question)}</div>
						</div>
					))}
				</div>

				{/* Add more to group button - placed at bottom */}
				<div className="mt-6">
					<button
						onClick={handleAddQuestion}
						className="w-fit px-4 py-2  text-white rounded-lg bg-primary transition-all duration-300 flex items-center justify-center gap-2 group "
					>
						<FaCirclePlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
						Add more to group
					</button>
				</div>
			</div>
		</>
	);
};
