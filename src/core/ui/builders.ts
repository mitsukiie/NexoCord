import { ChannelType, ContainerBuilder } from "discord.js";

import type {
  AttachmentInput,
  AttachmentUrlString,
  Button,
  ChannelSelect,
  ContainerInput,
  ContainerOptions,
  MediaItem,
  MentionableSelect,
  RowComponent,
  RoleSelect,
  SectionOptions,
  SectionTexts,
  SelectBase,
  StringSelect,
  StringSelectOption,
  Thumbnail,
  UserSelect,
} from "@types";

import {
  attach_container_attachments,
  collect_attachments_from_container_inputs,
  to_container_child,
} from "./normalize";

import { validate } from "./validate";

function get_attachment_name(attachment: AttachmentInput): string {
  if (!attachment || typeof attachment !== "object") {
    throw new Error("Attachment must be an object with a valid file name.");
  }

  const candidate = attachment as {
    name?: unknown;
    data?: { name?: unknown };
  };

  const name =
    typeof candidate.name === "string"
      ? candidate.name
      : typeof candidate.data?.name === "string"
        ? candidate.data.name
        : undefined;

  if (!name) {
    throw new Error(
      "Attachment name was not found. Define a name in AttachmentBuilder options.",
    );
  }

  return name;
}

function build_easy_file(
  url: AttachmentUrlString,
  spoiler?: boolean,
): ReturnType<typeof create_file_component>;

function build_easy_file(
  url: AttachmentUrlString,
  attachment: AttachmentInput,
  spoiler?: boolean,
): ReturnType<typeof create_file_component>;

function build_easy_file(
  url: AttachmentUrlString,
  attachment_or_spoiler?: AttachmentInput | boolean,
  spoiler = false,
) {
  const has_attachment =
    attachment_or_spoiler !== undefined &&
    typeof attachment_or_spoiler !== "boolean";

  return create_file_component(
    url,
    has_attachment ? spoiler : (attachment_or_spoiler ?? false),
    has_attachment ? attachment_or_spoiler : undefined,
  );
}

function create_file_component(
  url: AttachmentUrlString,
  spoiler: boolean,
  attachment?: AttachmentInput,
) {
  return {
    type: "file" as const,
    url,
    spoiler,
    ...(attachment !== undefined && { attachment }),
  };
}

const file = Object.assign(build_easy_file, {
  fromAttachment(attachment: AttachmentInput, spoiler = false) {
    const name = get_attachment_name(attachment);

    return build_easy_file(`attachment://${name}`, attachment, spoiler);
  },
});

function is_container_options(value: unknown): value is ContainerOptions {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return "color" in value;
}

type SplitContainerResult = {
  options: ContainerOptions;
  components: ContainerInput[];
};

function split_container_args(
  args: (ContainerOptions | ContainerInput)[],
): SplitContainerResult {
  if (is_container_options(args[0])) {
    return {
      options: args[0],
      components: args.slice(1) as ContainerInput[],
    };
  }

  return {
    options: {},
    components: args as ContainerInput[],
  };
}

type SelectBuilderOptions = Omit<SelectBase, "id">;

type SelectBuilderInput = SelectBuilderOptions & {
  customId: SelectBase["id"];
};

type ChannelSelectBuilderInput = SelectBuilderInput & {
  channelTypes?: readonly ChannelType[];
};

type StringSelectBuilderInput = SelectBuilderInput & {
  options: readonly StringSelectOption[];
};

type SimpleSelectType =
  | UserSelect["type"]
  | RoleSelect["type"]
  | MentionableSelect["type"];

type SimpleSelect<TType extends SimpleSelectType> = Extract<
  RowComponent,
  { type: TType }
>;

