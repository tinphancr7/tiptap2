import {useState} from "react";
import {useLocation} from "react-router-dom";
import CustomSelect from "@/components/form/custom-select";
import CategoryModal from "@/components/category-modal";
import {
	FillInBlankQuestion,
	type FillInBlankData,
} from "./components/fill-in-blank-question";
import {ArrangementQuestion} from "./components/arrangement-question";
import {MultipleChoiceQuestion} from "./components/multiple-choice-question";
import {QuestionGroup} from "./components/question-group";
import type {
	ArrangementData,
	MultipleChoiceData,
	QuestionGroupData,
} from "./components/types";
import {
	SubjectiveQuestion,
	type ActiveEditor,
	type EditorState,
} from "./components/subjective-question";
import {
	QuestionPreview,
	type BaseQuestionData,
} from "./components/question-preview";
import type {QuestionType} from "./components/types";

export default function QuestionEditor() {
	const location = useLocation();

	// Get registration data from router state
	const registrationData = location.state || {
		selectedCategory: "",
		selectedDifficulty: [],
		selectedTargetGroups: [],
		price: "",
	};

	// Editor state
	const [editorState, setEditorState] = useState<EditorState>({
		activeEditor: null,
		questionType: "question-group", // Default to multiple-choice question type
	});

	// Category state - use data from router
	const [selectedCategory, setSelectedCategory] = useState<string>(
		registrationData.selectedCategory || ""
	);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	// Base question data (for all question types)
	const [baseQuestionData, setBaseQuestionData] = useState<BaseQuestionData>({
		questionTitle: "",
		questionDescription: "",
		showQuestionDescription: false,
		correctAnswer: "",
		correctAnswerDescription: "",
		showCorrectAnswerDescription: false,
	});

	// Fill in blank specific data
	const [fillInBlankData, setFillInBlankData] = useState<FillInBlankData>({
		sentence: "",
		blanks: [],
		selection: null,
		correctAnswers: new Map(),
		fillInBlankDescription: "",
		showFillInBlankDescription: false,
		answerLayout: "horizontal",
		correctAnswerFillInBlankDescription: "",
		showCorrectAnswerFillInBlankDescription: false,
	});

	// Arrangement specific data
	const [arrangementData, setArrangementData] = useState<ArrangementData>({
		sentence: "",
		mixedWords: [],
		correctOrder: [],
		questionDescription: "",
		showQuestionDescription: false,
		correctAnswerDescription: "",
		showCorrectAnswerDescription: false,
		mixedAnswerLayout: "horizontal",
		correctAnswerLayout: "horizontal",
		showMixedAnswerDescription: false,
		mixedAnswerDescription: "",
	});

	// Multiple choice specific data
	const [multipleChoiceData, setMultipleChoiceData] =
		useState<MultipleChoiceData>({
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
			answerLayout: "horizontal",
			correctAnswerDescription: "",
			showCorrectAnswerDescription: false,
		});

	// Question Group specific data
	const [questionGroupData, setQuestionGroupData] = useState<QuestionGroupData>(
		{
			groupTitle: "",
			groupDescription: "",
			showGroupDescription: false,
			questions: [
				{
					id: "1",
					title: "Question 1",
					type: "subjective",
					baseData: {
						questionTitle: "",
						questionDescription: "",
						showQuestionDescription: false,
						correctAnswer: "",
						correctAnswerDescription: "",
						showCorrectAnswerDescription: false,
					},
				},
			],
		}
	);

	// Function to format category path
	const formatCategoryPath = (path: string) => {
		if (!path) return "Select a category...";

		const parts = path.split(" > ");
		if (parts.length <= 2) {
			return path.replace(/ > /g, " / "); // Replace > with / for short paths
		}

		// Show first part + "..." + last part with / separator
		return `${parts[0]} / ... / ${parts[parts.length - 1]}`;
	};

	const handleEditorStateChange = (state: Partial<EditorState>) => {
		setEditorState((prev) => ({...prev, ...state}));
	};

	const handleBaseQuestionDataChange = (data: Partial<BaseQuestionData>) => {
		setBaseQuestionData((prev) => ({...prev, ...data}));
	};

	const handleFillInBlankDataChange = (data: Partial<FillInBlankData>) => {
		setFillInBlankData((prev) => ({...prev, ...data}));
	};

	const handleArrangementDataChange = (data: Partial<ArrangementData>) => {
		setArrangementData((prev: ArrangementData) => ({...prev, ...data}));
	};

	const handleMultipleChoiceDataChange = (
		data: Partial<MultipleChoiceData>
	) => {
		setMultipleChoiceData((prev: MultipleChoiceData) => ({...prev, ...data}));
	};

	const handleQuestionGroupDataChange = (data: Partial<QuestionGroupData>) => {
		setQuestionGroupData((prev: QuestionGroupData) => ({...prev, ...data}));
	};

	const handleFocus = (editor: ActiveEditor) => {
		setEditorState((prev) => ({...prev, activeEditor: editor}));
	};

	const handleBlur = () => {
		// Use a timeout to allow click events on the toolbar to register
		setTimeout(() => {
			if (
				document.activeElement?.closest(".editor-toolbar-container") === null
			) {
				setEditorState((prev) => ({...prev, activeEditor: null}));
			}
		}, 100);
	};

	const handleQuestionTypeChange = (questionType: QuestionType) => {
		setEditorState((prev) => ({...prev, questionType}));
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
			{/* Left Column: Form */}
			<div className="lg:col-span-7 space-y-6">
				{/* Top Row Controls */}
				<div className="flex flex-col md:flex-row items-end gap-4">
					<div className="w-full md:flex-1">
						<label className="text-sm font-medium text-gray-700 mb-1 block">
							Choose category
						</label>
						<button
							onClick={() => setIsCategoryModalOpen(true)}
							className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-gray-300 transition-colors h-10 overflow-hidden"
						>
							<div className="flex items-center justify-between h-full">
								<span className="text-sm text-gray-700 line-clamp-1 flex-1 mr-2">
									{formatCategoryPath(selectedCategory)}
								</span>
								<svg
									className="w-4 h-4 text-gray-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
						</button>
					</div>
					<div className="w-full md:w-auto">
						<CustomSelect
							label="Difficulty"
							items={[
								{label: "1", value: "1"},
								{label: "2", value: "2"},
								{label: "3", value: "3"},
								{label: "4", value: "4"},
								{label: "5", value: "5"},
							]}
							defaultSelectedKeys={["1"]}
							className="w-full md:w-[80px]"
						/>
					</div>
					<div className="w-full md:w-auto">
						<CustomSelect
							label="Type question"
							items={[
								{label: "Subjective", value: "subjective"},
								{label: "Objective", value: "objective"},
								{label: "Multiple Choice", value: "multiple-choice"},
								{label: "Fill in blank", value: "fill-in-blank"},
								{label: "Arrangement", value: "arrangement"},
								{label: "Question Group", value: "question-group"},
							]}
							selectedKeys={[editorState.questionType]}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as QuestionType;
								handleQuestionTypeChange(selected);
							}}
							className="w-full md:w-[150px]"
						/>
					</div>
				</div>

				{/* Question Type Specific Components */}
				{editorState.questionType === "fill-in-blank" ? (
					<FillInBlankQuestion
						data={fillInBlankData}
						onDataChange={handleFillInBlankDataChange}
					/>
				) : editorState.questionType === "arrangement" ? (
					<ArrangementQuestion
						data={arrangementData}
						onDataChange={handleArrangementDataChange}
					/>
				) : editorState.questionType === "multiple-choice" ? (
					<MultipleChoiceQuestion
						data={multipleChoiceData}
						onDataChange={handleMultipleChoiceDataChange}
					/>
				) : editorState.questionType === "question-group" ? (
					<QuestionGroup
						data={questionGroupData}
						onDataChange={handleQuestionGroupDataChange}
					/>
				) : (
					<SubjectiveQuestion
						editorState={editorState}
						onEditorStateChange={handleEditorStateChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						data={baseQuestionData}
						onDataChange={handleBaseQuestionDataChange}
					/>
				)}
			</div>

			{/* Right Column: Live Preview */}
			<div className="lg:col-span-5">
				<QuestionPreview
					questionType={editorState.questionType}
					baseData={baseQuestionData}
					fillInBlankData={
						editorState.questionType === "fill-in-blank"
							? fillInBlankData
							: undefined
					}
					arrangementData={
						editorState.questionType === "arrangement"
							? arrangementData
							: undefined
					}
					multipleChoiceData={
						editorState.questionType === "multiple-choice"
							? multipleChoiceData
							: undefined
					}
					questionGroupData={
						editorState.questionType === "question-group"
							? questionGroupData
							: undefined
					}
				/>
			</div>

			{/* Category Modal */}
			<CategoryModal
				isOpen={isCategoryModalOpen}
				onClose={() => setIsCategoryModalOpen(false)}
				onConfirm={setSelectedCategory}
				initialSelectedPath={selectedCategory}
			/>
		</div>
	);
}
