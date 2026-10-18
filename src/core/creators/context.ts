import {
  MessageFlags,
  MessageFlagsBitField,
  type Client,
  type InteractionReplyOptions,
  type MessageFlagsResolvable,
} from "discord.js";

import type { CommandInteraction, CommandType, DisplayInput } from "@types";

import { prepare_components } from "../ui/normalize";

type ReplyFiles = NonNullable<InteractionReplyOptions["files"]>;
type ReplyComponents = NonNullable<InteractionReplyOptions["components"]>;

export type ContextReplyOptions = Omit<
  InteractionReplyOptions,
  "components" | "flags" | "files"
> & {
  components?: DisplayInput | DisplayInput[];
  flags?: InteractionReplyOptions["flags"];
  files?: ReplyFiles;
};

function resolve_flags(flags: InteractionReplyOptions["flags"]): number {
  return flags === undefined
    ? 0
    : MessageFlagsBitField.resolve(flags as MessageFlagsResolvable);
}

export function create_context<T extends CommandType>(
  interaction: CommandInteraction<T>,
  client: Client,
) {
  return {
    interaction,
    client,

    async reply(options: ContextReplyOptions) {
      const { components, flags, files, ...rest } = options;

      if (
        components === undefined ||
        (Array.isArray(components) && components.length === 0)
      ) {
        return interaction.reply({
          ...rest,
          ...(flags !== undefined && { flags }),
          ...(files?.length && { files }),
        });
      }

      if (
        rest.content !== undefined ||
        (rest.embeds !== undefined && rest.embeds.length > 0)
      ) {
        throw new Error(
          "Os Componentes V2 não podem ser combinados com content ou embeds.",
        );
      }

      const prepared = prepare_components(
        Array.isArray(components) ? components : [components],
      );

      const all_files: ReplyFiles = [...prepared.files, ...(files ?? [])];

      const reply_components: ReplyComponents = prepared.components;

      return interaction.reply({
        ...rest,
        flags: resolve_flags(flags) | MessageFlags.IsComponentsV2,
        components: reply_components,
        ...(all_files.length > 0 && { files: all_files }),
      });
    },
  };
}

export type CommandContext<T extends CommandType = CommandType> = ReturnType<
  typeof create_context<T>
>;
