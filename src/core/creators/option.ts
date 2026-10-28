import {
  ApplicationCommandOptionType,
  type APIApplicationCommandOptionChoice,
  type ChannelType,
} from "discord.js";

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
  (
    | AutocompleteOption
    | ChoicesOption<APIApplicationCommandOptionChoice<string>>
  ) & {
    minLength?: number;
    maxLength?: number;
  };

type IntegerOption = BaseOption &
  (
    | AutocompleteOption
    | ChoicesOption<APIApplicationCommandOptionChoice<number>>
  ) & {
    minValue?: number;
    maxValue?: number;
  };

type NumberOption = BaseOption &
  (
    | AutocompleteOption
    | ChoicesOption<APIApplicationCommandOptionChoice<number>>
  ) & {
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

export const option = {
  /** Define uma opção de texto para um comando. */
  string(options: StringOption) {
    return {
      type: ApplicationCommandOptionType.String,
      ...options,
    } as const;
  },

  /** Define uma opção de número inteiro para um comando. */
  integer(options: IntegerOption) {
    return {
      type: ApplicationCommandOptionType.Integer,
      ...options,
    } as const;
  },

  /** Define uma opção de número decimal para um comando. */
  number(options: NumberOption) {
    return {
      type: ApplicationCommandOptionType.Number,
      ...options,
    } as const;
  },

  /** Define uma opção booleana para um comando. */
  boolean(options: BooleanOption) {
    return {
      type: ApplicationCommandOptionType.Boolean,
      ...options,
    } as const;
  },

  /** Define uma opção que recebe um usuário. */
  user(options: UserOption) {
    return {
      type: ApplicationCommandOptionType.User,
      ...options,
    } as const;
  },

  /** Define uma opção que recebe um canal. */
  channel(options: ChannelOption) {
    return {
      type: ApplicationCommandOptionType.Channel,
      ...options,
    } as const;
  },

  /** Define uma opção que recebe um cargo. */
  role(options: RoleOption) {
    return {
      type: ApplicationCommandOptionType.Role,
      ...options,
    } as const;
  },

  /** Define uma opção que recebe um usuário, cargo ou outra entidade mencionável. */
  mentionable(options: MentionableOption) {
    return {
      type: ApplicationCommandOptionType.Mentionable,
      ...options,
    } as const;
  },

  /** Define uma opção que recebe um anexo. */
  attachment(options: AttachmentOption) {
    return {
      type: ApplicationCommandOptionType.Attachment,
      ...options,
    } as const;
  },
};
