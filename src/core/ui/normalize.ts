import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  SectionBuilder,
  SeparatorBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  TextDisplayBuilder,
} from "discord.js";

import type { MessageActionRowComponentBuilder } from "discord.js";

import type {
  AttachmentInput,
  Button,
  ContainerChild,
  ContainerInput,
  ContainerNode,
  DisplayComponent,
  DisplayInput,
  FileComponent,
  MediaItem,
  RowComponent,
  SelectMenu,
} from "@types";

import { validate } from "./validate";

const ATTACHMENTS = Symbol("ui.display.attachments");

type ContainerWithAttachments = ContainerBuilder & {
  [ATTACHMENTS]?: readonly AttachmentInput[];
};

function is_container_child(component: unknown): component is ContainerChild {
  return (
    component instanceof TextDisplayBuilder ||
    component instanceof SeparatorBuilder ||
    component instanceof SectionBuilder ||
    component instanceof MediaGalleryBuilder ||
    component instanceof FileBuilder ||
    component instanceof ActionRowBuilder
  );
}

function is_display_component(
  component: unknown,
): component is DisplayComponent {
  return component instanceof ContainerBuilder || is_container_child(component);
}

function build_button(button: Button) {
  validate.button(button);

  const builder = new ButtonBuilder()
    .setLabel(button.label)
    .setCustomId(button.customId)
    .setStyle(button.style ?? ButtonStyle.Primary);

  if (button.emoji) {
    builder.setEmoji({ name: button.emoji });
  }

  return builder;
}

function apply_button_data<
  T extends {
    setLabel(label: string): T;
    setCustomId(id: string): T;
    setStyle(style: ButtonStyle): T;
    setEmoji(emoji: { name: string }): T;
  },
>(builder: T, button: Button): T {
  builder
    .setLabel(button.label)
    .setCustomId(button.customId)
    .setStyle(button.style ?? ButtonStyle.Primary);

  if (button.emoji) {
    builder.setEmoji({ name: button.emoji });
  }

  return builder;
}

function apply_select_base<
  T extends {
    setCustomId(id: string): T;
    setPlaceholder(placeholder: string): T;
    setMinValues(min_values: number): T;
    setMaxValues(max_values: number): T;
    setDisabled(disabled?: boolean): T;
  },
>(builder: T, select: SelectMenu): T {
  builder.setCustomId(select.id);

  if (select.placeholder !== undefined) {
    builder.setPlaceholder(select.placeholder);
  }

  if (select.minValues !== undefined) {
    builder.setMinValues(select.minValues);
  }

  if (select.maxValues !== undefined) {
    builder.setMaxValues(select.maxValues);
  }

  if (select.disabled !== undefined) {
    builder.setDisabled(select.disabled);
  }

  return builder;
}

function build_select(select: SelectMenu) {
  validate.select(select);

  switch (select.type) {
    case "select.user":
      return apply_select_base(new UserSelectMenuBuilder(), select);

    case "select.role":
      return apply_select_base(new RoleSelectMenuBuilder(), select);

    case "select.mentionable":
      return apply_select_base(new MentionableSelectMenuBuilder(), select);

    case "select.channel": {
      const builder = apply_select_base(new ChannelSelectMenuBuilder(), select);

      if (select.channelTypes?.length) {
        builder.setChannelTypes(...select.channelTypes);
      }

      return builder;
    }

    case "select.string": {
      const builder = apply_select_base(new StringSelectMenuBuilder(), select);

      builder.setOptions(
        ...select.options.map((option) => ({
          label: option.label,
          value: option.value,
          ...(option.description !== undefined && {
            description: option.description,
          }),
          ...(option.default !== undefined && {
            default: option.default,
          }),
        })),
      );

      return builder;
    }
  }
}

function build_row_component(component: RowComponent) {
  return "label" in component
    ? build_button(component)
    : build_select(component);
}

