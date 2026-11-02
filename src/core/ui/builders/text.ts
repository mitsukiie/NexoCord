import type { TextComponent, TextInput, TextStyleOptions } from '../types';

/** Formata uma lista de textos em linhas separadas. */
function format_list(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

/** Formata uma lista numerada. */
function format_ordered(items: readonly string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

/** Formata conteúdo como código. */
function format_code(content: string): string {
  const matches = content.match(/`+/g) ?? [];
  const longest = Math.max(0, ...matches.map((match) => match.length));
  const fence = '`'.repeat(Math.max(3, longest + 1));

  return content.includes('\n')
    ? `${fence}\n${content}\n${fence}`
    : `${fence}${content}${fence}`;
}

/** Formata conteúdo como citação. */
function format_quote(content: string): string {
  return content
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}

/** Formata conteúdo como spoiler. */
function format_spoiler(content: string): string {
  return `||${content}||`;
}

/** Aplica as opções de formatação ao texto. */
function format_text(content: TextInput, options: TextStyleOptions = {}): string {
  let result = Array.isArray(content) ? content.join('\n') : (content as string);

  if (options.underline) result = `__${result}__`;
  if (options.italic) result = `*${result}*`;
  if (options.bold) result = `**${result}**`;

  if (options.size !== undefined) {
    result =
      options.size === 4 ? `-# ${result}` : `${'#'.repeat(options.size)} ${result}`;
  }

  return result;
}

/**
 * Cria um componente de texto.
 *
 * [pt-BR] Aceita texto simples, várias linhas e opções de formatação Markdown.
 * [en] Accepts plain text, multiple lines, and Markdown formatting options.
 *
 * @param content - [pt-BR] Conteúdo exibido.
 * [en] Content to display.
 * @param options - [pt-BR] Formatação opcional.
 * [en] Optional formatting.
 */
function build_text(content: TextInput, options: TextStyleOptions = {}): TextComponent {
  return {
    type: 'text',
    content: format_text(content, options),
  };
}

/**
 * Métodos auxiliares disponíveis no construtor de texto.
 *
 * [pt-BR] Use estes métodos para gerar formatos comuns sem escrever a sintaxe
 * Markdown manualmente.
 * [en] Use these methods to create common formats without writing Markdown
 * syntax manually.
 */
type TextBuilder = typeof build_text & {
  /**
   * [pt-BR] Cria uma lista não ordenada.
   * [en] Creates an unordered list.
   */
  list(items: readonly string[]): TextComponent;

  /**
   * [pt-BR] Cria uma lista ordenada.
   * [en] Creates an ordered list.
   */
  ordered(items: readonly string[]): TextComponent;

  /**
   * [pt-BR] Cria um bloco de código.
   * [en] Creates a code block.
   */
  code(content: string): TextComponent;

  /**
   * [pt-BR] Cria uma citação.
   * [en] Creates a quote.
   */
  quote(content: string): TextComponent;

  /**
   * [pt-BR] Cria um spoiler.
   * [en] Creates a spoiler.
   */
  spoiler(content: string): TextComponent;
};

/** Construtor de texto com seus métodos auxiliares. */
export const text: TextBuilder = Object.assign(build_text, {
  list: (items: readonly string[]) => build_text(format_list(items)),

  ordered: (items: readonly string[]) => build_text(format_ordered(items)),

  code: (content: string) => build_text(format_code(content)),

  quote: (content: string) => build_text(format_quote(content)),

  spoiler: (content: string) => build_text(format_spoiler(content)),
});
