interface PriceInputProps {
  price: string;
  onPriceChange: (price: string) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ price, onPriceChange }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Price</h3>
      <div className="relative">
        <input
          type="text"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="0"
          className="w-[167px] pl-8 pr-3 py-3 border border-gray-200 rounded-md focus:outline-none  focus:ring-primary focus:border-primary text-gray-700"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          ₩
        </span>
      </div>
    </div>
  );
};

export default PriceInput;
