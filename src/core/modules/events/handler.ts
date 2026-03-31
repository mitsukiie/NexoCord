import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';

// Importações internas do projeto
import { ExtendedClient, App } from '@base';
import { Event } from '@types';
import { logger } from '@utils';
import { GLOB } from '../../utils/extensions';

export async function loadEvents(
  client?: ExtendedClient,
  eventsPath = 'src/events',
): Promise<Event[]> {
  const app = App.get();
  const baseEventsPath = path.resolve(process.cwd(), eventsPath);
  const files = await glob(GLOB, {
    cwd: baseEventsPath,
    absolute: true,
  });

  app.events.clear();

  if (settings.terminal.showEventsFiles) {
    logger.info('🔄 Iniciando o carregamento de eventos...');
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
    await registerEvents(client, events);
  }

  return events;
}

export async function registerEvents(client: ExtendedClient, events: Event[]) {
  events.forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args) => event.run(...args, client));
    } else {
      client.on(event.name, (...args) => event.run(...args, client));
    }

    if (settings.terminal.showEventsRegistred) {
      logger.success(`⚡ Evento registrado: ${event.name}`);
    }
  });
}

export async function Events(client: ExtendedClient) {
  const events = await loadEvents();
  await registerEvents(client, events);
}