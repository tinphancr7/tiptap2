import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { FaCheck } from "react-icons/fa";
import {
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
} from "react-icons/md";

export interface TreeMenuItem {
  id: string;
  label: string;
  isChecked: boolean;
  children?: TreeMenuItem[];
}

interface CategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (selectedPath: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onOpenChange,
  onApply,
}) => {
  const [treeData, setTreeData] = useState<TreeMenuItem[]>([
    {
      id: "english",
      label: "English",
      isChecked: true,
      children: [
        {
          id: "toeic",
          label: "TOEIC",
          isChecked: true,
          children: [
            {
              id: "listening",
              label: "Listening",
              isChecked: true,
              children: [
                {
                  id: "conversations",
                  label: "Part: Conversations",
                  isChecked: true,
                  children: [
                    {
                      id: "office-communication",
                      label: "Topic: Office communication",
                      isChecked: true,
                      children: [
                        {
                          id: "meeting-rescheduling",
                          label: "Context: Meeting rescheduling",
                          isChecked: true,
                          children: [
                            {
                              id: "inference-question",
                              label:
                                "Question types: What is the man's problem? (inference)",
                              isChecked: true,
                            },
                            {
                              id: "prediction-question",
                              label:
                                "Question types: What will the woman likely do next? (prediction)",
                              isChecked: false,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "short-talks",
                  label: "Part: Short Talks",
                  isChecked: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "math",
      label: "Math",
      isChecked: false,
    },
    {
      id: "history",
      label: "History",
      isChecked: false,
    },
    {
      id: "art",
      label: "Art",
      isChecked: false,
    },
  ]);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set([
      "english",
      "toeic",
      "listening",
      "conversations",
      "office-communication",
      "meeting-rescheduling",
    ])
  );

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const selectNode = (_nodeId: string, path: TreeMenuItem[]) => {
    // Uncheck all nodes first
    const uncheckAll = (items: TreeMenuItem[]): TreeMenuItem[] =>
      items.map((item) => ({
        ...item,
        isChecked: false,
        children: item.children ? uncheckAll(item.children) : undefined,
      }));

    // Check the selected path
    const checkPath = (
      items: TreeMenuItem[],
      targetPath: TreeMenuItem[]
    ): TreeMenuItem[] => {
      return items.map((item) => {
        const isInPath = targetPath.some((pathItem) => pathItem.id === item.id);
        return {
          ...item,
          isChecked: isInPath,
          children: item.children
            ? checkPath(item.children, targetPath)
            : undefined,
        };
      });
    };

    const uncheckedData = uncheckAll(treeData);
    const updatedData = checkPath(uncheckedData, path);
    setTreeData(updatedData);
  };

  const renderTreeNode = (
    node: TreeMenuItem,
    level: number = 0,
    path: TreeMenuItem[] = []
  ) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const currentPath = [...path, node];

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-2 px-2 hover:bg-gray-50 cursor-pointer ${
            level > 0 ? "ml-6" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-2 p-1"
            >
              {isExpanded ? (
                <MdKeyboardArrowDown className="w-4 h-4 text-gray-600" />
              ) : (
                <MdKeyboardArrowRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-6 mr-2" />}

          <div
            className="flex items-center flex-1"
            onClick={() => selectNode(node.id, currentPath)}
          >
            <div
              className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                node.isChecked
                  ? "bg-orange-400 border-orange-400"
                  : "border-gray-300 bg-white"
              }`}
            >
              {node.isChecked && <FaCheck className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700">{node.label}</span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) =>
              renderTreeNode(child, level + 1, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  const getSelectedPath = () => {
    const findSelectedPath = (
      items: TreeMenuItem[],
      path: string[] = []
    ): string | null => {
      for (const item of items) {
        const currentPath = [...path, item.label];
        if (item.isChecked) {
          if (item.children) {
            const childPath = findSelectedPath(item.children, currentPath);
            if (childPath) return childPath;
          }
          return currentPath.join(" / ");
        }
      }
      return null;
    };
    return findSelectedPath(treeData) || "";
  };

  const handleApply = () => {
    const selectedPath = getSelectedPath();
    onApply(selectedPath);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetData = (items: TreeMenuItem[]): TreeMenuItem[] =>
      items.map((item) => ({
        ...item,
        isChecked: false,
        children: item.children ? resetData(item.children) : undefined,
      }));

    setTreeData(resetData(treeData));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6 py-4">
              <h3 className="text-xl font-semibold">Choose category</h3>

              {/* Category Tabs */}
              <div className="flex gap-2 mt-4">
                {["English", "Math", "History", "Art", "History", "H"].map(
                  (category, index) => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        index === 0
                          ? "bg-orange-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  )
                )}
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <MdKeyboardArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  <MdKeyboardArrowRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </ModalHeader>

            <ModalBody className="px-0">
              <div className="max-h-96 overflow-y-auto px-6">
                {treeData.map((node) => renderTreeNode(node))}
              </div>
            </ModalBody>

            <ModalFooter className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between w-full">
                <Button
                  variant="light"
                  onPress={handleReset}
                  className="text-gray-600"
                >
                  Reset
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="bordered"
                    onPress={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-400 text-white"
                    onPress={handleApply}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;
