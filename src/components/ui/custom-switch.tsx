import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/utils/tw-merge";

interface CustomSwitchProps {
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
  label: string;
  className?: string;
  selectedColor?: string;
  unselectedColor?: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  isSelected,
  onSelectionChange,
  label,
  className,
  selectedColor = "#fb923c", // orange-400 default
  unselectedColor = "#d1d5db", // gray-300 default
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [thumbPosition, setThumbPosition] = useState({ left: 4, right: 4 });

  useEffect(() => {
    if (buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      const thumbWidth = 20; // 5 * 4 = 20px (w-5)
      const padding = 4; // 1 * 4 = 4px (top-1)

      const leftPosition = padding;
      const rightPosition = buttonWidth - thumbWidth - padding;

      setThumbPosition({
        left: leftPosition,
        right: rightPosition,
      });
    }
  }, [className]);

  return (
    <button
      ref={buttonRef}
      onClick={() => onSelectionChange(!isSelected)}
      className={cn(
        "relative inline-flex items-center justify-center h-7 w-[104px] rounded-full transition-colors duration-300 ease-in-out focus:outline-none",
        className
      )}
      style={{
        backgroundColor: isSelected ? selectedColor : unselectedColor,
      }}
    >
      {/* Single centered label */}
      <span className="text-xs font-medium text-white z-10">{label}</span>

      {/* Thumb */}
      <div
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out"
        style={{
          left: isSelected
            ? `${thumbPosition.right}px`
            : `${thumbPosition.left}px`,
        }}
      />
    </button>
  );
};

export default CustomSwitch;
