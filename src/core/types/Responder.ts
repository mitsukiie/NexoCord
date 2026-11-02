import {
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  RoleSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
} from "discord.js";

import { ZodTypeAny, infer as zInfer } from "zod/v3";

import type { RunResponder } from "./Run";

/**
 * Tipos de interação que podem ser associados a um responder.
 *
 * @description
 * [pt-BR] Escolha o tipo correspondente ao componente que deve acionar o responder.
 * [en] Choose the type matching the component that should trigger the responder.
 */
export enum ResponderType {
  Button = "button",
  Modal = "modal",
  SelectString = "select.string",
  SelectUser = "select.user",
  SelectRole = "select.role",
  SelectChannel = "select.channel",
  SelectMentionable = "select.mentionable",
}

type Map = {
  [ResponderType.Button]: ButtonInteraction;
  [ResponderType.Modal]: ModalSubmitInteraction;
  [ResponderType.SelectString]: StringSelectMenuInteraction;
  [ResponderType.SelectUser]: UserSelectMenuInteraction;
  [ResponderType.SelectRole]: RoleSelectMenuInteraction;
  [ResponderType.SelectChannel]: ChannelSelectMenuInteraction;
  [ResponderType.SelectMentionable]: MentionableSelectMenuInteraction;
};

/**
 * Interação do Discord correspondente ao tipo de um responder.
 *
 * [pt-BR] Use este tipo para receber a interação correta no callback.
 * [en] Use this type to receive the correct interaction in the callback.
 */
export type ResponderInteraction<T extends ResponderType> = Map[T];

/**
 * [pt-BR] Tipo ou tipos de interação aceitos por um responder.
 * [en] Interaction type or types accepted by a responder.
 */
export type ResponderTypes = ResponderType | readonly ResponderType[];
/**
 * [pt-BR] Define o contexto de cache necessário para a interação.
 * [en] Defines the cache context required by the interaction.
 */
export type CacheType = "cached" | "guild";

type ResponderInteractionFromInput<T extends ResponderTypes> =
  T extends readonly ResponderType[]
    ? ResponderInteraction<T[number]>
    : T extends ResponderType
      ? ResponderInteraction<T>
      : never;

type SegmentParamName<Segment extends string> =
  Segment extends `:${infer Param}` ? Param : never;

type PathParamNames<Path extends string> =
  Path extends `${infer Segment}/${infer Rest}`
    ? SegmentParamName<Segment> | PathParamNames<Rest>
    : SegmentParamName<Path>;

/**
 * Parâmetros extraídos dos segmentos `:param` de um `customId`.
 *
 * [pt-BR] Os valores são entregues ao parser e ao callback `run`.
 * [en] Values are passed to the parser and the `run` callback.
 */
export type ResponderParams<Path extends string> = [
  PathParamNames<Path>,
] extends [never]
  ? Record<never, never>
  : { [K in PathParamNames<Path>]: string };

/**
 * Parser opcional para transformar os parâmetros do `customId`.
 *
 * [pt-BR] Aceita um schema Zod ou uma função de transformação.
 * [en] Accepts a Zod schema or a transformation function.
 */
export type ResponderParser<Path extends string, Output = unknown> =
  | ZodTypeAny
  | ((params: ResponderParams<Path>) => Output);

/**
 * [pt-BR] Resultado produzido pelo parser de um responder.
 * [en] Result produced by a responder parser.
 */
export type ResponderParse<P, Path extends string> = P extends ZodTypeAny
  ? zInfer<P>
  : P extends (params: ResponderParams<Path>) => infer R
    ? R
    : ResponderParams<Path>;

/**
 * Configuração de um responder associado a um ou mais tipos de interação.
 *
 * @description
 * [pt-BR] O caminho pode conter segmentos como `:id`, que serão disponibilizados
 * no callback `run`.
 * [en] The path may contain segments such as `:id`, which are made available
 * to the `run` callback.
 */
export type Responder<
  Path extends string,
  Type extends ResponderTypes,
  Parse extends ResponderParser<Path> | undefined = undefined,
> = {
  /**
   * [pt-BR] Padrão do `customId` que será reconhecido.
   * [en] `customId` pattern to recognize.
   */
  customId: Path;
  /**
   * [pt-BR] Tipo ou tipos de interação associados.
   * [en] Associated interaction type or types.
   */
  type: Type;
  /**
   * [pt-BR] Validação ou transformação dos parâmetros extraídos.
   * [en] Validation or transformation for extracted parameters.
   */
  parse?: Parse;
  /**
   * [pt-BR] Callback executado quando o padrão é reconhecido.
   * [en] Callback executed when the pattern is recognized.
   */
  run: RunResponder<ResponderInteractionFromInput<Type>, Path, Parse>;
  /**
   * [pt-BR] Remove o responder após a primeira execução.
   * [en] Removes the responder after its first execution.
   */
  lifetime?: "once" | "temporary";
  /**
   * [pt-BR] Tempo, em milissegundos, até expirar.
   * [en] Time, in milliseconds, until expiration.
   */
  expire?: number;
  /**
   * [pt-BR] Contexto de cache exigido.
   * [en] Required cache context.
   */
  cache?: CacheType;
};
