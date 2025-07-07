import { useState } from "react";

export interface TreeMenuItem {
  id: string;
  label: string;
  isChecked: boolean;
  children?: TreeMenuItem[];
}

// Initial tree data
const initialTreeData: TreeMenuItem[] = [
  {
    id: "toeic",
    label: "TOEIC",
    isChecked: false,
    children: [
      {
        id: "listening",
        label: "Listening",
        isChecked: false,
        children: [
          {
            id: "conversations",
            label: "Part: Conversations",
            isChecked: false,
            children: [
              {
                id: "office-communication",
                label: "Topic: Office communication",
                isChecked: false,
                children: [
                  {
                    id: "meeting-rescheduling",
                    label: "Context: Meeting rescheduling",
                    isChecked: false,
                  },
                  {
                    id: "inference-question",
                    label:
                      "Question types: What is the man's problem? (inference)",
                    isChecked: false,
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
          {
            id: "short-talks",
            label: "Part: Short Talks",
            isChecked: false,
          },
        ],
      },
      {
        id: "reading",
        label: "Reading",
        isChecked: false,
        children: [
          {
            id: "reading-comprehension",
            label: "Part: Reading Comprehension",
            isChecked: false,
            children: [
              {
                id: "emails",
                label: "Emails",
                isChecked: false,
              },
              {
                id: "advertisements",
                label: "Topic: Advertisements",
                isChecked: false,
              },
            ],
          },
        ],
      },
      {
        id: "grammar",
        label: "Grammar",
        isChecked: false,
      },
    ],
  },
  {
    id: "ielts",
    label: "IELTS",
    isChecked: false,
    children: [
      {
        id: "ielts-listening",
        label: "Listening",
        isChecked: false,
        children: [
          {
            id: "section1",
            label: "Section 1: Everyday Social Context",
            isChecked: false,
            children: [
              {
                id: "personal-information",
                label: "Topic: Personal Information",
                isChecked: false,
                children: [
                  {
                    id: "form-completion",
                    label: "Question type: Form Completion",
                    isChecked: false,
                  },
                  {
                    id: "multiple-choice",
                    label: "Question type: Multiple Choice",
                    isChecked: false,
                  },
                ],
              },
              {
                id: "booking-reservations",
                label: "Topic: Booking and Reservations",
                isChecked: false,
              },
            ],
          },
          {
            id: "section2",
            label: "Section 2: General Social Context",
            isChecked: false,
            children: [
              {
                id: "local-facilities",
                label: "Topic: Local Facilities",
                isChecked: false,
              },
              {
                id: "travel-tourism",
                label: "Topic: Travel and Tourism",
                isChecked: false,
              },
            ],
          },
        ],
      },
      {
        id: "ielts-reading",
        label: "Reading",
        isChecked: false,
        children: [
          {
            id: "academic-reading",
            label: "Academic Reading",
            isChecked: false,
            children: [
              {
                id: "science-technology",
                label: "Topic: Science and Technology",
                isChecked: false,
              },
              {
                id: "history-culture",
                label: "Topic: History and Culture",
                isChecked: false,
              },
            ],
          },
          {
            id: "general-reading",
            label: "General Training Reading",
            isChecked: false,
            children: [
              {
                id: "workplace-documents",
                label: "Topic: Workplace Documents",
                isChecked: false,
              },
              {
                id: "everyday-texts",
                label: "Topic: Everyday Texts",
                isChecked: false,
              },
            ],
          },
        ],
      },
      {
        id: "ielts-writing",
        label: "Writing",
        isChecked: false,
        children: [
          {
            id: "task1",
            label: "Task 1: Data Description",
            isChecked: false,
          },
          {
            id: "task2",
            label: "Task 2: Essay Writing",
            isChecked: false,
          },
        ],
      },
      {
        id: "ielts-speaking",
        label: "Speaking",
        isChecked: false,
        children: [
          {
            id: "part1-speaking",
            label: "Part 1: Introduction and Interview",
            isChecked: false,
          },
          {
            id: "part2-speaking",
            label: "Part 2: Long Turn",
            isChecked: false,
          },
          {
            id: "part3-speaking",
            label: "Part 3: Discussion",
            isChecked: false,
          },
        ],
      },
    ],
  },
];

export const useCategoryTree = (initialData?: TreeMenuItem[]) => {
  const [treeData, setTreeData] = useState<TreeMenuItem[]>(
    initialData || initialTreeData
  );

  // Helper function to find an item by ID
  const findItem = (
    items: TreeMenuItem[],
    targetId: string
  ): TreeMenuItem | null => {
    for (const item of items) {
      if (item.id === targetId) return item;
      if (item.children) {
        const found = findItem(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to get the full path from root to a specific item
  const getPathToItem = (
    items: TreeMenuItem[],
    targetId: string,
    currentPath: string[] = []
  ): string[] | null => {
    for (const item of items) {
      const newPath = [...currentPath, item.id];
      if (item.id === targetId) return newPath;
      if (item.children) {
        const found = getPathToItem(item.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to clear all checked items
  const clearAllChecked = (items: TreeMenuItem[]): TreeMenuItem[] => {
    return items.map((item) => ({
      ...item,
      isChecked: false,
      children: item.children ? clearAllChecked(item.children) : item.children,
    }));
  };

  // Helper function to set checked status for a specific path
  const setPathChecked = (
    items: TreeMenuItem[],
    path: string[],
    pathIndex: number = 0
  ): TreeMenuItem[] => {
    return items.map((item) => {
      if (pathIndex < path.length && item.id === path[pathIndex]) {
        return {
          ...item,
          isChecked: true,
          children: item.children
            ? setPathChecked(item.children, path, pathIndex + 1)
            : item.children,
        };
      }
      return item;
    });
  };

  // Get selected category path as string
  const getSelectedCategoryPath = (): string => {
    const findCheckedPath = (
      items: TreeMenuItem[],
      currentPath: string[] = []
    ): string[] | null => {
      for (const item of items) {
        const newPath = [...currentPath, item.label];
        if (item.isChecked) {
          // Continue searching in children to find the deepest checked item
          if (item.children) {
            const childPath = findCheckedPath(item.children, newPath);
            if (childPath) return childPath;
          }
          return newPath;
        }
        if (item.children) {
          const found = findCheckedPath(item.children, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    const path = findCheckedPath(treeData);
    return path ? path.join(" > ") : "";
  };

  // Find item ID by following a path of labels
  const findItemIdByLabelPath = (
    items: TreeMenuItem[],
    labelPath: string[],
    pathIndex: number = 0
  ): string | null => {
    if (pathIndex >= labelPath.length) return null;

    for (const item of items) {
      if (item.label === labelPath[pathIndex]) {
        if (pathIndex === labelPath.length - 1) {
          // We've reached the end of the path
          return item.id;
        }
        if (item.children) {
          // Continue searching in children
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

  // Restore selection from a path string (e.g., "TOEIC > Listening > Part: Conversations")
  const restoreSelectionFromPath = (pathString: string) => {
    if (!pathString.trim()) return;

    const labelPath = pathString.split(" > ").map((label) => label.trim());
    const targetId = findItemIdByLabelPath(treeData, labelPath);

    if (targetId) {
      // First clear all checked items
      let newData = clearAllChecked(treeData);

      // Then set the path to the target item as checked
      const pathToItem = getPathToItem(treeData, targetId);
      if (pathToItem) {
        newData = setPathChecked(newData, pathToItem);
        setTreeData(newData);
      }
    }
  };

  // Handle item change
  const handleItemChange = (id: string, key: string, value: unknown) => {
    if (key !== "isChecked") return;

    const checked = Boolean(value);

    setTreeData((prevData) => {
      const targetItem = findItem(prevData, id);
      if (!targetItem) return prevData;

      if (checked) {
        // If checking an item, first clear all checked items
        let newData = clearAllChecked(prevData);

        // Then set the path to the selected item as checked
        const pathToItem = getPathToItem(prevData, id);
        if (pathToItem) {
          newData = setPathChecked(newData, pathToItem);
        }

        return newData;
      } else {
        // If unchecking, just clear all checked items
        return clearAllChecked(prevData);
      }
    });
  };

  return {
    treeData,
    setTreeData,
    handleItemChange,
    getSelectedCategoryPath,
    findItem,
    getPathToItem,
    restoreSelectionFromPath,
  };
};
