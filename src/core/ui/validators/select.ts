import { MAX_SELECT_PLACEHOLDER_LENGTH, MAX_STRING_SELECT_OPTIONS } from '../constants';

import type { SelectMenu } from '../types';

function hasLengthBetween(value: string | undefined, min: number, max: number) {
  if (!value) return false;
  return value.length >= min && value.length <= max;
}

/**
 * Validates a public select menu descriptor.
 *
 * @param select Select menu data to validate.
 */
export function validateSelect(select: SelectMenu) {
  if (!hasLengthBetween(select.id, 1, 100)) {
    throw new Error('Select custom id must have between 1 and 100 characters.');
  }

  if (select.placeholder && select.placeholder.length > MAX_SELECT_PLACEHOLDER_LENGTH) {
    throw new Error('Select placeholder cannot exceed 150 characters.');
  }

  if (select.type === 'select.string') {
    if (select.options.length < 1 || select.options.length > MAX_STRING_SELECT_OPTIONS) {
      throw new Error('String select must contain between 1 and 25 options.');
    }
  }
}
