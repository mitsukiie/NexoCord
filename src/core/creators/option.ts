import {
  ApplicationCommandOptionType,
  type APIApplicationCommandOptionChoice,
  type ChannelType,
} from 'discord.js';

type BaseOption = {
  name: string;
  description: string;
  required?: boolean;
};

type AutocompleteOption = {
  autocomplete: true;
  choices?: never;
};

type ChoicesOption<T> = {
  autocomplete?: false;
  choices?: T[];
};

type StringOption = BaseOption &
  (AutocompleteOption | ChoicesOption<APIApplicationCommandOptionChoice<string>>) & {
    minLength?: number;
    maxLength?: number;
  };

type IntegerOption = BaseOption &
  (AutocompleteOption | ChoicesOption<APIApplicationCommandOptionChoice<number>>) & {
    minValue?: number;
    maxValue?: number;
  };

type NumberOption = BaseOption &
  (AutocompleteOption | ChoicesOption<APIApplicationCommandOptionChoice<number>>) & {
    minValue?: number;
    maxValue?: number;
  };

type BooleanOption = BaseOption;

type UserOption = BaseOption;

type ChannelOption = BaseOption & {
  channelTypes?: ChannelType[];
};

type RoleOption = BaseOption;

type MentionableOption = BaseOption;

type AttachmentOption = BaseOption;

/**
 * Cria opções para os parâmetros de comandos de entrada de texto.
 *
 * [pt-BR] Use os métodos para declarar o tipo, descrição, obrigatoriedade e
 * restrições de cada opção.
 * [en] Use the methods to declare each option's type, description, required
 * state, and constraints.
 */
export const option = {
  /**
   * [pt-BR] Define uma opção de texto para um comando.
   * [en] Defines a string option for a command.
   */
  string(options: StringOption) {
    return {
      type: ApplicationCommandOptionType.String,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção de número inteiro para um comando.
   * [en] Defines an integer option for a command.
   */
  integer(options: IntegerOption) {
    return {
      type: ApplicationCommandOptionType.Integer,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção de número decimal para um comando.
   * [en] Defines a number option for a command.
   */
  number(options: NumberOption) {
    return {
      type: ApplicationCommandOptionType.Number,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção booleana para um comando.
   * [en] Defines a boolean option for a command.
   */
  boolean(options: BooleanOption) {
    return {
      type: ApplicationCommandOptionType.Boolean,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção que recebe um usuário.
   * [en] Defines an option that receives a user.
   */
  user(options: UserOption) {
    return {
      type: ApplicationCommandOptionType.User,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção que recebe um canal.
   * [en] Defines an option that receives a channel.
   */
  channel(options: ChannelOption) {
    return {
      type: ApplicationCommandOptionType.Channel,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção que recebe um cargo.
   * [en] Defines an option that receives a role.
   */
  role(options: RoleOption) {
    return {
      type: ApplicationCommandOptionType.Role,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção que recebe usuário, cargo ou entidade mencionável.
   * [en] Defines an option that receives a user, role, or mentionable entity.
   */
  mentionable(options: MentionableOption) {
    return {
      type: ApplicationCommandOptionType.Mentionable,
      ...options,
    } as const;
  },

  /**
   * [pt-BR] Define uma opção que recebe um anexo.
   * [en] Defines an option that receives an attachment.
   */
  attachment(options: AttachmentOption) {
    return {
      type: ApplicationCommandOptionType.Attachment,
      ...options,
    } as const;
  },
};
