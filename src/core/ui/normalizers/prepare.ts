import type { InteractionReplyOptions } from 'discord.js';

import type { DisplayInput } from '../types';

import { collect_component_attachments, to_display_components } from './component';

type ReplyFiles = NonNullable<InteractionReplyOptions['files']>;

export type PreparedComponents = {
  components: ReturnType<typeof to_display_components>;
  files: ReplyFiles;
};

/**
 * Normaliza os componentes da API do NexoCord para builders do Discord.js.
 *
 * Também coleta os arquivos utilizados pelos componentes,
 * inclusive aqueles que estão dentro de containers.
 */
export function prepare_components(
  input: DisplayInput | readonly DisplayInput[],
): PreparedComponents {
  const components = to_display_components(Array.isArray(input) ? input : [input]);

  const files = collect_component_attachments(components) as ReplyFiles;

  return {
    components,
    files,
  };
}
