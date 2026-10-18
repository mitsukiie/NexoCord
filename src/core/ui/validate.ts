import type {
  Button,
  DisplayComponent,
  MediaItem,
  RowComponent,
  SectionComponent,
  SelectMenu,
} from "@types";

const HTTP_URL_PATTERN = /^https?:\/\/.+/i;
const ATTACHMENT_URL_PATTERN = /^attachment:\/\/.+/i;
const HEX_COLOR_PATTERN = /^(?:#|0x)?([0-9a-fA-F]{6})$/;

function has_length_between(
  value: string | undefined,
  min: number,
  max: number,
): boolean {
  if (value === undefined) return false;

  return value.length >= min && value.length <= max;
}

export const validate = {
  components(components: readonly DisplayComponent[]): void {
    if (components.length > 40) {
      throw new Error("A message cannot contain more than 40 components.");
    }
  },

  text(content: string): void {
    if (content.length > 4000) {
      throw new Error("Display text cannot exceed 4000 characters.");
    }
  },

  url(url: string): void {
    if (!HTTP_URL_PATTERN.test(url)) {
      throw new Error("URL must start with http:// or https://");
    }
  },

  attachment_url(url: string): void {
    if (!ATTACHMENT_URL_PATTERN.test(url)) {
      throw new Error("File URL must start with attachment://");
    }
  },

  button(button: Button): void {
    if (!has_length_between(button.label, 1, 80)) {
      throw new Error("Button label must have between 1 and 80 characters.");
    }

    if (!has_length_between(button.customId, 1, 100)) {
      throw new Error(
        "Button custom id must have between 1 and 100 characters.",
      );
    }
  },

  row(components: readonly RowComponent[]): void {
    if (components.length < 1 || components.length > 5) {
      throw new Error("Action row must contain between 1 and 5 components.");
    }

    const select_count = components.filter(
      (component) => !("label" in component),
    ).length;

    if (select_count > 0 && components.length > 1) {
      throw new Error(
        "Select menus must be alone in an action row (max width layout rule).",
      );
    }
  },

  select(select: SelectMenu): void {
    if (!has_length_between(select.id, 1, 100)) {
      throw new Error(
        "Select custom id must have between 1 and 100 characters.",
      );
    }

    if (select.placeholder !== undefined && select.placeholder.length > 150) {
      throw new Error("Select placeholder cannot exceed 150 characters.");
    }

    if (select.minValues !== undefined && select.minValues < 0) {
      throw new Error("Select minValues cannot be negative.");
    }

    if (select.maxValues !== undefined && select.maxValues < 1) {
      throw new Error("Select maxValues must be at least 1.");
    }

    if (
      select.minValues !== undefined &&
      select.maxValues !== undefined &&
      select.minValues > select.maxValues
    ) {
      throw new Error("Select minValues cannot exceed maxValues.");
    }

    if (select.type === "select.string") {
      if (select.options.length < 1 || select.options.length > 25) {
        throw new Error("String select must contain between 1 and 25 options.");
      }

      for (const option of select.options) {
        if (!has_length_between(option.label, 1, 100)) {
          throw new Error(
            "String select option labels must have between 1 and 100 characters.",
          );
        }

        if (!has_length_between(option.value, 1, 100)) {
          throw new Error(
            "String select option values must have between 1 and 100 characters.",
          );
        }

        if (
          option.description !== undefined &&
          option.description.length > 100
        ) {
          throw new Error(
            "String select option descriptions cannot exceed 100 characters.",
          );
        }
      }
    }
  },

  section(section: SectionComponent): void {
    if (section.texts.length < 1 || section.texts.length > 3) {
      throw new Error("Section must contain between 1 and 3 text blocks.");
    }
  },

  color(color: number | string): number {
    if (typeof color === "number") {
      if (!Number.isInteger(color) || color < 0 || color > 0xffffff) {
        throw new Error(
          "Container color must be an integer between 0x000000 and 0xFFFFFF.",
        );
      }

      return color;
    }

    const match = color.match(HEX_COLOR_PATTERN);

    if (!match) {
      throw new Error(
        "Container accent_color must be a number (0x000000-0xFFFFFF) or hex string (#000000, 0x000000, 000000).",
      );
    }

    const hex = match[1];

    if (hex === undefined) {
      throw new Error("Invalid accent color hex value.");
    }

    return Number.parseInt(hex, 16);
  },

  gallery(items: readonly MediaItem[]): void {
    if (items.length < 1 || items.length > 10) {
      throw new Error("Gallery must contain between 1 and 10 items.");
    }
  },
};
