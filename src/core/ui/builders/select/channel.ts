import type {
  ChannelType,
} from 'discord.js';

import type {
  ChannelSelect,
} from '../../types';

import type {
  SelectBuilderInput,
  SelectBuilderOptions,
} from './user';

/**
 * [pt-BR] Entrada de um menu de canais com tipos definidos.
 * [en] Channel menu input with channel types.
 */
export type ChannelSelectBuilderInput = SelectBuilderInput & {
  channelTypes?: readonly ChannelType[];
};

/**
 * [pt-BR] Cria um menu de seleção de canais.
 * [en] Creates a channel select menu.
 */
export function channel_select(
  customId: string,
  channelTypes?: readonly ChannelType[],
  options?: SelectBuilderOptions,
): ChannelSelect;

export function channel_select(
  customId: string,
  options?: SelectBuilderOptions,
): ChannelSelect;

export function channel_select(
  options: ChannelSelectBuilderInput,
): ChannelSelect;

export function channel_select(
  customIdOrOptions: string | ChannelSelectBuilderInput,
  channelTypesOrOptions?: readonly ChannelType[] | SelectBuilderOptions,
  options: SelectBuilderOptions = {},
): ChannelSelect {
  if (typeof customIdOrOptions !== 'string') {
    return {
      type: 'select.channel',
      ...customIdOrOptions,
    };
  }

  const hasChannelTypes = Array.isArray(channelTypesOrOptions);

  return {
    type: 'select.channel',
    customId: customIdOrOptions,
    ...(hasChannelTypes
      ? { channelTypes: channelTypesOrOptions as readonly ChannelType[] }
      : channelTypesOrOptions as SelectBuilderOptions | undefined),
    ...(hasChannelTypes ? options : {}),
  };
}