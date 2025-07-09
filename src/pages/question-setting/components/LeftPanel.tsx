import TreeMenu, { type TreeMenuItem } from "./TreeMenu";
import SubjectSelector from "./SubjectSelector";

interface LeftPanelProps {
  treeData: TreeMenuItem[];
  onItemChange: (id: string, key: string, value: unknown) => void;
  renderTreeItem: (
    item: TreeMenuItem,
    level: number,
    isExpanded: boolean,
    toggleExpand: () => void,
    onItemChange: (id: string, key: string, value: unknown) => void,
    isLastChild?: boolean
  ) => React.ReactNode;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  treeData,
  onItemChange,
  renderTreeItem,
  selectedSubject,
  onSubjectChange,
}) => {
  return (
    <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 flex flex-col h-full min-h-0">
        <h2 className="text-base font-semibold text-gray-800 mb-2 flex-shrink-0">
          Choose category
        </h2>

        <div className="mb-2 border rounded-md flex-shrink-0">
          <SubjectSelector
            selectedSubject={selectedSubject}
            onSubjectChange={onSubjectChange}
          />
        </div>

        {/* Tree Structure - scrollable content area */}
        <div className="border border-gray-200 bg-white shadow-sm flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <TreeMenu
              data={treeData}
              onItemChange={onItemChange}
              renderItem={renderTreeItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
