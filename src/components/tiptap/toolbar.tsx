"use client";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState, type FC, type ReactElement } from "react";
import { CirclePicker, SketchPicker, type ColorResult } from "react-color";
import { type IconType } from "react-icons";
import {
  MdAdd,
  MdChecklist,
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatClear,
  MdFormatColorText,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatUnderlined,
  MdHighlight,
  MdImage,
  MdKeyboardArrowDown,
  MdLink,
  MdRedo,
  MdRemove,
  MdSearch,
  MdUndo,
  MdUpload,
} from "react-icons/md";

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(currentFontSize);
  const [isEditing, setIsEditing] = useState(false);

  if (currentFontSize !== fontSize) {
    setFontSize(currentFontSize);
    setInputValue(currentFontSize);
  }

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
      editor?.commands.setFontSize(`${size}px`);
    }
  };

  // function change fontSize
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    updateFontSize((parseInt(fontSize) + 1).toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          decrement();
        }}
        className="size-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
      >
        <MdRemove className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="h-8 w-12 text-sm border border-gray-300 text-center rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 w-12 text-sm border border-gray-300 text-center rounded-md cursor-text hover:bg-gray-50 transition-colors"
        >
          {fontSize}
        </button>
      )}
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          increment();
        }}
        className="size-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
      >
        <MdAdd className="size-4" />
      </button>
    </div>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: "Bullet List",
      icon: MdFormatListBulleted,
      isActive: () => editor?.isActive("bulletList"),
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: MdFormatListNumbered,
      isActive: () => editor?.isActive("orderedList"),
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdFormatListBulleted className="size-4" />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <DropdownItem
            key={label}
            onPress={onClick}
            className={cn(
              "flex items-center w-full hover:bg-gray-100",
              isActive() && "bg-gray-200"
            )}
            startContent={<Icon className="size-4" />}
          >
            <span className="text-sm">{label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: MdFormatAlignLeft,
    },
    {
      label: "Align Center",
      value: "center",
      icon: MdFormatAlignCenter,
    },
    {
      label: "Align Right",
      value: "right",
      icon: MdFormatAlignRight,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: MdFormatAlignJustify,
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdFormatAlignLeft className={"size-4"} />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        {alignments.map(({ label, value, icon: Icon }) => (
          <DropdownItem
            key={value}
            onPress={() => {
              editor?.chain().focus().setTextAlign(value).run();
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 w-full hover:bg-gray-100",
              editor?.isActive("textAlign", { value }) && "bg-gray-200"
            )}
            startContent={<Icon className="size-4" />}
          >
            <span className="text-sm">{label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState("");

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };

    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button
            onMouseDown={(e) => e.preventDefault()}
            className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-2 overflow-hidden text-sm transition-colors"
          >
            <MdImage className={"size-4"} />
          </button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="upload" onPress={onUpload}>
            <div className="flex items-center gap-2">
              <MdUpload className="h-4 w-4" />
              Upload
            </div>
          </DropdownItem>
          <DropdownItem key="paste-url" onPress={() => setIsDialogOpen(true)}>
            <div className="flex items-center gap-2">
              <MdSearch className="h-4 w-4" />
              Paste image URL
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h4>Paste image URL</h4>
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Insert image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleImageUrlSubmit()}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleImageUrlSubmit}>
                  Insert
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdLink className={"size-4"} />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="link-input"
          className="p-2.5 flex items-center gap-x-2"
        >
          <Input
            placeholder="https://"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onPress={() => onChange(value)} isDisabled={!value}>
            Apply
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();
  const color = editor?.getAttributes("highlight").color || "#000000";
  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdHighlight className={"size-4"} />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="color-picker" className="p-0 border">
          <SketchPicker onChange={onChange} color={color} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdFormatColorText className="size-4" style={{ color: value }} />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="color-picker" className="p-2.5">
          <CirclePicker color={value} onChange={onChange} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    {
      label: "Normal text",
      value: 0,
      fontSize: "16px",
    },
    {
      label: "Heading 1",
      value: 1,
      fontSize: "32px",
    },
    {
      label: "Heading 2",
      value: 2,
      fontSize: "24px",
    },
    {
      label: "Heading 3",
      value: 3,
      fontSize: "20px",
    },
    {
      label: "Heading 4",
      value: 4,
      fontSize: "18px",
    },
    {
      label: "Heading 5",
      value: 5,
      fontSize: "16px",
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 w-[100px] shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 px-3 overflow-hidden text-sm border border-gray-300 transition-colors"
        >
          <span className="truncate flex items-center">
            <span className="text-lg font-bold mr-1">H</span>
            <MdKeyboardArrowDown className="size-4" />
          </span>
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        {headings.map(({ label, value, fontSize }) => (
          <DropdownItem
            key={value}
            onPress={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
                return;
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as 1 | 2 | 3 | 4 | 5 })
                  .run();
              }
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-gray-100",
              ((value === 0 && !editor?.isActive("heading")) ||
                editor?.isActive("heading", { level: value })) &&
                "bg-gray-200"
            )}
            style={{ fontSize }}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();
  const font = [
    {
      label: "Arial",
      value: "Arial",
    },
    {
      label: "Arial Black",
      value: "Arial Black",
    },

    {
      label: "Times New Roman",
      value: "Times New Roman",
    },
    {
      label: "Courier New",
      value: "Courier New",
    },
    {
      label: "Verdana",
      value: "Verdana",
    },
    {
      label: "Georgia",
      value: "Georgia",
    },
    {
      label: "Trebuchet MS",
      value: "Trebuchet MS",
    },
    {
      label: "Comic Sans MS",
      value: "Comic Sans MS",
    },
    {
      label: "Impact",
      value: "Impact",
    },
    {
      label: "Helvetica",
      value: "Helvetica",
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 w-24 shrink-0 flex items-center justify-between rounded-md hover:bg-gray-100 px-3 overflow-hidden text-sm border border-gray-300 transition-colors"
        >
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Roboto"}
          </span>
          <MdKeyboardArrowDown className="size-4 ml-2 shrink-0" />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        {font.map(({ label, value }) => (
          <DropdownItem
            key={label}
            onPress={() => {
              editor?.chain().focus().setFontFamily(value).run();
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-gray-100",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-gray-200"
            )}
            style={{ fontFamily: value }}
          >
            <span className="text-sm">{label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: IconType;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  icon: Icon,
}): ReactElement => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.preventDefault()}
      className={cn(
        "text-sm h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors",
        isActive && "bg-gray-200 text-gray-900"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

const Toolbar = () => {
  const { editor } = useEditorStore();

  const section: {
    label: string;
    icon: IconType;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: MdUndo,
        onClick: () => {
          editor?.chain().focus().undo().run();
        },
      },
      {
        label: "Redo",
        icon: MdRedo,
        onClick: () => {
          editor?.chain().focus().redo().run();
        },
      },

      {
        label: "Code Block",
        icon: MdCode,
        onClick: () => {
          editor?.chain().focus().toggleCodeBlock().run();
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: MdFormatBold,
        isActive: editor?.isActive("bold"),
        onClick: () => {
          editor?.chain().focus().toggleBold().run();
        },
      },
      {
        label: "Italic",
        icon: MdFormatItalic,
        isActive: editor?.isActive("italic"),
        onClick: () => {
          editor?.chain().focus().toggleItalic().run();
        },
      },
      {
        label: "Underline",
        icon: MdFormatUnderlined,
        isActive: editor?.isActive("underline"),
        onClick: () => {
          editor?.chain().focus().toggleUnderline().run();
        },
      },
    ],
    [
      {
        label: "List Todo",
        icon: MdChecklist,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editor?.isActive("taskList"),
      },
      {
        label: "Remove Formatting",
        icon: MdFormatClear,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
        isActive: editor?.isActive("removeFormatting"),
      },
    ],
  ];

  return (
    <div className="bg-white min-h-10 flex flex-wrap items-center gap-x-1 gap-y-1 overflow-hidden">
      {section[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <FontFamilyButton />

      <HeadingLevelButton />

      <FontSizeButton />

      {section[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <TextColorButton />
      <HighlightColorButton />

      <LinkButton />
      <ImageButton />
      <AlignButton />
      <ListButton />
      {section[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};

export default Toolbar;
