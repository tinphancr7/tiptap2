import React, {useState, useRef, useEffect} from "react";
import Toolbar from "./toolbar";
import Editor from "./editor";
import {Button} from "@heroui/react";

interface EditorWithToolbarProps {
	showDescriptionToggle?: boolean;
	onDescriptionToggle?: (show: boolean) => void;
	showDescription?: boolean;
	placeholder?: string;
	onContentChange?: (content: string) => void;
	onTextSelected?: (selectedText: string, start: number, end: number) => void;
	showAddToBlankButton?: boolean;
}

const EditorWithToolbar: React.FC<EditorWithToolbarProps> = ({
	showDescriptionToggle = false,
	onDescriptionToggle,
	showDescription = false,
	placeholder,
	onContentChange,
	onTextSelected,
	showAddToBlankButton = false,
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const [selectedText, setSelectedText] = useState<{
		text: string;
		start: number;
		end: number;
	} | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{
		top: number;
		left: number;
	} | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleDescriptionToggle = () => {
		if (onDescriptionToggle) {
			onDescriptionToggle(!showDescription);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = (e: React.FocusEvent) => {
		// Check if the new focus target is within our container or a dropdown
		const currentTarget = e.currentTarget;

		// Use setTimeout to check after the focus event has settled
		setTimeout(() => {
			const activeElement = document.activeElement;

			// Don't hide toolbar if:
			// 1. Focus is still within our container
			// 2. Focus is on a dropdown or modal element (common HeroUI patterns)
			// 3. Focus is on an element with dropdown-related classes
			if (
				currentTarget.contains(activeElement) ||
				activeElement?.closest('[role="menu"]') ||
				activeElement?.closest('[role="listbox"]') ||
				activeElement?.closest('[role="dialog"]') ||
				activeElement?.closest(".dropdown") ||
				activeElement?.closest('[data-slot="base"]') || // HeroUI dropdown base
				activeElement?.classList.contains("dropdown-trigger") ||
				activeElement?.classList.contains("dropdown-menu") ||
				activeElement?.closest(".selection-tooltip") // Don't hide when clicking on tooltip
			) {
				return;
			}

			setIsFocused(false);
			setSelectedText(null);
			setTooltipPosition(null);
		}, 0);
	};

	const getSelectionBoundingRect = () => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return null;

		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		// Get container position for relative positioning
		const containerRect = containerRef.current?.getBoundingClientRect();
		if (!containerRect) return null;

		return {
			top: rect.top - containerRect.top - 45, // Position above the selection
			left: rect.left - containerRect.left + rect.width, // Position at the end of selection
		};
	};

	const handleTextSelection = (text: string, start: number, end: number) => {
		if (text.trim()) {
			// Always call the onTextSelected callback if provided
			if (onTextSelected) {
				onTextSelected(text.trim(), start, end);
			}

			// Only show tooltip for fill-in-blank functionality
			if (showAddToBlankButton) {
				setSelectedText({text: text.trim(), start, end});

				// Get selection position after a small delay to ensure DOM is updated
				setTimeout(() => {
					const position = getSelectionBoundingRect();
					if (position) {
						setTooltipPosition(position);
					}
				}, 10);
			}
		} else {
			// Clear selection when no text is selected
			if (onTextSelected) {
				onTextSelected("", 0, 0);
			}
			setSelectedText(null);
			setTooltipPosition(null);
		}
	};

	const handleAddToBlank = () => {
		if (selectedText && onTextSelected) {
			// Call the callback with the selected text info
			onTextSelected(selectedText.text, selectedText.start, selectedText.end);

			setSelectedText(null);
			setTooltipPosition(null);
		}
	};

	// Handle click outside to close tooltip
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (
				containerRef.current &&
				!containerRef.current.contains(target) &&
				!target.closest(".selection-tooltip")
			) {
				setSelectedText(null);
				setTooltipPosition(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={containerRef}>
			<div
				onFocus={handleFocus}
				onBlur={handleBlur}
				className="focus-within:outline-none"
				tabIndex={-1}
			>
				<Editor
					placeholder={placeholder}
					onContentChange={onContentChange}
					onTextSelection={handleTextSelection}
				/>
			</div>

			{/* Selection Tooltip */}
			{selectedText && tooltipPosition && showAddToBlankButton && (
				<div
					className="selection-tooltip absolute z-50 animate-in fade-in-0 zoom-in-95 duration-200"
					style={{
						top: `${tooltipPosition.top}px`,
						left: `${tooltipPosition.left}px`,
					}}
				>
					<Button
						size="sm"
						color="primary"
						onClick={handleAddToBlank}
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
						startContent={
							<div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
								<span className="text-blue-600 text-xs font-bold">+</span>
							</div>
						}
					>
						Add to fill in blank
					</Button>
				</div>
			)}

			{isFocused && (
				<div
					className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm p-3"
					onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking on toolbar
				>
					<Toolbar />

					{showDescriptionToggle && (
						<button
							onClick={handleDescriptionToggle}
							className="px-4 py-2 mt-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							{showDescription ? "Hide Description" : "Show Description"}
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default EditorWithToolbar;
