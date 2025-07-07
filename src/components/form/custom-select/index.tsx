import React, { useMemo } from "react";
import { Select, SelectItem, SelectProps } from "@heroui/react";
import { cn } from "@/utils/tw-merge";

interface CustomSelectProps extends Partial<SelectProps> {
  items?: { label: string; value: string | number }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label = "",
  isRequired = false,
  items = [],
  classNames = {},
  placeholder,
  ...rests
}) => {
  const mergedClassNames = useMemo(
    () => ({
      ...classNames,
      trigger: cn(
        "h-12 rounded-md border border-gray-300 bg-white  px-3 text-sm font-medium outline-none transition-all  data-[hover=true]:!border-primary ",
        classNames.trigger
      ),

      label: cn("font-semibold text-white", classNames.label),
    }),
    [classNames]
  );

  return (
    <div>
      {label && (
        <label htmlFor="" className="mb-1.5 inline-block text-sm font-semibold">
          {isRequired ? (
            <>
              {label} <span className="text-red-500">*</span>
            </>
          ) : (
            label
          )}
        </label>
      )}

      <Select
        variant="bordered"
        isMultiline
        labelPlacement="outside"
        placeholder={placeholder || "Select an option"}
        {...rests}
        classNames={mergedClassNames}
      >
        {items.map((item) => (
          <SelectItem
            key={item.value}
            className="data-[hover=true]:!bg-primary/20 data-[hover=true]:!text-primary data-[hover=true]:transition-colors data-[selectable=true]:focus:!bg-primary/20 data-[selectable=true]:focus:!text-primary"
            classNames={{
              title: "font-medium",
              selectedIcon: "font-medium",
            }}
          >
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default CustomSelect;
