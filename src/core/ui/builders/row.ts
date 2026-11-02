import type { Row, RowComponent } from "../types";

/**
 * Cria uma linha com botões ou menus de seleção.
 *
 * [pt-BR] Use a linha para agrupar componentes interativos em uma mensagem.
 * [en] Use a row to group interactive components in a message.
 *
 * @param components - [pt-BR] Botões ou menus de seleção.
 * [en] Buttons or select menus.
 */
export function row(...components: RowComponent[]): Row {
  return {
    type: "row",
    components,
  };
}
