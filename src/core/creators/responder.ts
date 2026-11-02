import { Responder, ResponderParser, ResponderTypes } from "../types";

import { App } from "../index";

/**
 * Registra um responder para interações identificadas por um caminho de `customId`.
 *
 * [pt-BR] Segmentos iniciados por `:` são extraídos e entregues ao callback
 * como parâmetros.
 * [en] Segments starting with `:` are extracted and passed to the callback as
 * parameters.
 *
 * @param opts - [pt-BR] Configuração do responder.
 * [en] Responder configuration.
 */
export function createResponder<
  const Path extends string,
  const Type extends ResponderTypes,
  Parse extends ResponderParser<Path> | undefined = undefined,
>(opts: Responder<Path, Type, Parse>) {
  const app = App.get();
  app.responders.register(opts);
  return opts;
}
