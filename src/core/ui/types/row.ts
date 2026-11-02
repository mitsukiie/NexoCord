import type { ActionRowBuilder, AnyComponentBuilder } from "discord.js";

import type { Button } from "./button";
import type { SelectMenu } from "./select";

/**
 * [pt-BR] Componente aceito dentro de uma linha de ações.
 * [en] Component accepted inside an action row.
 */
export type RowComponent = Button | SelectMenu;

/**
 * [pt-BR] Linha de ações criada pela API do NexoCord.
 * [en] Action row created by the NexoCord API.
 */
export type Row = {
  type: "row";

  /**
   * [pt-BR] Botões ou menus de seleção presentes na linha.
   * [en] Buttons or select menus in the row.
   */
  components: readonly RowComponent[];
};

/**
 * [pt-BR] Linha de ações já construída pelo Discord.js.
 * [en] Action row already built by Discord.js.
 */
export type ActionRow = ActionRowBuilder<AnyComponentBuilder>;
