import { Interaction } from "discord.js";
import { ZodType } from "zod";
import { interaction_type } from "../../utils/responder";
import { CacheType } from "../../types";
import { session } from "./session";
import { route } from "./route";
import { handle_error } from "../../utils";

function check_interaction_type(
  interaction: Interaction,
  cache_type?: CacheType,
) {
  if (!cache_type) return true;

  if (cache_type === "cached") return interaction.inCachedGuild();
  if (cache_type === "guild") return interaction.inGuild();

  return true;
}

function CacheErrorMessage(cache_type: CacheType) {
  if (cache_type === "cached") {
    return "Esta interação exige servidor em cache para continuar.";
  }

  if (cache_type === "guild") {
    return "Esta interação só pode ser usada dentro de servidor.";
  }

  return "Esta interação exige contexto raw de servidor.";
}

/** Gerencia o registro e a execução dos responders de interação. */
export class ResponderManager {
  private routes = new route();
  private sessions = new session();

  /** Registra um responder e retorna a rota criada. */
  register = this.routes.create.bind(this.routes);

  /** Executa o responder correspondente à interação, quando houver uma rota compatível. */
  async run(interaction: Interaction) {
    if (!("customId" in interaction)) return;
    const id = interaction.customId;

    const type = interaction_type(interaction);
    if (!type) return;

    if (this.sessions.isExpired(id)) {
      if (
        "reply" in interaction &&
        interaction.isRepliable() &&
        !interaction.replied
      ) {
        await interaction
          .reply({
            content: "Esta interação não está mais disponível.",
            flags: ["Ephemeral"],
          })
          .catch(() => {});
      }
      return;
    }

    const route = this.routes.find(id, type);
    if (!route) return;

    const cache = route.cache;
    if (cache && !check_interaction_type(interaction, cache)) {
      if (
        "reply" in interaction &&
        interaction.isRepliable() &&
        !interaction.replied
      ) {
        await interaction
          .reply({
            content: CacheErrorMessage(cache),
            flags: ["Ephemeral"],
          })
          .catch(() => {});
      }
      return;
    }

    try {
      const params = this.routes.extract(id, route);

      let data: any = params;

      if (route.parse) {
        if (typeof route.parse === "function") {
          data = route.parse(params);
        } else if (route.parse instanceof ZodType) {
          data = route.parse.parse(params);
        }
      }

      if (route.lifetime === "temporary" && !this.sessions.has(id)) {
        this.sessions.add(id, route.lifetime, route.expire);
      }

      if (route.lifetime === "once") {
        this.sessions.add(id, route.lifetime);
      }

      await route.run(interaction as any, data);
    } catch (err) {
      handle_error(err);
      if (
        "reply" in interaction &&
        interaction.isRepliable() &&
        !interaction.replied
      ) {
        await interaction
          .reply({
            content: "Erro ao processar interação.",
            flags: ["Ephemeral"],
          })
          .catch(() => {});
      }
    }
  }
}
