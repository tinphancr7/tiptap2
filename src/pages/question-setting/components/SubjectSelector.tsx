import { useRef } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

interface SubjectSelectorProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubject,
  onSubjectChange,
}) => {
  const categories = [
    { key: "english", label: "English" },
    { key: "math", label: "Math" },
    { key: "history", label: "History" },
    { key: "art", label: "Art" },
    { key: "science", label: "Science" },
    { key: "geography", label: "Geography" },
    { key: "music", label: "Music" },
    { key: "physics", label: "Physics" },
    { key: "chemistry", label: "Chemistry" },
    { key: "biology", label: "Biology" },
    { key: "literature", label: "Literature" },
    { key: "economics", label: "Economics" },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryKey: string) => {
    onSubjectChange(categoryKey);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex items-center overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-x-auto whitespace-nowrap scrollbar-hide px-1 py-3 "
        style={{ scrollBehavior: "smooth" }}
      >
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => handleCategoryClick(category.key)}
            className={`
            p-2.5 h-[44px] mx-1 rounded-lg transition-all duration-300 ease-in-out
            ${
              selectedSubject === category.key
                ? "bg-amber-500 text-white shadow-md"
                : "bg-[#F3F3F3] text-gray-700 hover:bg-gray-300"
            }
            flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-300
          `}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="flex  h-full">
        <button
          onClick={scrollLeft}
          className="p-2 rounded-full text-gray-500 bg-transparent hover:bg-gray-100 focus:outline-none  transition duration-200"
          aria-label="Scroll left"
        >
          <MdArrowLeft size={20} />
        </button>
        <button
          onClick={scrollRight}
          className="p-2 rounded-full bg-transparent text-gray-500 hover:bg-gray-100 focus:outline-none  transition duration-200"
          aria-label="Scroll right"
        >
          <MdArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
export default SubjectSelector;
