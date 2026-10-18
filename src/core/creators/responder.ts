import { Responder, ResponderParser, ResponderTypes } from "../types";

import { App } from "@base";

export function createResponder<
  const Path extends string,
  const Type extends ResponderTypes,
  Parse extends ResponderParser<Path> | undefined = undefined,
>(opts: Responder<Path, Type, Parse>) {
  const app = App.get();
  app.responders.register(opts);
  return opts;
}
