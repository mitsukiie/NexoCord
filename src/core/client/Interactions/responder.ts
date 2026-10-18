import { type Interaction } from "discord.js";
import { App } from "@base";

export async function Responder(i: Interaction) {
  const app = App.get();
  await app.responders.run(i);
}
