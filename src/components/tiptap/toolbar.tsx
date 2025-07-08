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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useState, type FC, type ReactElement } from "react";
import { CirclePicker, SketchPicker, type ColorResult } from "react-color";
import { type IconType } from "react-icons";
import {
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
  MdSearch,
  MdUndo,
  MdUpload,
} from "react-icons/md";
import { PiLinkSimpleBold } from "react-icons/pi";
const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
    : "16";

  const fontSizes = [
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "14", value: "14" },
    { label: "16", value: "16" },
    { label: "18", value: "18" },
    { label: "20", value: "20" },
    { label: "24", value: "24" },
    { label: "28", value: "28" },
    { label: "32", value: "32" },
    { label: "36", value: "36" },
    { label: "48", value: "48" },
    { label: "72", value: "72" },
  ];

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.commands.setFontSize(`${size}px`);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 w-14 bg-white shadow-sm shrink-0 flex items-center justify-center rounded-full hover:bg-gray-50 text-sm border border-gray-300 transition-colors"
        >
          <span className="text-center">{currentFontSize}</span>
          <MdKeyboardArrowDown className="size-5 ml-2 shrink-0" />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        {fontSizes.map(({ label, value }) => (
          <DropdownItem
            key={value}
            onPress={() => updateFontSize(value)}
            className={cn(
              "flex items-center justify-center px-2 py-1 rounded-sm hover:bg-gray-50",
              currentFontSize === value && "bg-gray-200"
            )}
          >
            <span className="text-sm">{label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
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
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdFormatListBulleted className="size-5" />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <DropdownItem
            key={label}
            onPress={onClick}
            className={cn(
              "flex items-center w-full hover:bg-gray-50",
              isActive() && "bg-gray-200"
            )}
            startContent={<Icon className="size-5" />}
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
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdFormatAlignLeft className={"size-5"} />
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
              "flex items-center gap-x-2 px-2 py-1 w-full hover:bg-gray-50",
              editor?.isActive("textAlign", { value }) && "bg-gray-200"
            )}
            startContent={<Icon className="size-5" />}
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
            className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors"
          >
            <MdImage className={"size-5"} />
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
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors"
        >
          <PiLinkSimpleBold className={"size-5"} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex  gap-3 w-full">
          <Input
            placeholder="https://"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value) {
                onChange(value);
              }
            }}
            className="w-full"
            variant="bordered"
            size="sm"
          />
          <Button
            onPress={() => onChange(value)}
            isDisabled={!value}
            color="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
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
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdHighlight className={"size-5"} />
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
          className="h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors"
        >
          <MdFormatColorText className="size-5" style={{ color: value }} />
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
          className="h-8 w-24 bg-white shadow-sm shrink-0 flex items-center justify-between rounded-full hover:bg-gray-50 px-3 overflow-hidden text-sm border border-gray-300 transition-colors"
        >
          <span className="truncate">
            {editor?.getAttributes("textStyle").fontFamily || "Roboto"}
          </span>
          <MdKeyboardArrowDown className="size-5 ml-2 shrink-0" />
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
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-gray-50",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "hover:bg-gray-50"
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
        "text-sm h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors",
        isActive && "bg-gray-50 text-gray-900"
      )}
    >
      <Icon className="size-5" />
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
  }[] = [
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

    {
      label: "Remove Formatting",
      icon: MdFormatClear,
      onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      isActive: editor?.isActive("removeFormatting"),
    },
  ];

  return (
    <div className="bg-[#F0F0F0] rounded-t-lg  min-h-10 flex items-center justify-center gap-x-1 gap-y-1 overflow-hidden">
      {section.map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <FontFamilyButton />
      <LinkButton />
      <AlignButton />
      <FontSizeButton />
      <TextColorButton />
      <HighlightColorButton />
      <ImageButton />
      <ListButton />
    </div>
  );
};

export default Toolbar;
