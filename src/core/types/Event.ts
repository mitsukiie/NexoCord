import { ClientEvents } from "discord.js";
import { RunEvent } from "./Run";

export type Event<K extends keyof ClientEvents = keyof ClientEvents> = {
  name: K;
  once?: boolean;
  run: RunEvent<K>;
};
