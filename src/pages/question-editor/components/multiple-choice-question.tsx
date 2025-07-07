import React, {useState} from "react";
import {
	MdDragIndicator,
	MdSwapHoriz,
	MdSwapVert,
	MdClose,
	MdAdd,
} from "react-icons/md";

import {HiDotsVertical} from "react-icons/hi";
import EditorWithToolbar from "@/components/tiptap/editor-with-toolbar";
import type {
	MultipleChoiceData,
	MultipleChoiceOption,
	MultipleChoiceInput,
} from "./types";

interface MultipleChoiceQuestionProps {
	data: MultipleChoiceData;
	onDataChange: (data: Partial<MultipleChoiceData>) => void;
}

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

	const handleQuestionTitleChange = (content: string) => {
		onDataChange({questionTitle: content});
	};

	const handleQuestionDescriptionChange = (content: string) => {
		onDataChange({questionDescription: content});
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
							input.id === inputId ? {...input, text: newText} : input
						),
				  }
				: option
		);
		onDataChange({options: updatedOptions});
	};

	const handleOptionCorrectChange = (optionId: string) => {
		const updatedOptions = data.options.map((option) =>
			option.id === optionId
				? {...option, isCorrect: !option.isCorrect}
				: option
		);
		onDataChange({options: updatedOptions});
	};

	const handleDeleteOption = (optionId: string) => {
		const updatedOptions = data.options.filter(
			(option) => option.id !== optionId
		);
		onDataChange({options: updatedOptions});
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
				return {...option, inputs: newInputs};
			}
			return option;
		});
		onDataChange({options: updatedOptions});
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
		onDataChange({options: updatedOptions});
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
		onDataChange({options: [...data.options, newOption]});
	};

	// Click outside to close dropdown
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				showDropdown &&
				!(event.target as Element).closest(".dropdown-container")
			) {
				setShowDropdown(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showDropdown]);

	return (
		<>
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-700">
					Description/Question
				</label>
				<div className="border p-4 rounded-lg">
					<div className="mb-4">
						<h3 className="text-lg font-medium mb-2">
							Choose correct question
						</h3>
						<EditorWithToolbar
							placeholder="Enter your question here"
							showDescriptionToggle={true}
							onDescriptionToggle={handleQuestionDescriptionToggle}
							showDescription={showQuestionDescription}
							onContentChange={handleQuestionTitleChange}
						/>
					</div>
				</div>
			</div>

			{showQuestionDescription && (
				<div className="space-y-4">
					<label className="text-sm font-medium text-gray-700">
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
				<label className="text-sm font-medium text-gray-700">
					Correct answer
				</label>
				<div className="bg-white border border-gray-200 rounded-lg p-4">
					<div className="space-y-4">
						{data.options.map((option) => (
							<div
								key={option.id}
								className="border border-gray-200 rounded-lg p-4 bg-gray-50"
							>
								<div
									className={`${
										data.answerLayout === "vertical"
											? "space-y-2"
											: "flex flex-wrap gap-2"
									}`}
								>
									{option.inputs.map((input, inputIndex) => (
										<div
											key={input.id}
											className={`flex items-center gap-2 ${
												data.answerLayout === "vertical" ? "w-full" : ""
											}`}
										>
											{inputIndex === 0 && (
												<>
													<MdDragIndicator className="text-gray-400 cursor-move" />
													<input
														type="checkbox"
														checked={option.isCorrect}
														onChange={() =>
															handleOptionCorrectChange(option.id)
														}
														className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
													/>
												</>
											)}
											{inputIndex > 0 && <div className="w-10 h-4"></div>}
											<input
												type="text"
												value={input.text}
												onChange={(e) =>
													handleInputTextChange(
														option.id,
														input.id,
														e.target.value
													)
												}
												placeholder="Enter answer option"
												className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
											{inputIndex === option.inputs.length - 1 && (
												<>
													<button
														onClick={() => {
															const lastInput =
																option.inputs[option.inputs.length - 1];
															handleDeleteInputFromOption(
																option.id,
																lastInput.id
															);
														}}
														disabled={option.inputs.length <= 1}
														className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
													>
														<MdClose className="w-4 h-4" />
													</button>
													<div className="relative dropdown-container">
														<button
															onClick={() =>
																setShowDropdown(
																	showDropdown === option.id ? null : option.id
																)
															}
															className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
														>
															<HiDotsVertical className="w-4 h-4 text-gray-500" />
														</button>

														{showDropdown === option.id && (
															<div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
																<div className="py-1">
																	<button
																		onClick={() => {
																			const lastInput =
																				option.inputs[option.inputs.length - 1];
																			handleAddInputToOption(
																				option.id,
																				lastInput.id
																			);
																			setShowDropdown(null);
																		}}
																		className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
																	>
																		<span className="text-green-600">+</span>
																		Add input field
																	</button>
																	<button
																		onClick={() => {
																			if (data.options.length > 2) {
																				handleDeleteOption(option.id);
																			}
																			setShowDropdown(null);
																		}}
																		disabled={data.options.length <= 2}
																		className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
																	>
																		<span className="text-red-600">—</span>
																		Delete input field
																	</button>
																</div>
															</div>
														)}
													</div>
												</>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>

					<button
						onClick={handleAddNewOption}
						className=" mt-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-blue-600 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group font-medium w-fit"
					>
						<MdAdd className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
						Add new option
					</button>

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
					<EditorWithToolbar
						placeholder="Enter description for correct answer"
						showDescriptionToggle={false}
						onContentChange={handleCorrectAnswerDescriptionChange}
					/>
				</div>
			)}
		</>
	);
};
