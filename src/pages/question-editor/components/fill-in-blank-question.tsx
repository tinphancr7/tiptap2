import EditorWithToolbar from "@/components/tiptap/editor-with-toolbar";
import React, {useState} from "react";
import {MdSwapHoriz, MdSwapVert} from "react-icons/md";

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

	const handleFillInBlankDescriptionToggle = (show: boolean) => {
		setShowFillInBlankDescription(show);
		onDataChange({showFillInBlankDescription: show});
	};

	const handleCorrectAnswerDescriptionToggle = (show: boolean) => {
		setShowCorrectAnswerDescription(show);
		onDataChange({showCorrectAnswerFillInBlankDescription: show});
	};

	const handleSentenceChange = (content: string) => {
		const plainText = content.replace(/<[^>]*>/g, "");
		onDataChange({sentence: plainText});
	};

	const handleFillInBlankDescriptionChange = (content: string) => {
		onDataChange({fillInBlankDescription: content});
	};

	const handleCorrectAnswerDescriptionChange = (content: string) => {
		onDataChange({correctAnswerFillInBlankDescription: content});
	};

	const handleTextSelected = (
		selectedText: string,
		start: number,
		end: number
	) => {
		if (selectedText.trim()) {
			const selectedTextTrimmed = selectedText.trim();

			const exactMatch = data.blanks.find(
				(blank) => blank.text === selectedTextTrimmed
			);
			if (exactMatch) {
				alert(`"${selectedTextTrimmed}" đã được thêm vào fill-in-blank rồi!`);
				return;
			}

			const overlappingBlank = data.blanks.find((blank) => {
				const selectedContainsBlank = selectedTextTrimmed.includes(blank.text);
				const blankContainsSelected = blank.text.includes(selectedTextTrimmed);

				if (selectedContainsBlank || blankContainsSelected) {
					return true;
				}

				const selectedStart = start;
				const selectedEnd = end;
				const blankStart = blank.start;
				const blankEnd = blank.end;

				const hasPositionOverlap =
					selectedStart < blankEnd && selectedEnd > blankStart;

				return hasPositionOverlap;
			});

			if (overlappingBlank) {
				alert(
					`"${selectedTextTrimmed}" có chồng lấn với blank "${overlappingBlank.text}" đã tồn tại!`
				);
				return;
			}

			const newBlank: Blank = {
				id: Date.now(),
				start,
				end,
				text: selectedTextTrimmed,
			};

			const placeholder = `{BLANK_${newBlank.id}}`;

			const newSentence = data.sentence.replace(
				selectedTextTrimmed,
				placeholder
			);

			const newBlanks = [...data.blanks, newBlank];

			onDataChange({
				blanks: newBlanks,
				sentence: newSentence,
			});
		}
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
					className="inline-flex items-center  border px-3 py-1 shadow-md rounded-full  relative mr-1"
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
				<label className="text-sm font-medium text-gray-700">
					Description/Question
				</label>
				<div className="border p-4 rounded-lg">
					<label className="text-sm font-medium text-gray-700">
						Fill in blank
					</label>

					<EditorWithToolbar
						placeholder=""
						showDescriptionToggle={true}
						onDescriptionToggle={handleFillInBlankDescriptionToggle}
						showDescription={showFillInBlankDescription}
						onContentChange={handleSentenceChange}
						onTextSelected={handleTextSelected}
						showAddToBlankButton={true}
					/>

					{data.sentence && (
						<div className="mt-4 p-3 bg-gray-50 rounded-md">
							<div className="text-sm leading-relaxed">
								{renderSentenceWithBlanks()}
							</div>
						</div>
					)}
				</div>
			</div>

			{showFillInBlankDescription && (
				<div className="space-y-4">
					<label
						htmlFor="fill-in-blank-description"
						className="text-sm font-medium text-gray-700"
					>
						Description for fill in blank
					</label>
					<EditorWithToolbar
						placeholder="Enter description for fill in blank"
						showDescriptionToggle={false}
						onContentChange={handleFillInBlankDescriptionChange}
					/>
				</div>
			)}

			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700">
					Correct answer
				</label>

				{data.blanks.length > 0 && (
					<div
						className={`flex items-start gap-5 ${
							data.answerLayout === "horizontal" ? "flex-wrap" : "flex-col"
						}`}
					>
						{getSortedBlanks().map((blank, idx) => (
							<div className="flex items-center gap-2">
								<span>({idx + 1})</span>
								<div
									key={blank.id}
									className="relative bg-[#fcfcfc] py-2 px-3 rounded-md shadow-sm border"
								>
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
						onClick={() => onDataChange({answerLayout: "horizontal"})}
					>
						<MdSwapHoriz className="h-4 w-4" />
					</button>
					<button
						className={`border rounded-full h-8 w-10 flex items-center justify-center ${
							data.answerLayout === "vertical"
								? "bg-[#BAE0FF] border-[#1677FF]"
								: "bg-[#F0F0F0]"
						}`}
						onClick={() => onDataChange({answerLayout: "vertical"})}
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
						<EditorWithToolbar
							placeholder="Enter description for correct answer here"
							showDescriptionToggle={false}
							onContentChange={handleCorrectAnswerDescriptionChange}
						/>
					</div>
				)}
			</div>
		</>
	);
};
