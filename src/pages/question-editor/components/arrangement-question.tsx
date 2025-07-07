import React, {useState} from "react";
import {MdSwapHoriz, MdSwapVert} from "react-icons/md";
import EditorWithToolbar from "@/components/tiptap/editor-with-toolbar";
import type {ArrangementData} from "./types";
import {FaRandom} from "react-icons/fa";

interface ArrangementQuestionProps {
	data: ArrangementData;
	onDataChange: (data: Partial<ArrangementData>) => void;
}

export const ArrangementQuestion: React.FC<ArrangementQuestionProps> = ({
	data,
	onDataChange,
}) => {
	const [showQuestionDescription, setShowQuestionDescription] = useState(
		data.showQuestionDescription
	);
	const [showMixedAnswerDescription, setShowMixedAnswerDescription] = useState(
		data.showMixedAnswerDescription
	);
	const [showCorrectAnswerDescription, setShowCorrectAnswerDescription] =
		useState(data.showCorrectAnswerDescription);
	const [textSelection, setTextSelection] = useState<{
		start: number;
		end: number;
		text: string;
	} | null>(null);

	const handleQuestionDescriptionToggle = (show: boolean) => {
		setShowQuestionDescription(show);
		onDataChange({showQuestionDescription: show});
	};

	const handleMixedAnswerDescriptionToggle = (show: boolean) => {
		setShowMixedAnswerDescription(show);
		onDataChange({showMixedAnswerDescription: show});
	};

	const handleCorrectAnswerDescriptionToggle = (show: boolean) => {
		setShowCorrectAnswerDescription(show);
		onDataChange({showCorrectAnswerDescription: show});
	};

	const handleSentenceChange = (content: string) => {
		const plainText = content.replace(/<[^>]*>/g, "");
		const words = plainText.trim() ? plainText.trim().split(/\s+/) : [];

		onDataChange({
			sentence: plainText,
			correctOrder: words,
			mixedWords: [], // Không tự động tạo mixedWords, chỉ tạo khi bấm Mix
		});
	};

	const handleTextSelection = (
		selectedText: string,
		start: number,
		end: number
	) => {
		if (selectedText.trim()) {
			setTextSelection({
				start,
				end,
				text: selectedText,
			});
		} else {
			setTextSelection(null);
		}
	};

	const handleQuestionDescriptionChange = (content: string) => {
		onDataChange({questionDescription: content});
	};

	const handleMixedAnswerDescriptionChange = (content: string) => {
		onDataChange({mixedAnswerDescription: content});
	};

	const handleCorrectAnswerDescriptionChange = (content: string) => {
		onDataChange({correctAnswerDescription: content});
	};

	const handleMixWords = () => {
		if (!textSelection || !textSelection.text.trim()) return;

		// Chỉ trộn những từ trong vùng text được bôi đen
		const selectedText = textSelection.text.trim();
		const selectedWords = selectedText.split(/\s+/);
		const shuffled = [...selectedWords];

		// Trộn các từ đã chọn
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		// Thay thế phần text được chọn bằng phần đã trộn
		const mixedText = shuffled.join(" ");
		const mixedSentence = data.sentence.replace(selectedText, mixedText);

		// Tách toàn bộ câu đã trộn thành từng từ để hiển thị
		const allMixedWords = mixedSentence.trim().split(/\s+/);

		// Tìm vị trí của phần text được chọn trong câu gốc
		const originalWords = data.sentence.trim().split(/\s+/);
		const selectedStartIndex = originalWords.findIndex((word, index) => {
			const remainingWords = originalWords.slice(
				index,
				index + selectedWords.length
			);
			return remainingWords.join(" ") === selectedText;
		});

		// Tạo object để đánh dấu từ nào được mix (có border)
		const mixedWordsWithBorder = allMixedWords.map((word, index) => ({
			word,
			index,
			isMixed:
				selectedStartIndex >= 0 &&
				index >= selectedStartIndex &&
				index < selectedStartIndex + selectedWords.length,
		}));

		// Tạo array để đánh dấu từ nào trong câu gốc được mix
		const correctOrderWithBorder = originalWords.map((word, index) => ({
			word,
			index,
			isMixed:
				selectedStartIndex >= 0 &&
				index >= selectedStartIndex &&
				index < selectedStartIndex + selectedWords.length,
		}));

		onDataChange({
			mixedWords: allMixedWords,
			correctOrder: data.sentence.trim().split(/\s+/), // Giữ nguyên thứ tự đúng gốc
			mixedWordsWithBorder, // Thông tin về từ nào được mix trong mixed answer
			correctOrderWithBorder, // Thông tin về từ nào được mix trong correct answer
		});
		setTextSelection(null);
	};

	const WordToken = ({word, className}: {word: string; className?: string}) => (
		<div
			className={`inline-block bg-gray-100 border border-gray-300 rounded px-3 py-1 text-sm ${
				className || ""
			}`}
		>
			{word}
		</div>
	);

	return (
		<>
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700">
					Description/Question
				</label>
				<div className="border p-4 rounded-lg">
					<div className="mb-4 relative">
						<h3 className="text-lg font-medium mb-2">
							Rearrange this sentence
						</h3>
						<div className="relative">
							<EditorWithToolbar
								placeholder="Enter the sentence to be rearranged"
								showDescriptionToggle={true}
								onDescriptionToggle={handleQuestionDescriptionToggle}
								showDescription={showQuestionDescription}
								onContentChange={handleSentenceChange}
								onTextSelected={handleTextSelection}
							/>
							{textSelection && (
								<button
									onClick={handleMixWords}
									disabled={data.correctOrder.length === 0}
									className="absolute bg-[#4068F6] text-white px-3 h-8 rounded-full shadow-lg z-10 whitespace-nowrap pointer-events-auto flex items-center justify-center hover:bg-[#3558E0] disabled:opacity-50 gap-1 disabled:cursor-not-allowed"
									style={{
										left: `${Math.min(textSelection.end * 7 + 10, 300)}px`,
										top: "-35px",
									}}
								>
									<FaRandom />
									Mix
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{showQuestionDescription && (
				<div className="space-y-4">
					<label className="text-sm font-medium text-gray-700">
						Description for question
					</label>
					<EditorWithToolbar
						placeholder="Enter description for the rearrangement question"
						showDescriptionToggle={false}
						onContentChange={handleQuestionDescriptionChange}
					/>
				</div>
			)}

			{data.mixedWords.length > 0 && (
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Mixed answer
					</label>
					<div className="bg-white border border-gray-200 rounded-lg p-4">
						<div
							className={`flex flex-wrap items-center ${
								data.mixedAnswerLayout === "vertical"
									? "flex-col items-start"
									: ""
							}`}
						>
							{data.mixedWordsWithBorder
								? data.mixedWordsWithBorder.map((wordInfo, index) =>
										wordInfo.isMixed ? (
											<WordToken
												key={`mixed-${index}`}
												word={wordInfo.word}
												className="border m-1 rounded-full bg-white shadow-lg"
											/>
										) : (
											<span
												key={`mixed-${index}`}
												className="inline-block text-sm px-1"
											>
												{wordInfo.word}
											</span>
										)
								  )
								: data.mixedWords.map((word, index) => (
										<WordToken key={`mixed-${index}`} word={word} />
								  ))}
						</div>
						<div className="mt-4 flex items-center gap-2 bg-[#F0F0F0] px-3 py-2 rounded-md">
							<button
								className={`border rounded-full h-8 w-10 flex items-center justify-center ${
									data.mixedAnswerLayout === "horizontal"
										? "bg-[#BAE0FF] border-[#1677FF]"
										: "bg-[#F0F0F0]"
								}`}
								onClick={() => onDataChange({mixedAnswerLayout: "horizontal"})}
							>
								<MdSwapHoriz className="h-4 w-4" />
							</button>
							<button
								className={`border rounded-full h-8 w-10 flex items-center justify-center ${
									data.mixedAnswerLayout === "vertical"
										? "bg-[#BAE0FF] border-[#1677FF]"
										: "bg-[#F0F0F0]"
								}`}
								onClick={() => onDataChange({mixedAnswerLayout: "vertical"})}
							>
								<MdSwapVert className="h-4 w-4" />
							</button>
							<button
								onClick={() => {
									// Remix chỉ trộn lại phần đã mix trước đó
									if (!data.mixedWordsWithBorder) return;

									// Tách ra những từ đã được mix và những từ chưa mix
									const mixedWords = data.mixedWordsWithBorder
										.filter((wordInfo) => wordInfo.isMixed)
										.map((wordInfo) => wordInfo.word);

									// Trộn lại chỉ những từ đã được mix
									const shuffledMixedWords = [...mixedWords];
									for (let i = shuffledMixedWords.length - 1; i > 0; i--) {
										const j = Math.floor(Math.random() * (i + 1));
										[shuffledMixedWords[i], shuffledMixedWords[j]] = [
											shuffledMixedWords[j],
											shuffledMixedWords[i],
										];
									}

									// Tạo lại array với những từ đã remix
									let mixedWordIndex = 0;
									const newMixedWords: string[] = [];
									const newMixedWordsWithBorder = data.mixedWordsWithBorder.map(
										(wordInfo) => {
											if (wordInfo.isMixed) {
												const remixedWord = shuffledMixedWords[mixedWordIndex];
												mixedWordIndex++;
												newMixedWords.push(remixedWord);
												return {
													...wordInfo,
													word: remixedWord,
												};
											} else {
												newMixedWords.push(wordInfo.word);
												return wordInfo;
											}
										}
									);

									onDataChange({
										mixedWords: newMixedWords,
										mixedWordsWithBorder: newMixedWordsWithBorder,
									});
								}}
								disabled={data.mixedWords.length === 0}
								className="border rounded-full gap-1 w-fit font-medium shadow-lg text-sm h-8 px-3 bg-white flex items-center justify-center"
							>
								Remix
								<FaRandom />
							</button>
							<button
								className="border rounded-full w-fit font-medium shadow-lg text-sm h-8 px-3 bg-white flex items-center justify-center"
								onClick={() =>
									handleMixedAnswerDescriptionToggle(
										!showMixedAnswerDescription
									)
								}
							>
								{showMixedAnswerDescription
									? "Hide description"
									: "Show description"}
							</button>
						</div>
					</div>

					{showMixedAnswerDescription && (
						<div className="mt-4">
							<EditorWithToolbar
								placeholder="Enter description for mixed answer here"
								showDescriptionToggle={false}
								onContentChange={handleMixedAnswerDescriptionChange}
							/>
						</div>
					)}
				</div>
			)}

			{data.mixedWords.length > 0 && data.correctOrder.length > 0 && (
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Correct answer
					</label>
					<div className="bg-white border border-gray-200 rounded-lg p-4">
						<div
							className={`flex flex-wrap items-center ${
								data.correctAnswerLayout === "vertical"
									? "flex-col items-start"
									: ""
							}`}
						>
							{data.correctOrderWithBorder
								? data.correctOrderWithBorder.map((wordInfo, index) =>
										wordInfo.isMixed ? (
											<WordToken
												key={`correct-${index}`}
												word={wordInfo.word}
												className="border m-1 rounded-full bg-white shadow-lg"
											/>
										) : (
											<span
												key={`correct-${index}`}
												className="inline-block text-sm px-1"
											>
												{wordInfo.word}
											</span>
										)
								  )
								: data.correctOrder.map((word, index) => (
										<WordToken
											key={`correct-${index}`}
											word={word}
											className="bg-green-50 border-green-200"
										/>
								  ))}
						</div>
						<div className="mt-4 flex items-center gap-2 bg-[#F0F0F0] px-3 py-2 rounded-md">
							<button
								className={`border rounded-full h-8 w-10 flex items-center justify-center ${
									data.correctAnswerLayout === "horizontal"
										? "bg-[#BAE0FF] border-[#1677FF]"
										: "bg-[#F0F0F0]"
								}`}
								onClick={() =>
									onDataChange({correctAnswerLayout: "horizontal"})
								}
							>
								<MdSwapHoriz className="h-4 w-4" />
							</button>
							<button
								className={`border rounded-full h-8 w-10 flex items-center justify-center ${
									data.correctAnswerLayout === "vertical"
										? "bg-[#BAE0FF] border-[#1677FF]"
										: "bg-[#F0F0F0]"
								}`}
								onClick={() => onDataChange({correctAnswerLayout: "vertical"})}
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
			)}
		</>
	);
};
