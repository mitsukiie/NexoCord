import type {
  Button,
  DisplayComponent,
  MediaItem,
  RowComponent,
  SectionComponent,
  SelectMenu,
} from "../types";

const HTTP_URL_PATTERN = /^https?:\/\/.+/i;
const ATTACHMENT_URL_PATTERN = /^attachment:\/\/.+/i;
const HEX_COLOR_PATTERN = /^(?:#|0x)?([0-9a-fA-F]{6})$/;

function has_length_between(
  value: string | undefined,
  min: number,
  max: number,
): boolean {
  if (value === undefined) return false;

  return value.length >= min && value.length <= max;
}

export const validate = {
  components(components: readonly DisplayComponent[]): void {
    if (components.length > 40) {
      throw new Error("A mensagem não pode conter mais de 40 componentes.");
    }
  },

  text(content: string): void {
    if (content.length > 4000) {
      throw new Error("O texto de exibição não pode exceder 4000 caracteres.");
    }
  },

  url(url: string): void {
    if (!HTTP_URL_PATTERN.test(url)) {
      throw new Error("A URL deve começar com http:// ou https://.");
    }
  },

  attachment_url(url: string): void {
    if (!ATTACHMENT_URL_PATTERN.test(url)) {
      throw new Error("A URL do arquivo deve começar com attachment://.");
    }
  },

  button(button: Button): void {
    if (!has_length_between(button.label, 1, 80)) {
      throw new Error("O rótulo do botão deve ter entre 1 e 80 caracteres.");
    }

    if (!has_length_between(button.customId, 1, 100)) {
      throw new Error("O customId do botão deve ter entre 1 e 100 caracteres.");
    }
  },

  row(components: readonly RowComponent[]): void {
    if (components.length < 1 || components.length > 5) {
      throw new Error("A linha de ação deve conter entre 1 e 5 componentes.");
    }

    const select_count = components.filter(
      (component) => !("label" in component),
    ).length;

    if (select_count > 0 && components.length > 1) {
      throw new Error(
        "Menus de seleção devem ocupar a linha de ação sozinhos.",
      );
    }
  },

  select(select: SelectMenu): void {
    if (!has_length_between(select.id, 1, 100)) {
      throw new Error(
        "O ID do menu de seleção deve ter entre 1 e 100 caracteres.",
      );
    }

    if (select.placeholder !== undefined && select.placeholder.length > 150) {
      throw new Error(
        "O placeholder do menu de seleção não pode exceder 150 caracteres.",
      );
    }

    if (select.minValues !== undefined && select.minValues < 0) {
      throw new Error("O valor de minValues não pode ser negativo.");
    }

    if (select.maxValues !== undefined && select.maxValues < 1) {
      throw new Error("O valor de maxValues deve ser pelo menos 1.");
    }

    if (
      select.minValues !== undefined &&
      select.maxValues !== undefined &&
      select.minValues > select.maxValues
    ) {
      throw new Error("minValues não pode ser maior que maxValues.");
    }

    if (select.type === "select.string") {
      if (select.options.length < 1 || select.options.length > 25) {
        throw new Error(
          "O menu de seleção de texto deve conter entre 1 e 25 opções.",
        );
      }

      for (const option of select.options) {
        if (!has_length_between(option.label, 1, 100)) {
          throw new Error(
            "O rótulo de cada opção deve ter entre 1 e 100 caracteres.",
          );
        }

        if (!has_length_between(option.value, 1, 100)) {
          throw new Error(
            "O valor de cada opção deve ter entre 1 e 100 caracteres.",
          );
        }

        if (
          option.description !== undefined &&
          option.description.length > 100
        ) {
          throw new Error(
            "A descrição de cada opção não pode exceder 100 caracteres.",
          );
        }
      }
    }
  },

  section(section: SectionComponent): void {
    if (section.texts.length < 1 || section.texts.length > 3) {
      throw new Error("A seção deve conter entre 1 e 3 blocos de texto.");
    }
  },

  color(color: number | string): number {
    if (typeof color === "number") {
      if (!Number.isInteger(color) || color < 0 || color > 0xffffff) {
        throw new Error(
          "A cor do container deve ser um número inteiro entre 0x000000 e 0xFFFFFF.",
        );
      }

      return color;
    }

    const match = color.match(HEX_COLOR_PATTERN);

    if (!match) {
      throw new Error(
        "A cor de destaque do container deve ser um número entre 0x000000 e 0xFFFFFF ou uma string hexadecimal, como #000000, 0x000000 ou 000000.",
      );
    }

    const hex = match[1];

    if (hex === undefined) {
      throw new Error("O valor hexadecimal da cor é inválido.");
    }

    return Number.parseInt(hex, 16);
  },

  gallery(items: readonly MediaItem[]): void {
    if (items.length < 1 || items.length > 10) {
      throw new Error("A galeria deve conter entre 1 e 10 itens.");
    }
  },
};
