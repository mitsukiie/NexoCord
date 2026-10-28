import { glob } from "glob";
import path from "path";
import { pathToFileURL } from "url";

// Importações internas do projeto
import { ExtendedClient, App } from "../../index";
import { Event } from "../../types";
import { NexoConfig, format_message } from "../../config";
import { logger } from "../../utils";
import { GLOB } from "../../utils/extensions";

export async function load_events(
  config: NexoConfig,
  client?: ExtendedClient,
): Promise<Event[]> {
  const app = App.get();
  const base_events_path = path.resolve(
    process.cwd(),
    config.directories.events,
  );

  const files = await glob(GLOB, {
    cwd: base_events_path,
    absolute: true,
  });

  app.events.clear();

  if (config.terminal.events.showFiles) {
    logger.info("🔄 Iniciando o carregamento de eventos...");
    logger.success(`📂 Total de eventos encontrados: ${files.length}`);
  }

  await Promise.all(
    files.map(async (file) => {
      const url = pathToFileURL(path.resolve(file)).href;
      const module = await import(url);
      const event: Event = module.default;

      if (!event?.name || !event?.run) {
        logger.warn(`⚠️ Evento inválido ignorado: ${file}`);
        return;
      }

      app.events.add(event);
    }),
  );

  const events = app.events.all();

  if (client) {
    await register_events(client, events, config);
  }

  return events;
}

export async function register_events(
  client: ExtendedClient,
  events: Event[],
  config: NexoConfig,
) {
  events.forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args) => event.run(...args, client));
    } else {
      client.on(event.name, (...args) => event.run(...args, client));
    }
  });

  if (config.terminal.events.showRegistered) {
    logger.success(
      format_message(config.terminal.events.registeredMessage, events.length),
    );
  }
}
