import { Responder, ResponderParser, ResponderTypes } from "../types";

import { App } from "../index";

/**
 * Registra um responder para interações identificadas por um caminho de `customId`.
 *
 * Os segmentos iniciados por `:` são extraídos e entregues ao callback como parâmetros.
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
