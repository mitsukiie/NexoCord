import type {
  Button,
  ContainerNode,
  ContainerOptions,
  Row,
  SectionComponent,
  SeparatorComponent,
  TextComponent,
} from "../types";

import { UI_LIMITS, UI_REGEX } from "../constants";
import { validate_button } from "./button";
import { validate_file, validate_gallery, validate_thumbnail } from "./media";
import { validate_select } from "./select";

export function validate_color(color: number | string): number {
  if (typeof color === "number") {
    if (!Number.isInteger(color) || color < 0 || color > 0xffffff) {
      throw new Error(
        "A cor do container precisa ser um número hexadecimal válido.",
      );
    }

    return color;
  }

  if (!UI_REGEX.hex_color.test(color)) {
    throw new Error(
      "A cor do container precisa estar no formato hexadecimal #RRGGBB.",
    );
  }

  return Number.parseInt(color.replace("#", ""), 16);
}

export function validate_container_options(options: ContainerOptions): void {
  if (options.color !== undefined) {
    validate_color(options.color);
  }
}

export function validate_text(text: TextComponent): void {
  if (!text.content.trim()) {
    throw new Error("O texto não pode estar vazio.");
  }

  if (text.content.length > UI_LIMITS.text_content) {
    throw new Error(
      `O texto não pode ultrapassar ${UI_LIMITS.text_content} caracteres.`,
    );
  }
}

export function validate_separator(_separator: SeparatorComponent): void {
  // As opções do separador são limitadas pelos tipos do Discord.js.
}

export function validate_section(section: SectionComponent): void {
  if (
    section.texts.length > UI_LIMITS.section_texts
  ) {
    throw new Error(
      `Uma section precisa possuir entre 1 e ${UI_LIMITS.section_texts} textos.`,
    );
  }

  for (const content of section.texts) {
    validate_text({ type: "text", content });
  }

  if (section.button && section.thumbnail) {
    throw new Error(
      "Uma section não pode possuir button e thumbnail ao mesmo tempo.",
    );
  }

  if (section.button) {
    validate_button(section.button);
  }

  if (section.thumbnail) {
    validate_thumbnail(section.thumbnail);
  }
}

export function validate_row(row: Row): void {
  if (row.components.length === 0) {
    throw new Error("Uma row precisa possuir pelo menos um componente.");
  }

  if (row.components.length > UI_LIMITS.row_components) {
    throw new Error(
      `Uma row não pode possuir mais de ${UI_LIMITS.row_components} componentes.`,
    );
  }

  const has_select = row.components.some(
    (component) => "type" in component && component.type.startsWith("select."),
  );

  if (has_select && row.components.length > 1) {
    throw new Error("Uma row com select não pode possuir outros componentes.");
  }

  for (const component of row.components) {
    if ("label" in component) {
      validate_button(component as Button);
    } else {
      validate_select(component);
    }
  }
}

export function validate_node(node: ContainerNode): void {
  switch (node.type) {
    case "text":
      validate_text(node);
      break;

    case "separator":
      validate_separator(node);
      break;

    case "section":
      validate_section(node);
      break;

    case "row":
      validate_row(node);
      break;

    case "gallery":
      validate_gallery(node);
      break;

    case "file":
      validate_file(node);
      break;
  }
}

export function validate_container(
  nodes: readonly ContainerNode[],
  options?: ContainerOptions,
): void {
  if (nodes.length === 0) {
    throw new Error("O container precisa possuir pelo menos um componente.");
  }

  if (nodes.length > UI_LIMITS.container_components) {
    throw new Error(
      `O container não pode possuir mais de ${UI_LIMITS.container_components} componentes.`,
    );
  }

  if (options) {
    validate_container_options(options);
  }

  for (const node of nodes) {
    validate_node(node);
  }
}
