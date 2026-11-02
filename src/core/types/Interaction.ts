import type { InteractionReplyOptions } from "discord.js";

import type { DisplayInput } from "../ui/types";

type ReplyFiles = NonNullable<InteractionReplyOptions["files"]>;

/**
 * Opções de mensagem aceitas pelo NexoCord.
 *
 * @description
 * [pt-BR] Permite usar componentes declarativos da API `ui` sem construí-los
 * manualmente com o Discord.js.
 * [en] Lets you use declarative `ui` components without building them manually
 * with Discord.js.
 */
export type InteractionMessageOptions = Omit<
  InteractionReplyOptions,
  "components" | "files"
> & {
  components?: DisplayInput | readonly DisplayInput[];
  files?: ReplyFiles;
};
