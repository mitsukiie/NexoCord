import { ClientEvents } from "discord.js";
import { Event } from "@types";

export function createEvent<K extends keyof ClientEvents>(event: Event<K>) {
  return event;
}
