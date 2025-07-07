import React from "react";
import type {QuestionGroupData, QuestionGroupItem} from "./types";

interface QuestionGroupPreviewProps {
	data: QuestionGroupData;
}

const renderQuestionPreview = (question: QuestionGroupItem) => {
	const getQuestionTitle = () => {
		switch (question.type) {
			case "fill-in-blank":
				return question.fillInBlankData?.sentence || "Untitled Question?";
			case "arrangement":
				return question.arrangementData?.sentence || "Untitled Question?";
			case "multiple-choice":
				return (
					question.multipleChoiceData?.questionTitle || "Untitled Question?"
				);
			default:
				return question.baseData?.questionTitle || "Untitled Question?";
		}
	};

	const getQuestionDescription = () => {
		switch (question.type) {
			case "fill-in-blank":
				return question.fillInBlankData?.showFillInBlankDescription
					? question.fillInBlankData?.fillInBlankDescription
					: null;
			case "arrangement":
				return question.arrangementData?.showQuestionDescription
					? question.arrangementData?.questionDescription
					: null;
			case "multiple-choice":
				return question.multipleChoiceData?.showQuestionDescription
					? question.multipleChoiceData?.questionDescription
					: null;
			default:
				return question.baseData?.showQuestionDescription
					? question.baseData?.questionDescription
					: null;
		}
	};

	const renderAnswerOptions = () => {
		switch (question.type) {
			case "multiple-choice": {
				const mcData = question.multipleChoiceData;
				if (!mcData?.options || mcData.options.length === 0) return null;

				return (
					<div className="space-y-2">
						{mcData.options.map((option) => {
							const optionText = option.inputs
								.map((input) => input.text)
								.join(" ");
							if (!optionText.trim()) return null;

							return (
								<div key={option.id} className="flex items-center space-x-2">
									<input
										type="checkbox"
										id={`option-${option.id}`}
										className="w-4 h-4 text-blue-600 rounded border-gray-300"
										defaultChecked={option.isCorrect}
									/>
									<label
										htmlFor={`option-${option.id}`}
										className="text-sm text-gray-700"
										dangerouslySetInnerHTML={{__html: optionText}}
									/>
								</div>
							);
						})}
					</div>
				);
			}
			case "fill-in-blank": {
				const fbData = question.fillInBlankData;
				if (!fbData?.sentence) return null;

				return (
					<div className="space-y-2">
						<div className="text-sm text-gray-700">
							<div dangerouslySetInnerHTML={{__html: fbData.sentence}} />
						</div>
						{fbData.blanks.map((blank) => (
							<div key={blank.id} className="inline-block mx-1">
								<input
									type="text"
									placeholder="Fill in the blank"
									className="px-2 py-1 border border-gray-300 rounded text-sm"
								/>
							</div>
						))}
					</div>
				);
			}
			case "arrangement": {
				const arrData = question.arrangementData;
				if (!arrData?.mixedWords || arrData.mixedWords.length === 0)
					return null;

				return (
					<div className="space-y-2">
						<div className="text-sm text-gray-700">
							<div dangerouslySetInnerHTML={{__html: arrData.sentence}} />
						</div>
						<div className="flex flex-wrap gap-2">
							{arrData.mixedWords.map((word, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm cursor-pointer hover:bg-blue-200"
								>
									{word}
								</span>
							))}
						</div>
					</div>
				);
			}
			default:
				return (
					<div className="space-y-2">
						<div className="text-sm text-gray-600 italic">Correct answer</div>
						<textarea
							placeholder="Enter correct answer here"
							className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
							rows={3}
							defaultValue={question.baseData?.correctAnswer}
						/>
					</div>
				);
		}
	};

	return (
		<div className="space-y-3">
			<div className="font-medium text-gray-900">{question.title}</div>
			<div className="text-sm text-gray-700">
				<div dangerouslySetInnerHTML={{__html: getQuestionTitle()}} />
			</div>
			{getQuestionDescription() && (
				<div className="text-sm text-gray-600">
					<div
						dangerouslySetInnerHTML={{__html: getQuestionDescription() || ""}}
					/>
				</div>
			)}
			{renderAnswerOptions()}
		</div>
	);
};

export const QuestionGroupPreview: React.FC<QuestionGroupPreviewProps> = ({
	data,
}) => {
	if (!data || !data.questions || data.questions.length === 0) {
		return (
			<div className="text-gray-500 text-center py-8">
				No questions added yet
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Group Title */}
			<div className="space-y-2">
				<h2 className="text-lg font-semibold text-gray-900">
					{data.groupTitle ? (
						<div dangerouslySetInnerHTML={{__html: data.groupTitle}} />
					) : (
						"Enter title here"
					)}
				</h2>
				{data.showGroupDescription && data.groupDescription && (
					<div className="text-sm text-gray-600">
						<div dangerouslySetInnerHTML={{__html: data.groupDescription}} />
					</div>
				)}
			</div>

			{/* Questions */}
			<div className="space-y-8">
				{data.questions.map((question, index) => (
					<div key={question.id} className="border-l-4 border-blue-200 pl-4">
						<div className="flex items-center space-x-2 mb-3">
							<span className="text-sm font-medium text-blue-600">
								{index + 1}.
							</span>
							<span className="text-sm text-gray-500">{question.title}</span>
						</div>
						{renderQuestionPreview(question)}
					</div>
				))}
			</div>
		</div>
	);
};
