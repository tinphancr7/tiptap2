export const QuestionMode = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  SUBJECTIVE: "SUBJECTIVE",
  OBJECTIVE: "OBJECTIVE",
  ARRANGING: "ARRANGING",
  COMPOSITE: "COMPOSITE",
  FILL_IN_BLANK: "FILL_IN_BLANK",
} as const;
export type QuestionType =
  | typeof QuestionMode.SUBJECTIVE
  | typeof QuestionMode.OBJECTIVE
  | typeof QuestionMode.MULTIPLE_CHOICE
  | typeof QuestionMode.FILL_IN_BLANK
  | typeof QuestionMode.ARRANGING
  | typeof QuestionMode.COMPOSITE;
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
export interface SubjectiveQuestionData {
  questionTitle: string;
  questionDescription: string;
  showQuestionDescription: boolean;
  correctAnswer: string;
  correctAnswerDescription: string;
  showCorrectAnswerDescription: boolean;
}
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
export interface QuestionGroupItem {
  id: string;
  title: string;
  type: Exclude<QuestionType, typeof QuestionMode.COMPOSITE>;
  subjectiveData?: SubjectiveQuestionData;
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
