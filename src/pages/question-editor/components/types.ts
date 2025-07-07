export type QuestionType =
	| "subjective"
	| "objective"
	| "multiple-choice"
	| "fill-in-blank"
	| "arrangement"
	| "question-group";

export type ActiveEditor =
	| "question"
	| "questionDescription"
	| "correctAnswer"
	| "correctAnswerDescription"
	| "fillInBlank"
	| "fillInBlankDescription"
	| "correctAnswerFillInBlankDescription"
	| "arrangement"
	| "arrangementDescription"
	| "correctAnswerArrangementDescription"
	| null;

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

// Common question data interface
export interface BaseQuestionData {
	questionTitle: string;
	questionDescription: string;
	showQuestionDescription: boolean;
	correctAnswer: string;
	correctAnswerDescription: string;
	showCorrectAnswerDescription: boolean;
}

// Fill in blank specific data
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

// Arrangement specific data
export interface ArrangementData {
	sentence: string;
	mixedWords: string[];
	correctOrder: string[];
	questionDescription: string;
	showQuestionDescription: boolean;
	correctAnswerDescription: string;
	showCorrectAnswerDescription: boolean;
	mixedAnswerLayout: AnswerLayout;
	correctAnswerLayout: AnswerLayout;
	showMixedAnswerDescription: boolean;
	mixedAnswerDescription: string;
	mixedWordsWithBorder?: Array<{
		word: string;
		index: number;
		isMixed: boolean;
	}>;
	correctOrderWithBorder?: Array<{
		word: string;
		index: number;
		isMixed: boolean;
	}>;
}

// Multiple choice specific data
export interface MultipleChoiceInput {
	id: string;
	text: string;
}

export interface MultipleChoiceOption {
	id: string;
	inputs: MultipleChoiceInput[];
	isCorrect: boolean;
}

export interface MultipleChoiceData {
	questionTitle: string;
	questionDescription: string;
	showQuestionDescription: boolean;
	options: MultipleChoiceOption[];
	answerLayout: AnswerLayout;
	correctAnswerDescription: string;
	showCorrectAnswerDescription: boolean;
}

// Question Group specific data
export interface QuestionGroupItem {
	id: string;
	title: string;
	type: Exclude<QuestionType, "question-group">;
	baseData?: BaseQuestionData;
	fillInBlankData?: FillInBlankData;
	arrangementData?: ArrangementData;
	multipleChoiceData?: MultipleChoiceData;
}

export interface QuestionGroupData {
	groupTitle: string;
	groupDescription: string;
	showGroupDescription: boolean;
	questions: QuestionGroupItem[];
}

// Editor state interface
export interface EditorState {
	activeEditor: ActiveEditor;
	questionType: QuestionType;
}

// Common props for question components
export interface QuestionComponentProps {
	editorState: EditorState;
	onEditorStateChange: (state: Partial<EditorState>) => void;
	onFocus: (editor: ActiveEditor) => void;
	onBlur: () => void;
}
