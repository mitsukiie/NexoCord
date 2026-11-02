import type { MentionableSelect } from "../../types";

import type { SelectBuilderInput, SelectBuilderOptions } from "./user";

/**
 * [pt-BR] Cria um menu de seleção de entidades mencionáveis.
 * [en] Creates a mentionable select menu.
 */
export function mentionable_select(
  customId: string,
  options?: SelectBuilderOptions,
): MentionableSelect;

export function mentionable_select(
  options: SelectBuilderInput,
): MentionableSelect;

export function mentionable_select(
  customIdOrOptions: string | SelectBuilderInput,
  options: SelectBuilderOptions = {},
): MentionableSelect {
  if (typeof customIdOrOptions === "string") {
    return {
      type: "select.mentionable",
      customId: customIdOrOptions,
      ...options,
    };
  }

  return {
    type: "select.mentionable",
    ...customIdOrOptions,
  };
}
