import type { ChannelType } from 'discord.js';

/**
 * [pt-BR] Identificador e opções compartilhadas entre menus de seleção.
 * [en] Identifier and options shared by select menus.
 */
export type SelectBase = {
  /**
   * [pt-BR] Identificador personalizado do menu.
   * [en] Custom identifier for the menu.
   */
  customId: string;

  /**
   * [pt-BR] Texto exibido quando nenhuma opção foi selecionada.
   * [en] Text shown when no option is selected.
   */
  placeholder?: string;

  /**
   * [pt-BR] Quantidade mínima de opções selecionáveis.
   * [en] Minimum number of selectable options.
   */
  minValues?: number;

  /**
   * [pt-BR] Quantidade máxima de opções selecionáveis.
   * [en] Maximum number of selectable options.
   */
  maxValues?: number;

  /**
   * [pt-BR] Indica se o menu ficará desabilitado.
   * [en] Whether the menu is disabled.
   */
  disabled?: boolean;
};

/**
 * [pt-BR] Opção disponível em um menu de seleção de strings.
 * [en] Option available in a string select menu.
 */
export type StringSelectOption = {
  /**
   * [pt-BR] Texto apresentado ao usuário.
   * [en] Text presented to the user.
   */
  label: string;

  /**
   * [pt-BR] Valor retornado quando a opção é selecionada.
   * [en] Value returned when the option is selected.
   */
  value: string;

  /**
   * [pt-BR] Descrição complementar da opção.
   * [en] Additional option description.
   */
  description?: string;

  /**
   * [pt-BR] Indica se a opção estará selecionada inicialmente.
   * [en] Whether the option is initially selected.
   */
  default?: boolean;
};

/**
 * [pt-BR] Menu de seleção de usuários.
 * [en] User select menu.
 */
export type UserSelect = SelectBase & {
  type: 'select.user';
};

/**
 * [pt-BR] Menu de seleção de cargos.
 * [en] Role select menu.
 */
export type RoleSelect = SelectBase & {
  type: 'select.role';
};

/**
 * [pt-BR] Menu de seleção de entidades mencionáveis.
 * [en] Mentionable select menu.
 */
export type MentionableSelect = SelectBase & {
  type: 'select.mentionable';
};

/**
 * [pt-BR] Menu de seleção de canais.
 * [en] Channel select menu.
 */
export type ChannelSelect = SelectBase & {
  type: 'select.channel';

  /**
   * [pt-BR] Tipos de canais que poderão ser selecionados.
   * [en] Channel types that can be selected.
   */
  channelTypes?: readonly ChannelType[];
};

/**
 * [pt-BR] Menu de seleção de opções personalizadas.
 * [en] Custom-option select menu.
 */
export type StringSelect = SelectBase & {
  type: 'select.string';

  /**
   * [pt-BR] Opções disponíveis para seleção.
   * [en] Options available for selection.
   */
  options: readonly StringSelectOption[];
};

/**
 * [pt-BR] União de todos os menus de seleção suportados.
 * [en] Union of all supported select menus.
 */
export type SelectMenu =
  UserSelect | RoleSelect | MentionableSelect | ChannelSelect | StringSelect;
