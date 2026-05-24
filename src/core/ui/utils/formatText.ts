import type { TextInput, TextStyleOptions } from '../types';

function wrap(content: string, marker: string) {
  return `${marker}${content}${marker}`;
}

function getInlineCodeDelimiter(content: string) {
  let longestRun = 0;
  let currentRun = 0;

  for (const character of content) {
    if (character === '`') {
      currentRun += 1;
      if (currentRun > longestRun) longestRun = currentRun;
      continue;
    }

    currentRun = 0;
  }

  return '`'.repeat(longestRun + 1);
}

/**
 * Normalizes a text input into an array of lines.
 *
 * @param input Text input.
 * @returns Normalized lines.
 */
export function toLines(input: TextInput) {
  return Array.isArray(input) ? input : [input];
}

/**
 * Formats one or more lines using a per-line mapper.
 *
 * @param input Text input.
 * @param formatter Line formatter.
 * @returns Formatted markdown text.
 */
export function formatLines(
  input: TextInput,
  formatter: (line: string, index: number) => string,
) {
  return toLines(input)
    .map((line, index) => formatter(line, index))
    .join('\n');
}

/**
 * Applies markdown formatting to a text payload.
 *
 * @param content Raw text content.
 * @param options Formatting options.
 * @returns Markdown-formatted text.
 */
export function formatText(content: TextInput, options: TextStyleOptions = {}) {
  let formatted = toLines(content).join('\n');

  if (options.underline) formatted = wrap(formatted, '__');
  if (options.italic) formatted = wrap(formatted, '*');
  if (options.bold) formatted = wrap(formatted, '**');

  if (typeof options.size === 'number') {
    const prefix = options.size === 4 ? '-#' : '#'.repeat(options.size);
    return `${prefix} ${formatted}`;
  }

  return formatted;
}

/**
 * Wraps text in inline-code markdown.
 *
 * @param content Raw text content.
 * @returns Inline-code markdown.
 */
export function formatInlineCode(content: TextInput) {
  const text = toLines(content).join('\n');
  const delimiter = getInlineCodeDelimiter(text);
  return `${delimiter}${text}${delimiter}`;
}

/**
 * Formats a markdown quote block.
 *
 * @param input Quote content.
 * @returns Markdown quote text.
 */
export function formatQuote(input: TextInput) {
  return formatLines(input, (line) => `> ${line}`);
}

/**
 * Formats a markdown spoiler block.
 *
 * @param input Spoiler content.
 * @returns Markdown spoiler text.
 */
export function formatSpoiler(input: TextInput) {
  return formatLines(input, (line) => `||${line}||`);
}
