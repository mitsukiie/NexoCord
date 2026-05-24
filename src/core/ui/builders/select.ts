import type { ChannelType } from 'discord.js';

import type {
  ChannelSelect,
  MentionableSelect,
  RoleSelect,
  SelectBase,
  StringSelect,
  StringSelectOption,
  UserSelect,
} from '../types';
import { resolveSelectBase } from '../utils';

type SelectBuilderOptions = Omit<SelectBase, 'id'>;
type SelectBuilderInput = SelectBuilderOptions & { customId: SelectBase['id'] };
type ChannelSelectBuilderInput = SelectBuilderInput & {
  channelTypes?: readonly ChannelType[];
};
type StringSelectBuilderInput = SelectBuilderInput & {
  options: readonly StringSelectOption[];
};

function createSelect<TType extends string>(
  type: TType,
  customId: SelectBase['id'],
  opts?: SelectBuilderOptions,
) {
  return {
    type,
    ...resolveSelectBase(customId, opts),
  } as SimpleSelect<TType & SimpleSelectType>;
}

function createSelectFromObject<TType extends string>(
  type: TType,
  customIdOrOpts: SelectBuilderInput,
) {
  const { customId, ...selectOptions } = customIdOrOpts;
  return {
    type,
    ...resolveSelectBase({ customId, ...selectOptions }),
  } as SimpleSelect<TType & SimpleSelectType>;
}

type SimpleSelectType =
  | UserSelect['type']
  | RoleSelect['type']
  | MentionableSelect['type'];
type SimpleSelect<TType extends SimpleSelectType> = Extract<
  import('../types').SelectMenu,
  { type: TType }
>;
type SimpleSelectBuilder<TType extends SimpleSelectType> = {
  (customId: SelectBase['id'], opts?: SelectBuilderOptions): SimpleSelect<TType>;
  (opts: SelectBuilderInput): SimpleSelect<TType>;
};

function createSimpleSelectBuilder<TType extends SimpleSelectType>(
  type: TType,
): SimpleSelectBuilder<TType> {
  function build(
    customId: SelectBase['id'],
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType>;
  function build(opts: SelectBuilderInput): SimpleSelect<TType>;
  function build(
    customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
    opts?: SelectBuilderOptions,
  ): SimpleSelect<TType> {
    return typeof customIdOrOpts === 'string'
      ? createSelect(type, customIdOrOpts, opts)
      : createSelectFromObject(type, customIdOrOpts);
  }

  return build;
}

const userSelect = createSimpleSelectBuilder('select.user');
const roleSelect = createSimpleSelectBuilder('select.role');
const mentionableSelect = createSimpleSelectBuilder('select.mentionable');

/**
 * Creates a public user-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public user-select descriptor.
 */
export function user(customId: SelectBase['id'], opts?: SelectBuilderOptions): UserSelect;
export function user(opts: SelectBuilderInput): UserSelect;
export function user(
  customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
  opts?: SelectBuilderOptions,
): UserSelect {
  return typeof customIdOrOpts === 'string'
    ? userSelect(customIdOrOpts, opts)
    : userSelect(customIdOrOpts);
}

/**
 * Creates a public role-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public role-select descriptor.
 */
export function role(customId: SelectBase['id'], opts?: SelectBuilderOptions): RoleSelect;
export function role(opts: SelectBuilderInput): RoleSelect;
export function role(
  customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
  opts?: SelectBuilderOptions,
): RoleSelect {
  return typeof customIdOrOpts === 'string'
    ? roleSelect(customIdOrOpts, opts)
    : roleSelect(customIdOrOpts);
}

/**
 * Creates a public mentionable-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public mentionable-select descriptor.
 */
export function mentionable(
  customId: SelectBase['id'],
  opts?: SelectBuilderOptions,
): MentionableSelect;
export function mentionable(opts: SelectBuilderInput): MentionableSelect;
export function mentionable(
  customIdOrOpts: SelectBase['id'] | SelectBuilderInput,
  opts?: SelectBuilderOptions,
): MentionableSelect {
  return typeof customIdOrOpts === 'string'
    ? mentionableSelect(customIdOrOpts, opts)
    : mentionableSelect(customIdOrOpts);
}

/**
 * Creates a public channel-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param channelTypes Optional channel type filter list.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public channel-select descriptor.
 */
export function channel(
  customId: SelectBase['id'],
  channelTypes?: readonly ChannelType[],
  opts?: SelectBuilderOptions,
): ChannelSelect;
export function channel(opts: ChannelSelectBuilderInput): ChannelSelect;
export function channel(
  customIdOrOpts: SelectBase['id'] | ChannelSelectBuilderInput,
  channelTypes?: readonly ChannelType[] | SelectBuilderOptions,
  opts: SelectBuilderOptions = {},
): ChannelSelect {
  if (typeof customIdOrOpts !== 'string') {
    const { channelTypes: resolvedChannelTypes, ...select } = customIdOrOpts;
    return {
      type: 'select.channel' as const,
      ...resolveSelectBase(select),
      channelTypes: resolvedChannelTypes,
    };
  }

  const resolvedOpts = Array.isArray(channelTypes)
    ? opts
    : (channelTypes as SelectBuilderOptions | undefined);

  return {
    type: 'select.channel' as const,
    ...resolveSelectBase(customIdOrOpts, resolvedOpts),
    channelTypes: Array.isArray(channelTypes) ? channelTypes : undefined,
  };
}

/**
 * Creates a public string-select descriptor.
 *
 * @param customId Custom id or full select config.
 * @param options Select options when a custom id is provided.
 * @param opts Optional select configuration when a custom id is provided.
 * @returns Public string-select descriptor.
 */
export function string(
  customId: SelectBase['id'],
  options: readonly StringSelectOption[],
  opts?: SelectBuilderOptions,
): StringSelect;
export function string(opts: StringSelectBuilderInput): StringSelect;
export function string(
  customIdOrOpts: SelectBase['id'] | StringSelectBuilderInput,
  options?: readonly StringSelectOption[] | SelectBuilderOptions,
  opts: SelectBuilderOptions = {},
): StringSelect {
  if (typeof customIdOrOpts !== 'string') {
    const { options: stringOptions, ...select } = customIdOrOpts;
    return {
      type: 'select.string' as const,
      ...resolveSelectBase(select),
      options: stringOptions,
    };
  }

  return {
    type: 'select.string' as const,
    ...resolveSelectBase(customIdOrOpts, Array.isArray(options) ? opts : {}),
    options: Array.isArray(options) ? options : [],
  };
}
