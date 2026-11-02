import {
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  MessageFlags,
  MessageFlagsBitField,
  type InteractionCallbackResponse,
  type InteractionEditReplyOptions,
  type InteractionUpdateOptions,
  type MessageComponentInteraction,
  type MessageFlagsResolvable,
} from 'discord.js';

import type {
  CommandInteraction,
  CommandType,
  InteractionMessageOptions,
} from '../types';

import { prepare_components } from '../ui/normalizers';

type BaseInteraction<T extends CommandType> =
  CommandInteraction<T> | MessageComponentInteraction;

/**
 * Verifica se os componentes recebidos pertencem ao sistema Components V2.
 */
function is_v2_component(component: unknown): boolean {
  if (!component || typeof component !== 'object') {
    return false;
  }

  if (
    component instanceof ContainerBuilder ||
    component instanceof FileBuilder ||
    component instanceof MediaGalleryBuilder ||
    component instanceof SectionBuilder ||
    component instanceof SeparatorBuilder ||
    component instanceof TextDisplayBuilder
  ) {
    return true;
  }

  if ('type' in component) {
    return ['text', 'separator', 'section', 'gallery', 'file'].includes(
      String(component.type),
    );
  }

  return false;
}

/**
 * Prepara as opções de mensagem para envio ao Discord.
 *
 * Componentes tradicionais são encaminhados diretamente.
 * Components V2 são normalizados e ativam automaticamente o modo V2.
 */
function prepare_message(options: InteractionMessageOptions) {
  const { components: input, files = [], ...rest } = options;

  if (!input || (Array.isArray(input) && input.length === 0)) {
    return {
      ...rest,
      files,
    };
  }

  const components = Array.isArray(input) ? input : [input];

  const has_v2 = components.some(is_v2_component);
  const has_traditional = components.some((component) => !is_v2_component(component));

  if (has_v2 && has_traditional) {
    throw new Error(
      'Não é permitido misturar componentes tradicionais com Components V2.',
    );
  }

  if (!has_v2) {
    return {
      ...rest,
      components: input,
      files,
    };
  }

  if (rest.content !== undefined) {
    throw new Error('Não é permitido utilizar content junto com Components V2.');
  }

  if (rest.embeds?.length) {
    throw new Error('Não é permitido utilizar embeds junto com Components V2.');
  }

  const prepared = prepare_components(input);
  const merged_files = [...files, ...prepared.files];

  const flags =
    rest.flags === undefined
      ? 0
      : MessageFlagsBitField.resolve(rest.flags as MessageFlagsResolvable);

  return {
    ...rest,
    components: prepared.components,
    files: merged_files,
    flags: flags | MessageFlags.IsComponentsV2,
  };
}

/**
 * Interação estendida com suporte aos Components V2 do NexoCord.
 *
 * [pt-BR] Use este tipo no callback quando quiser responder com componentes da
 * API `ui`.
 * [en] Use this type in a callback when replying with components from the
 * `ui` API.
 */
export type ExtendedInteraction<I extends BaseInteraction<CommandType>> = Omit<
  I,
  'reply' | 'followUp' | 'editReply' | 'update'
> & {
  reply(
    options: InteractionMessageOptions & { withResponse: true },
  ): Promise<InteractionCallbackResponse>;

  reply(
    options: InteractionMessageOptions & { withResponse?: false },
  ): Promise<undefined>;

  reply(
    options: InteractionMessageOptions,
  ): Promise<InteractionCallbackResponse | undefined>;

  followUp(options: InteractionMessageOptions): ReturnType<I['followUp']>;

  editReply(options: InteractionMessageOptions): ReturnType<I['editReply']>;
} & (I extends MessageComponentInteraction
    ? {
        update(
          options: InteractionMessageOptions,
        ): ReturnType<MessageComponentInteraction['update']>;
      }
    : {
        update?: never;
      });

/**
 * Estende uma interação do Discord.js com suporte aos Components V2.
 *
 * [pt-BR] Use o retorno para chamar `reply`, `followUp`, `editReply` ou `update`
 * com componentes declarativos da API `ui`.
 * [en] Use the returned value to call `reply`, `followUp`, `editReply`, or
 * `update` with declarative components from the `ui` API.
 *
 * @param interaction - [pt-BR] Interação recebida pelo comando.
 * [en] Interaction received by the command.
 * @returns [pt-BR] Interação com as respostas estendidas.
 * [en] Interaction with extended response methods.
 */
export function extend_interaction<I extends BaseInteraction<CommandType>>(
  interaction: I,
): ExtendedInteraction<I> {
  return new Proxy(interaction, {
    get(target, property) {
      switch (property) {
        case 'reply':
          return (options: InteractionMessageOptions) =>
            target.reply(prepare_message(options) as any);

        case 'followUp':
          return (options: InteractionMessageOptions) =>
            target.followUp(prepare_message(options) as any);

        case 'editReply':
          return (options: InteractionMessageOptions) =>
            target.editReply(prepare_message(options) as InteractionEditReplyOptions);

        case 'update':
          if (!('update' in target)) {
            return undefined;
          }

          return (options: InteractionMessageOptions) =>
            target.update(prepare_message(options) as InteractionUpdateOptions);

        default: {
          const value = Reflect.get(target, property, target);

          return typeof value === 'function' ? value.bind(target) : value;
        }
      }
    },
  }) as unknown as ExtendedInteraction<I>;
}