type SimpleSelectBuilder<TType extends SimpleSelectType> = {
  (
    custom_id: SelectBase["id"],
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType>;

  (opts: SelectBuilderInput): SimpleSelect<TType>;
};

function resolve_select_base(
  custom_id: SelectBase["id"],
  opts?: SelectBuilderOptions,
): SelectBase;

function resolve_select_base(opts: SelectBuilderInput): SelectBase;

function resolve_select_base(
  custom_id_or_opts: SelectBase["id"] | SelectBuilderInput,
  opts: SelectBuilderOptions = {},
): SelectBase {
  if (typeof custom_id_or_opts === "string") {
    return {
      id: custom_id_or_opts,
      ...opts,
    };
  }

  const { customId, ...select_options } = custom_id_or_opts;

  return {
    id: customId,
    ...select_options,
  };
}

function create_select<TType extends SimpleSelectType>(
  type: TType,
  custom_id: SelectBase["id"],
  opts?: SelectBuilderOptions,
): SimpleSelect<TType>;

function create_select<TType extends SimpleSelectType>(
  type: TType,
  opts: SelectBuilderInput,
): SimpleSelect<TType>;

function create_select<TType extends SimpleSelectType>(
  type: TType,
  custom_id_or_opts: SelectBase["id"] | SelectBuilderInput,
  opts?: SelectBuilderOptions,
) {
  return {
    type,
    ...(typeof custom_id_or_opts === "string"
      ? resolve_select_base(custom_id_or_opts, opts)
      : resolve_select_base(custom_id_or_opts)),
  };
}

function create_simple_select_builder<TType extends SimpleSelectType>(
  type: TType,
): SimpleSelectBuilder<TType> {
  function build(
    custom_id: SelectBase["id"],
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType>;

  function build(opts: SelectBuilderInput): SimpleSelect<TType>;

  function build(
    custom_id_or_opts: SelectBase["id"] | SelectBuilderInput,
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType> {
    return typeof custom_id_or_opts === "string"
      ? create_select(type, custom_id_or_opts, opts)
      : create_select(type, custom_id_or_opts);
  }

  return build;
}

const user_select = create_simple_select_builder("select.user");
const role_select = create_simple_select_builder("select.role");
const mentionable_select = create_simple_select_builder("select.mentionable");

function channel_select(
  custom_id: SelectBase["id"],
  channel_types?: readonly ChannelType[],
  opts?: SelectBuilderOptions,
): ChannelSelect;

function channel_select(opts: ChannelSelectBuilderInput): ChannelSelect;

function channel_select(
  custom_id_or_opts: SelectBase["id"] | ChannelSelectBuilderInput,
  channel_types?: readonly ChannelType[] | SelectBuilderOptions,
  opts: SelectBuilderOptions = {},
): ChannelSelect {
  if (typeof custom_id_or_opts !== "string") {
    const { channelTypes, ...select_options } = custom_id_or_opts;

    return {
      type: "select.channel",
      ...resolve_select_base(select_options),
      ...(channelTypes !== undefined && { channelTypes }),
    };
  }

  const has_channel_types = Array.isArray(channel_types);

  const resolved_opts = has_channel_types
    ? opts
    : (channel_types as SelectBuilderOptions | undefined);

  return {
    type: "select.channel",
    ...resolve_select_base(custom_id_or_opts, resolved_opts),
    ...(has_channel_types && {
      channelTypes: channel_types as readonly ChannelType[],
    }),
  };
}

function string_select(
  custom_id: SelectBase["id"],
  options: readonly StringSelectOption[],
  opts?: SelectBuilderOptions,
): StringSelect;

function string_select(opts: StringSelectBuilderInput): StringSelect;

function string_select(
  custom_id_or_opts: SelectBase["id"] | StringSelectBuilderInput,
  options?: readonly StringSelectOption[] | SelectBuilderOptions,
  opts: SelectBuilderOptions = {},
): StringSelect {
  if (typeof custom_id_or_opts !== "string") {
    const { options: string_options, ...select_options } = custom_id_or_opts;

    return {
      type: "select.string",
      ...resolve_select_base(select_options),
      options: string_options,
    };
  }

  const has_options = Array.isArray(options);

  return {
    type: "select.string",
    ...resolve_select_base(
      custom_id_or_opts,
      has_options ? opts : (options as SelectBuilderOptions | undefined),
    ),
    options: has_options ? (options as readonly StringSelectOption[]) : [],
  };
}

export const ui = {
  text(content: string) {
    return {
      type: "text" as const,
      content,
    };
  },

  divider() {
    return {
      type: "separator" as const,
    };
  },

  button(options: Button): Button {
    return options;
  },

  select: {
    user: user_select,
    string: string_select,
    role: role_select,
    channel: channel_select,
    mentionable: mentionable_select,
  },

  section(texts: SectionTexts, opts: SectionOptions = {}) {
    return {
      type: "section" as const,
      texts,
      ...opts,
    };
  },

  thumbnail(options: Thumbnail): Thumbnail {
    return options;
  },

  gallery(...items: MediaItem[]) {
    return {
      type: "gallery" as const,
      items,
    };
  },

  image(options: MediaItem): MediaItem {
    return options;
  },

  file,

  row(...components: RowComponent[]) {
    return {
      type: "row" as const,
      components,
    };
  },

  container(
    ...args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[]
  ) {
    const { options, components } = split_container_args(args);

    const container = new ContainerBuilder();

    container.components.push(...components.map(to_container_child));

    if (options.color !== undefined) {
      container.setAccentColor(validate.color(options.color));
    }

    const attachments = collect_attachments_from_container_inputs(components);

    return attach_container_attachments(container, attachments);
  },
};
