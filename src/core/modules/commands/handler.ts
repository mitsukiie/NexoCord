import { REST, Routes } from "discord.js";
import { existsSync, readdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

// Importações internas do projeto
import { ExtendedClient, App } from "../../index";
import { Command } from "../../types";
import { logger } from "../../utils";
import { NexoConfig, format_message } from "../../config";

import { is_script } from "../../utils/extensions";
import { createSubcommand } from "../../creators";

type Serialized = ReturnType<typeof serialize>;

export async function load_commands(
  config: NexoConfig,
  client?: ExtendedClient,
  token?: string,
): Promise<Serialized[]> {
  const app = App.get();
  const commands: Serialized[] = [];

  const folders = path.resolve(process.cwd(), config.directories.commands);

  if (!existsSync(folders)) {
    logger.warn(`⚠️ Pasta de comandos não encontrada: ${folders}`);
    app.commands.clear();
    return commands;
  }

  const categories = readdirSync(folders);

  app.commands.clear();

  if (config.terminal.commands.showFiles) {
    logger.info("🔄 Iniciando o carregamento de comandos...");
    logger.success(`📂 Total de categorias: ${categories.length}`);
  }

  await Promise.all(
    categories.map(async (categorie) => {
      const category_path = path.join(folders, categorie);
      const entries = readdirSync(category_path, { withFileTypes: true });

      if (config.terminal.commands.showFiles) {
        logger.success(
          `📂 Categoria: ${categorie} - ${entries.length} comandos`,
        );
      }

      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(category_path, entry.name);

          // Caso seja uma pasta, tratamos como grupo de subcomandos
          if (entry.isDirectory()) {
            const command = await createSubcommand(entry.name, fullPath);
            const cmd = serialize(command);

            commands.push(cmd);
            app.commands.add(command as Command);
          }

          // Caso seja um arquivo, tratamos como comando único
          else if (entry.isFile() && is_script(entry.name)) {
            const url = pathToFileURL(path.resolve(fullPath)).href;
            const module = await import(url);
            const command = module.default;

            if (!command) {
              logger.warn(
                `⚠️ Arquivo ignorado (sem export default): ${entry.name}`,
              );
              return;
            }

            const cmd = serialize(command);

            commands.push(cmd);
            app.commands.add(command);

            if (config.terminal.commands.showFiles) {
              logger.success(`📄 Comando carregado: ${cmd.name}`);
            }
          } else {
            logger.warn(`⚠️ Entrada ignorada: ${entry.name}`);
          }
        }),
      );
    }),
  );

  if (client) {
    await register_commands(client, commands, config, token);
  }

  return commands;
}

async function register_commands(
  client: ExtendedClient,
  commands: Serialized[],
  config: NexoConfig,
  token?: string,
) {
  const Token = token ?? process.env.TOKEN;

  if (!Token) {
    logger.error("Token não definido para registrar comandos.");
    process.exit(1);
  }

  const rest = new REST({ version: "10" }).setToken(Token);

  try {
    if (config.bot.guildID && config.bot.guildID.length > 0) {
      const guilds = config.bot.guildID;

      const servers = await Promise.all(
        guilds.map(async (ID: string) => {
          try {
            const guild = await client.guilds.fetch(ID).catch(() => null);

            await rest.put(
              Routes.applicationGuildCommands(client.user!.id, ID),
              {
                body: commands,
              },
            );

            return {
              ID,
              name: guild?.name ?? "Servidor não encontrado",
              commands: commands.length,
              success: true,
            };
          } catch (error) {
            const guild = await client.guilds.fetch(ID).catch(() => null);
            return {
              ID,
              name: guild?.name ?? "Servidor não encontrado",
              success: false,
            };
          }
        }),
      );

      if (config.terminal.commands.showRegistered) {
        logger.info(JSON.stringify(servers, null, 2));
      }
    } else {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commands,
      });

      if (config.terminal.commands.showRegistered) {
        logger.success(
          format_message(
            config.terminal.commands.registeredMessage,
            commands.length,
          ),
        );
      }
    }
  } catch (err) {
    console.error("Erro ao registrar comandos:", err);
  }
}

function serialize(command: Command) {
  return {
    name: command.name,
    description: command.description || "Sem descrição",
    type: command.type ?? 1,
    options: command.options || [],
    defaultMemberPermission: command.defaultMemberPermission || null,
    botpermission: command.botpermission || null,
    dmPermission:
      command.dmPermission !== undefined ? command.dmPermission : true,
    nsfw: command.nsfw || false,
    allowIds: command.allowIds || null,
  };
}
