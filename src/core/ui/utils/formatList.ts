import type { TextInput } from '../types';
import { formatLines } from './formatText';

/**
 * Formats a list of text items as markdown.
 *
 * @param items List items.
 * @param options List formatting options.
 * @returns Markdown list.
 */
export function formatList(
  items: TextInput,
  options: { ordered?: boolean } = {},
) {
  return formatLines(items, (item, index) => {
    if (options.ordered) {
      return `${index + 1}. ${item}`;
    }

    return `- ${item}`;
  });
}