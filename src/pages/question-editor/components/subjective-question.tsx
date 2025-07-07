import React, {useState} from "react";
import EditorWithToolbar from "@/components/tiptap/editor-with-toolbar";
import CustomSwitch from "@/components/ui/custom-switch";
import type {BaseQuestionData} from "./question-preview";
import type {QuestionType} from "./types";

export type ActiveEditor =
	| "question"
	| "questionDescription"
	| "correctAnswer"
	| "correctAnswerDescription"
	| null;

export interface EditorState {
	activeEditor: ActiveEditor;
	questionType: QuestionType;
}

export interface QuestionComponentProps {
	editorState: EditorState;
	onEditorStateChange: (state: Partial<EditorState>) => void;
	onFocus: (editor: ActiveEditor) => void;
	onBlur: () => void;
}

interface SubjectiveQuestionProps extends QuestionComponentProps {
	data: BaseQuestionData;
	onDataChange: (data: Partial<BaseQuestionData>) => void;
}

export const SubjectiveQuestion: React.FC<SubjectiveQuestionProps> = ({
	data,
	onDataChange,
}) => {
	const [showQuestionDescription, setShowQuestionDescription] = useState(
		data.showQuestionDescription
	);
	const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
		useState(data.showCorrectAnswerDescription);
	const [isLandscape, setIsLandscape] = useState(false);
	const [isLeftToRight, setIsLeftToRight] = useState(true);
	const [characterLimitEnabled, setCharacterLimitEnabled] = useState(false);
	const [characterLimit, setCharacterLimit] = useState(100);

	const handleQuestionContentChange = (content: string) => {
		// Keep HTML for rich formatting in preview
		onDataChange({questionTitle: content});
	};

	const handleQuestionDescriptionChange = (content: string) => {
		onDataChange({questionDescription: content});
	};

	const handleCorrectAnswerChange = (content: string) => {
		onDataChange({correctAnswer: content});
	};

	const handleCorrectAnswerDescriptionChange = (content: string) => {
		onDataChange({correctAnswerDescription: content});
	};

	const handleQuestionDescriptionToggle = (show: boolean) => {
		setShowQuestionDescription(show);
		onDataChange({showQuestionDescription: show});
	};

	const handleCorrectAnswerDescriptionToggle = (show: boolean) => {
		setShowCorrectAnswerDescription(show);
		onDataChange({showCorrectAnswerDescription: show});
	};

	const handleCharacterLimitToggle = (enabled: boolean) => {
		setCharacterLimitEnabled(enabled);
		if (!enabled) {
			setCharacterLimit(100);
		}
	};

	const handleCharacterLimitChange = (limit: number) => {
		setCharacterLimit(limit);
	};

	return (
		<div className="space-y-4">
			{/* Subjective Editor Fields */}
			<div className="flex items-center space-x-8">
				<div className="flex items-center space-x-4">
					<label className="text-sm font-medium text-gray-700">
						Output Direction
					</label>
					<CustomSwitch
						isSelected={isLandscape}
						onSelectionChange={setIsLandscape}
						label="Landscape"
					/>
				</div>
				<div className="flex items-center space-x-4">
					<label className="text-sm font-medium text-gray-700">
						Placement Direction
					</label>
					<CustomSwitch
						isSelected={isLeftToRight}
						onSelectionChange={setIsLeftToRight}
						label="LTR"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label htmlFor="question" className="text-sm font-medium text-gray-700">
					Question
				</label>
				<EditorWithToolbar
					placeholder="Enter your question here"
					showDescriptionToggle={true}
					onDescriptionToggle={handleQuestionDescriptionToggle}
					showDescription={showQuestionDescription}
					onContentChange={handleQuestionContentChange}
				/>
			</div>

			{showQuestionDescription && (
				<div className="space-y-2">
					<label
						htmlFor="question-description"
						className="text-sm font-medium text-gray-700"
					>
						Description for question
					</label>
					<EditorWithToolbar
						placeholder="Enter description for question"
						showDescriptionToggle={false}
						onContentChange={handleQuestionDescriptionChange}
					/>
				</div>
			)}

			<div className="space-y-2">
				<label
					htmlFor="correct-answer"
					className="text-sm font-medium text-gray-700"
				>
					Correct answer
				</label>
				<EditorWithToolbar
					placeholder="Enter correct answer here"
					showDescriptionToggle={true}
					onDescriptionToggle={handleCorrectAnswerDescriptionToggle}
					showDescription={showCorrectAnswerDescription}
					onContentChange={handleCorrectAnswerChange}
				/>
			</div>

			{showCorrectAnswerDescription && (
				<div className="space-y-2">
					<label
						htmlFor="correct-answer-description"
						className="text-sm font-medium text-gray-700"
					>
						Description for correct answer
					</label>
					<EditorWithToolbar
						placeholder="Enter description for correct answer"
						showDescriptionToggle={false}
						onContentChange={handleCorrectAnswerDescriptionChange}
					/>
				</div>
			)}

			{/* Character Limit Toggle */}
			<div className="flex items-center gap-1 p-1 border rounded-full w-fit">
				{/* Toggle Button */}
				<CustomSwitch
					isSelected={characterLimitEnabled}
					onSelectionChange={handleCharacterLimitToggle}
					label="Character limit"
					className="w-[148px]"
					selectedColor="#0958D9"
					unselectedColor="#d1d5db"
				/>

				{characterLimitEnabled && (
					<div className="flex items-center  px-1">
						<input
							type="number"
							value={characterLimit}
							onChange={(e) =>
								handleCharacterLimitChange(Math.max(0, Number(e.target.value)))
							}
							className="w-10 h-7 border-0 border-b border-gray-500 rounded-none bg-transparent focus:ring-0 focus:ring-offset-0 text-center text-base font-semibold outline-none"
						/>
						<span className="text-base text-gray-700 font-normal ">
							characters
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
