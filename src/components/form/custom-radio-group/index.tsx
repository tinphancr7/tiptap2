import { Radio, RadioGroup, RadioGroupProps } from '@heroui/react';

interface CustomRadioGroupProps extends Partial<RadioGroupProps> {
  items: {
    label: string;
    value: string;
  }[];
}

const CustomRadioGroup = ({ items, ...rests }: CustomRadioGroupProps) => {
  return (
    <RadioGroup
      orientation="horizontal"
      classNames={{
        label: 'font-semibold text-sm text-black mb-2',
        base: 'gap-1.5',
      }}
      size="sm"
      color="warning"
      {...rests}
    >
      {items.map((item) => (
        <Radio key={item.value} value={item.value}>
          <span className="text-sm ">{item.label}</span>
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default CustomRadioGroup;
