import {
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from 'discord.js';

import type {
  ChannelSelect,
  SelectBase,
  SelectMenu,
  StringSelect,
  StringSelectOption,
} from '../types';
import { applySelectBase } from '../utils';
import { validateSelect } from '../validators';

/**
 * Creates a Discord user select builder from a public descriptor.
 *
 * @param select User select descriptor.
 * @returns Discord user select builder.
 */
export function normalizeUserSelect(select: SelectBase) {
  validateSelect({ type: 'select.user', ...select });
  return applySelectBase(new UserSelectMenuBuilder(), select);
}

/**
 * Creates a Discord role select builder from a public descriptor.
 *
 * @param select Role select descriptor.
 * @returns Discord role select builder.
 */
export function normalizeRoleSelect(select: SelectBase) {
  validateSelect({ type: 'select.role', ...select });
  return applySelectBase(new RoleSelectMenuBuilder(), select);
}

/**
 * Creates a Discord mentionable select builder from a public descriptor.
 *
 * @param select Mentionable select descriptor.
 * @returns Discord mentionable select builder.
 */
export function normalizeMentionableSelect(select: SelectBase) {
  validateSelect({ type: 'select.mentionable', ...select });
  return applySelectBase(new MentionableSelectMenuBuilder(), select);
}

/**
 * Creates a Discord channel select builder from a public descriptor.
 *
 * @param select Channel select descriptor.
 * @returns Discord channel select builder.
 */
export function normalizeChannelSelect(select: ChannelSelect) {
  validateSelect(select);

  const builder = applySelectBase(new ChannelSelectMenuBuilder(), select);
  if (select.channelTypes?.length) builder.setChannelTypes(...select.channelTypes);
  return builder;
}

/**
 * Creates a Discord string select builder from a public descriptor.
 *
 * @param select String select descriptor.
 * @returns Discord string select builder.
 */
export function normalizeStringSelect(select: StringSelect) {
  validateSelect(select);

  const builder = applySelectBase(new StringSelectMenuBuilder(), select);
  builder.setOptions(
    ...select.options.map((option: StringSelectOption) => ({
      label: option.label,
      value: option.value,
      description: option.description,
      default: option.default,
    })),
  );

  return builder;
}

/**
 * Creates the matching Discord select builder for a public select descriptor.
 *
 * @param select Select descriptor.
 * @returns Discord select builder.
 */
export function normalizeSelect(select: SelectMenu) {
  switch (select.type) {
    case 'select.user':
      return normalizeUserSelect(select);

    case 'select.role':
      return normalizeRoleSelect(select);

    case 'select.mentionable':
      return normalizeMentionableSelect(select);

    case 'select.channel':
      return normalizeChannelSelect(select);

    case 'select.string':
      return normalizeStringSelect(select);

    default:
      throw new Error('Unknown select type');
  }
}
