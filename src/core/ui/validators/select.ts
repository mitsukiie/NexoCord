import type {
  ChannelSelect,
  MentionableSelect,
  RoleSelect,
  SelectBase,
  SelectMenu,
  StringSelect,
  UserSelect,
} from "../types";

import { UI_LIMITS } from "../constants";

export function validate_select_base(select: SelectBase): void {
  if (!select.customId?.trim()) {
    throw new Error("O select precisa possuir um customId.");
  }

  if (select.customId.length > UI_LIMITS.custom_id) {
    throw new Error(
      `O customId do select não pode ultrapassar ${UI_LIMITS.custom_id} caracteres.`,
    );
  }

  if (
    select.placeholder !== undefined &&
    select.placeholder.length > UI_LIMITS.select_placeholder
  ) {
    throw new Error(
      `O placeholder não pode ultrapassar ${UI_LIMITS.select_placeholder} caracteres.`,
    );
  }

  const { minValues, maxValues } = select;

  if (
    minValues !== undefined &&
    (!Number.isInteger(minValues) ||
      minValues < UI_LIMITS.select_min_values ||
      minValues > UI_LIMITS.select_max_values)
  ) {
    throw new Error("O minValues do select é inválido.");
  }

  if (
    maxValues !== undefined &&
    (!Number.isInteger(maxValues) ||
      maxValues < 1 ||
      maxValues > UI_LIMITS.select_max_values)
  ) {
    throw new Error("O maxValues do select é inválido.");
  }

  if (
    minValues !== undefined &&
    maxValues !== undefined &&
    minValues > maxValues
  ) {
    throw new Error("O minValues não pode ser maior que maxValues.");
  }
}

export function validate_string_select(select: StringSelect): void {
  validate_select_base(select);

  if (select.options.length === 0) {
    throw new Error("O select de texto precisa possuir pelo menos uma opção.");
  }

  if (select.options.length > UI_LIMITS.select_options) {
    throw new Error(
      `O select não pode possuir mais de ${UI_LIMITS.select_options} opções.`,
    );
  }

  const values = new Set<string>();

  for (const option of select.options) {
    if (!option.label?.trim()) {
      throw new Error("Todas as opções precisam possuir um label.");
    }

    if (option.label.length > UI_LIMITS.select_option_label) {
      throw new Error(
        `O label de uma opção não pode ultrapassar ${UI_LIMITS.select_option_label} caracteres.`,
      );
    }

    if (!option.value?.trim()) {
      throw new Error("Todas as opções precisam possuir um value.");
    }

    if (option.value.length > UI_LIMITS.select_option_value) {
      throw new Error(
        `O value de uma opção não pode ultrapassar ${UI_LIMITS.select_option_value} caracteres.`,
      );
    }

    if (
      option.description !== undefined &&
      option.description.length > UI_LIMITS.select_option_description
    ) {
      throw new Error(
        `A descrição de uma opção não pode ultrapassar ${UI_LIMITS.select_option_description} caracteres.`,
      );
    }

    if (values.has(option.value)) {
      throw new Error(`O value "${option.value}" está duplicado no select.`);
    }

    values.add(option.value);
  }
}

export function validate_user_select(select: UserSelect): void {
  validate_select_base(select);
}

export function validate_role_select(select: RoleSelect): void {
  validate_select_base(select);
}

export function validate_mentionable_select(select: MentionableSelect): void {
  validate_select_base(select);
}

export function validate_channel_select(select: ChannelSelect): void {
  validate_select_base(select);
}

export function validate_select(select: SelectMenu): void {
  switch (select.type) {
    case "select.user":
      validate_user_select(select);
      break;

    case "select.role":
      validate_role_select(select);
      break;

    case "select.mentionable":
      validate_mentionable_select(select);
      break;

    case "select.channel":
      validate_channel_select(select);
      break;

    case "select.string":
      validate_string_select(select);
      break;
  }
}
