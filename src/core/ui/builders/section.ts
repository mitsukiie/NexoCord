import type { SectionComponent, SectionOptions, SectionTexts } from "../types";

/**
 * Cria uma seção com até três textos e um acessório opcional.
 *
 * [pt-BR] Use `button` ou `thumbnail` nas opções para adicionar o acessório da seção.
 * [en] Use `button` or `thumbnail` in the options to add the section accessory.
 *
 * @param texts - [pt-BR] Um a três textos exibidos na seção.
 * [en] One to three texts displayed in the section.
 * @param options - [pt-BR] Acessório opcional.
 * [en] Optional accessory.
 */
export function section(
  texts: SectionTexts,
  options: SectionOptions = {},
): SectionComponent {
  return {
    type: "section",
    texts,
    ...options,
  };
}