function build_gallery(items: readonly MediaItem[]) {
  validate.gallery(items);

  const gallery = new MediaGalleryBuilder();

  gallery.addItems(
    ...items.map((item) => (media: MediaGalleryItemBuilder) => {
      validate.url(item.url);

      media.setURL(item.url);

      if (item.description !== undefined) {
        media.setDescription(item.description);
      }

      if (item.spoiler !== undefined) {
        media.setSpoiler(item.spoiler);
      }

      return media;
    }),
  );

  return gallery;
}

function build_file(file_input: FileComponent) {
  validate.attachment_url(file_input.url);

  const file = new FileBuilder().setURL(file_input.url);

  if (file_input.spoiler !== undefined) {
    file.setSpoiler(file_input.spoiler);
  }

  return file;
}

function build_easy_child(component: ContainerNode): ContainerChild {
  switch (component.type) {
    case "text": {
      validate.text(component.content);

      return new TextDisplayBuilder().setContent(component.content);
    }

    case "separator": {
      return new SeparatorBuilder();
    }

    case "section": {
      validate.section(component);

      const section = new SectionBuilder();

      section.addTextDisplayComponents(
        ...component.texts.map((content) => {
          validate.text(content);

          return (text: TextDisplayBuilder) => text.setContent(content);
        }),
      );

      if (component.button) {
        section.setButtonAccessory((button) =>
          apply_button_data(button, component.button!),
        );
      }

      if (component.thumbnail) {
        const thumbnail = component.thumbnail;

        validate.url(thumbnail.url);

        section.setThumbnailAccessory((thumb) => {
          thumb.setURL(thumbnail.url);

          if (thumbnail.description !== undefined) {
            thumb.setDescription(thumbnail.description);
          }

          if (thumbnail.spoiler !== undefined) {
            thumb.setSpoiler(thumbnail.spoiler);
          }

          return thumb;
        });
      }

      return section;
    }

    case "row": {
      validate.row(component.components);

      return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        ...component.components.map(build_row_component),
      );
    }

    case "gallery": {
      return build_gallery(component.items);
    }

    case "file": {
      return build_file(component);
    }

    default: {
      throw new Error("Unknown container component.");
    }
  }
}

export function to_container_child(component: ContainerInput): ContainerChild {
  if (is_container_child(component)) {
    return component;
  }

  return build_easy_child(component);
}

export function to_display_component(
  component: DisplayInput,
): DisplayComponent {
  if (is_display_component(component)) {
    return component;
  }

  return build_easy_child(component);
}

export function to_display_components(
  ...components: DisplayInput[]
): DisplayComponent[] {
  return components.map(to_display_component);
}

function is_easy_file_input(component: unknown): component is FileComponent {
  if (!component || typeof component !== "object" || Array.isArray(component)) {
    return false;
  }

  return "type" in component && component.type === "file";
}

function get_container_attachments(
  container: ContainerBuilder,
): readonly AttachmentInput[] {
  return (container as ContainerWithAttachments)[ATTACHMENTS] ?? [];
}

export function collect_attachments_from_container_inputs(
  components: readonly ContainerInput[],
): AttachmentInput[] {
  const attachments: AttachmentInput[] = [];

  for (const component of components) {
    if (is_easy_file_input(component) && component.attachment !== undefined) {
      attachments.push(component.attachment);
    }
  }

  return attachments;
}

export function attach_container_attachments(
  container: ContainerBuilder,
  attachments: readonly AttachmentInput[],
): ContainerBuilder {
  if (attachments.length === 0) {
    return container;
  }

  (container as ContainerWithAttachments)[ATTACHMENTS] = attachments;

  return container;
}

export function collect_attachments_from_display_inputs(
  components: readonly DisplayInput[],
): AttachmentInput[] {
  const attachments: AttachmentInput[] = [];

  for (const component of components) {
    if (component instanceof ContainerBuilder) {
      attachments.push(...get_container_attachments(component));
      continue;
    }

    if (is_easy_file_input(component) && component.attachment !== undefined) {
      attachments.push(component.attachment);
    }
  }

  return attachments;
}

export function prepare_components(components: DisplayInput[]) {
  const display_components = to_display_components(...components);

  validate.components(display_components);

  return {
    components: display_components,
    files: collect_attachments_from_display_inputs(components),
  };
}
