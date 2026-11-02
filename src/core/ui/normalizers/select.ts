import {
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from "discord.js";

import type {
  ChannelSelect,
  MentionableSelect,
  RoleSelect,
  SelectBase,
  SelectMenu,
  StringSelect,
  UserSelect,
} from "../types";

/** Aplica as propriedades compartilhadas de um menu de seleção. */
function apply_select_base<
  TBuilder extends
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | MentionableSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | StringSelectMenuBuilder,
>(builder: TBuilder, options: SelectBase): TBuilder {
  builder.setCustomId(options.customId);

  if (options.placeholder !== undefined) {
    builder.setPlaceholder(options.placeholder);
  }

  if (options.minValues !== undefined) {
    builder.setMinValues(options.minValues);
  }

  if (options.maxValues !== undefined) {
    builder.setMaxValues(options.maxValues);
  }

  if (options.disabled !== undefined) {
    builder.setDisabled(options.disabled);
  }

  return builder;
}

/** Converte um menu de seleção de usuários. */
export function normalize_user_select(
  select: UserSelect,
): UserSelectMenuBuilder {
  return apply_select_base(new UserSelectMenuBuilder(), select);
}

/** Converte um menu de seleção de cargos. */
export function normalize_role_select(
  select: RoleSelect,
): RoleSelectMenuBuilder {
  return apply_select_base(new RoleSelectMenuBuilder(), select);
}

/** Converte um menu de seleção de entidades mencionáveis. */
export function normalize_mentionable_select(
  select: MentionableSelect,
): MentionableSelectMenuBuilder {
  return apply_select_base(new MentionableSelectMenuBuilder(), select);
}

/** Converte um menu de seleção de canais. */
export function normalize_channel_select(
  select: ChannelSelect,
): ChannelSelectMenuBuilder {
  const builder = apply_select_base(new ChannelSelectMenuBuilder(), select);

  if (select.channelTypes !== undefined) {
    builder.setChannelTypes(...select.channelTypes);
  }

  return builder;
}

/** Converte um menu de seleção de strings. */
export function normalize_string_select(
  select: StringSelect,
): StringSelectMenuBuilder {
  const builder = apply_select_base(new StringSelectMenuBuilder(), select);

  builder.addOptions(
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

/** Converte qualquer menu de seleção suportado. */
export function normalize_select(
  select: SelectMenu,
):
  | UserSelectMenuBuilder
  | RoleSelectMenuBuilder
  | MentionableSelectMenuBuilder
  | ChannelSelectMenuBuilder
  | StringSelectMenuBuilder {
  switch (select.type) {
    case "select.user":
      return normalize_user_select(select);

    case "select.role":
      return normalize_role_select(select);

    case "select.mentionable":
      return normalize_mentionable_select(select);

    case "select.channel":
      return normalize_channel_select(select);

    case "select.string":
      return normalize_string_select(select);
  }
}
