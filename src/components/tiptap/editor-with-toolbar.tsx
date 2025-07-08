import React, { useState, useRef, useEffect } from "react";
import Toolbar from "./toolbar";
import Editor from "./editor";
import { Button } from "@heroui/react";

interface EditorWithToolbarProps {
  placeholder?: string;
  onContentChange?: (content: string) => void;
  onTextSelected?: (selectedText: string, start: number, end: number) => void;
  showAddToBlankButton?: boolean;
  immediateTextSelection?: boolean; // New prop to control when to call onTextSelected
}

const EditorWithToolbar: React.FC<EditorWithToolbarProps> = ({
  placeholder,
  onContentChange,
  onTextSelected,
  showAddToBlankButton = false,
  immediateTextSelection = false, // Default to false for backward compatibility
}) => {
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
      // Call onTextSelected immediately for components that need it (like ArrangementQuestion)
      if (immediateTextSelection && onTextSelected) {
        onTextSelected(text.trim(), start, end);
      }

      // Only show tooltip for fill-in-blank functionality
      if (showAddToBlankButton) {
        setSelectedText({ text: text.trim(), start, end });

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
      setSelectedText(null);
      setTooltipPosition(null);

      // Call onTextSelected with empty values if using immediate selection
      if (immediateTextSelection && onTextSelected) {
        onTextSelected("", 0, 0);
      }
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
      <div className="focus-within:outline-none" tabIndex={-1}>
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

      {/* Always show toolbar */}
      <div
        className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm p-3"
        onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking on toolbar
      >
        <Toolbar />
      </div>
    </div>
  );
};

export default EditorWithToolbar;
