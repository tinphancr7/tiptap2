import { cn } from "@/utils/tw-merge";
import { Input, InputProps } from "@heroui/react";

interface InputFieldProps extends Partial<InputProps> {
  isRequired?: boolean;
}
const defaultClassNames = {
  inputWrapper: "",
  label: "",
  base: "",
  input: "",
};

const InputField = ({
  label = "",
  isRequired = false,
  classNames = {},
  ...rests
}: InputFieldProps) => {
  const mergedClassNames = {
    ...defaultClassNames,
    ...classNames,
  };
  const labelString = typeof label === "string" ? label : "input";
  const inputId =
    rests.id ||
    `input-text-field-${labelString.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 inline-block text-sm font-bold"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input
        id={inputId}
        labelPlacement="outside"
        {...rests}
        variant="bordered"
        classNames={{
          base: "!mt-0",
          inputWrapper: cn(
            "h-10 w-full rounded-md border bg-white px-3 text-sm font-medium outline-none transition-all focus-within:!border-primary data-[hover=true]:!border-primary",
            mergedClassNames.inputWrapper
          ),
          input: `${rests.disabled ? "cursor-not-allowed" : ""} ${
            mergedClassNames.input
          }`.trim(),
          label: "font-semibold text-sm",
        }}
      />
    </div>
  );
};

export default InputField;
