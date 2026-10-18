import { Command, CommandType } from "@types";

export function createCommand<T extends CommandType>(command: Command<T>) {
  return command;
}
