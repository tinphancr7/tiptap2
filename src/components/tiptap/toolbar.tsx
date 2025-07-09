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
import React, { useState, type FC, type ReactElement } from "react";
import { CirclePicker, SketchPicker, type ColorResult } from "react-color";
import { type IconType } from "react-icons";
import { IoMdColorFilter } from "react-icons/io";
import {
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
  MdImage,
  MdKeyboardArrowDown,
  MdSearch,
  MdUpload,
  MdVolumeUp,
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

const AudioButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState("");

  const onChange = (src: string) => {
    // Use the custom Audio extension command
    editor?.chain().focus().setAudio({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const audioUrl = URL.createObjectURL(file);
        onChange(audioUrl);
      }
    };

    input.click();
  };

  const handleAudioUrlSubmit = () => {
    if (audioUrl) {
      onChange(audioUrl);
      setAudioUrl("");
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
            <MdVolumeUp className={"size-5"} />
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
              Paste audio URL
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h4>Paste audio URL</h4>
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Insert audio URL"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAudioUrlSubmit()}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleAudioUrlSubmit}>
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
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Get current link attributes if editing existing link
  const currentLink = editor?.getAttributes("link");
  const isLinkActive = editor?.isActive("link");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // If editing existing link, populate field
      if (isLinkActive && currentLink?.href) {
        setUrl(currentLink.href);
      } else {
        setUrl("");
      }
    } else {
      // Clear field when closing
      setUrl("");
    }
  };

  const handleApply = () => {
    if (!url.trim()) return;

    // Add protocol if missing
    const finalUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    // Get current selection
    const { from, to } = editor?.state.selection || { from: 0, to: 0 };
    const hasSelection = from !== to;

    if (hasSelection || isLinkActive) {
      // If we have selection or editing existing link, apply/update link
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: finalUrl })
        .run();
    } else {
      // Insert the URL as text with link if no selection
      editor
        ?.chain()
        .focus()
        .insertContent(`<a href="${finalUrl}">${finalUrl}</a>`)
        .run();
    }

    setIsOpen(false);
    setUrl("");
  };

  const handleRemoveLink = () => {
    editor?.chain().focus().unsetLink().run();
    setIsOpen(false);
    setUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="bottom"
      showArrow={false}
      classNames={{
        content:
          "p-2 min-w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg",
      }}
    >
      <PopoverTrigger>
        <button
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            "h-8 min-w-8 shrink-0 flex items-center justify-center rounded-md hover:bg-gray-50 px-2 overflow-hidden text-sm transition-colors",
            isLinkActive && "bg-blue-100 text-blue-600"
          )}
        >
          <PiLinkSimpleBold className={"size-5"} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-2 ">
          <div className="flex-1">
            <Input
              placeholder="Paste a link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              size="sm"
              variant="faded"
              className="w-full"
              classNames={{
                input: "text-sm placeholder:text-gray-400 bg-transparent",
                inputWrapper: "bg-gray-50 border-none h-8 min-h-8 ",
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleApply}
              disabled={!url.trim()}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Apply link"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>

            <button
              onClick={() => window.open(url, "_blank")}
              disabled={!url.trim()}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Open link in new tab"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>

            {isLinkActive && (
              <button
                onClick={handleRemoveLink}
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-red-500"
                title="Remove link"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
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
          <IoMdColorFilter className={"size-5"} />
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
    <div className="bg-[#F0F0F0] rounded-t-lg  min-h-12 flex items-center justify-center gap-x-1 gap-y-1 overflow-hidden">
      {section.map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <FontFamilyButton />
      <LinkButton />
      <AlignButton />
      <ListButton />
      <FontSizeButton />
      <TextColorButton />
      <HighlightColorButton />
      <ImageButton />
      <AudioButton />
    </div>
  );
};

export default Toolbar;
