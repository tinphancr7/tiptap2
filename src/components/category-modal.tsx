import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { MdArrowRight } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useCategoryTree, type TreeMenuItem } from "@/hooks/useCategoryTree";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedPath: string) => void;
  initialSelectedPath?: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialSelectedPath,
}) => {
  const {
    treeData,
    handleItemChange,
    getSelectedCategoryPath,
    restoreSelectionFromPath,
    getPathToItem,
  } = useCategoryTree();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Helper function to expand all parent nodes for a given path
  const expandPathToItem = useCallback(
    (pathString: string) => {
      if (!pathString.trim()) return;

      const labelPath = pathString.split(" > ").map((label) => label.trim());

      // Find the item ID for the full path
      const findItemIdByLabelPath = (
        items: TreeMenuItem[],
        labelPath: string[],
        pathIndex: number = 0
      ): string | null => {
        if (pathIndex >= labelPath.length) return null;

        for (const item of items) {
          if (item.label === labelPath[pathIndex]) {
            if (pathIndex === labelPath.length - 1) {
              return item.id;
            }
            if (item.children) {
              const result = findItemIdByLabelPath(
                item.children,
                labelPath,
                pathIndex + 1
              );
              if (result) return result;
            }
          }
        }
        return null;
      };

      const targetId = findItemIdByLabelPath(treeData, labelPath);
      if (targetId) {
        const pathToItem = getPathToItem(treeData, targetId);
        if (pathToItem) {
          // Expand all parent nodes (exclude the target item itself)
          const parentsToExpand = pathToItem.slice(0, -1);
          setExpandedItems(new Set(parentsToExpand));
        }
      }
    },
    [treeData, getPathToItem]
  );

  // Sync initial selected path when modal opens
  useEffect(() => {
    if (isOpen && initialSelectedPath) {
      // Restore the selection in the tree
      restoreSelectionFromPath(initialSelectedPath);
      // Expand the tree to show the selected path
      expandPathToItem(initialSelectedPath);
    }
  }, [isOpen, initialSelectedPath, restoreSelectionFromPath, expandPathToItem]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderTreeItem = (
    item: TreeMenuItem,
    level: number = 0,
    isLastChild: boolean = false
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    const getAncestorLines = (currentLevel: number, isLastAtLevel: boolean) => {
      const lines = [];

      for (let i = 1; i <= currentLevel; i++) {
        const shouldDrawLine = i < currentLevel || !isLastAtLevel;
        lines.push(
          <div
            key={`vertical-${i}`}
            className="absolute border-l-2 border-dotted border-gray-400"
            style={{
              left: `${(i - 1) * 1.5 + 1.75}rem`,
              top: 0,
              bottom: shouldDrawLine ? 0 : "50%",
              width: "0px",
            }}
          />
        );
      }

      return lines;
    };

    const getCurrentNodeVerticalLine = () => {
      if (level === 0) return null;

      const isLastSibling = isLastChild;

      if (hasChildren && isExpanded && isLastSibling) {
        return (
          <div
            className="absolute border-l-2 border-dotted border-gray-400"
            style={{
              left: `${(level - 1) * 1.5 + 1.75}rem`,
              top: "50%",
              bottom: 0,
              width: "0px",
            }}
          />
        );
      }

      return null;
    };

    return (
      <div key={item.id}>
        <div
          className={`relative flex items-center py-3 gap-4 pr-10 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
            level === 0 ? "bg-gray-50 border-b" : ""
          }`}
          style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
          onClick={() => hasChildren && toggleExpanded(item.id)}
        >
          {getAncestorLines(level, isLastChild)}
          {getCurrentNodeVerticalLine()}

          {level > 0 && (
            <div
              className="absolute border-t-2 border-dotted border-gray-400"
              style={{
                left: `${(level - 1) * 1.5 + 1.75}rem`,
                top: "50%",
                width: "1.25rem",
                height: "0px",
              }}
            />
          )}

          <MdArrowRight
            className={`transition-transform flex-shrink-0 w-6 h-6 duration-200 ${
              hasChildren ? "" : "invisible"
            } ${isExpanded ? "rotate-90" : ""}`}
          />

          <div className="inline-flex items-center gap-1.5">
            <label
              onClick={(e) => e.stopPropagation()}
              className="flex items-center cursor-pointer relative"
            >
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={(e) =>
                  handleItemChange(item.id, "isChecked", e.target.checked)
                }
                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-500 checked:border-blue-500"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FaCheck size={14} />
              </span>
            </label>
            <span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
              {item.label}
            </span>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child, index) =>
              renderTreeItem(
                child,
                level + 1,
                index === item.children!.length - 1
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const handleConfirm = () => {
    const selectedPath = getSelectedCategoryPath();
    onConfirm(selectedPath);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">Choose Category</h3>
        </ModalHeader>
        <ModalBody>
          <div className="max-h-96 overflow-y-auto">
            {treeData.map((item, index) =>
              renderTreeItem(item, 0, index === treeData.length - 1)
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            isDisabled={!getSelectedCategoryPath()}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryModal;
