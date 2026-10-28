const config_keys = {
  DIRECTORIES_COMMANDS: ["directories", "commands"],
  DIRECTORIES_EVENTS: ["directories", "events"],

  TERMINAL_MODE: ["terminal", "mode"],

  TERMINAL_COMMANDS_SHOW_FILES: ["terminal", "commands", "showFiles"],
  TERMINAL_COMMANDS_SHOW_REGISTERED: ["terminal", "commands", "showRegistered"],
  TERMINAL_COMMANDS_REGISTERED_MESSAGE: [
    "terminal",
    "commands",
    "registeredMessage",
  ],

  TERMINAL_EVENTS_SHOW_FILES: ["terminal", "events", "showFiles"],
  TERMINAL_EVENTS_SHOW_REGISTERED: ["terminal", "events", "showRegistered"],
  TERMINAL_EVENTS_REGISTERED_MESSAGE: [
    "terminal",
    "events",
    "registeredMessage",
  ],

  BOT_COOLDOWN: ["bot", "cooldown"],
  BOT_GUILD_ID: ["bot", "guildID"],
  BOT_ERRORS_INTERACTION: ["bot", "errors", "interaction"],
} as const;

type ConfigPath = readonly string[];

function parse_value(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === "") return "";

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error(`Valor inválido: ${trimmed}`);
    }
  }

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;

  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(trimmed)) {
    const number = Number(trimmed);

    if (Number.isFinite(number)) return number;
  }

  return trimmed;
}

function set_nested_value(
  target: Record<string, unknown>,
  keys: ConfigPath,
  value: unknown,
): void {
  let current = target;

  for (const key of keys.slice(0, -1)) {
    const existing = current[key];

    if (
      existing === null ||
      typeof existing !== "object" ||
      Array.isArray(existing)
    ) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
}

export function parse_config_file(content: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = content.split(/\r?\n/);
  const seen_keys = new Set<string>();

  for (const [index, line] of lines.entries()) {
    const line_number = index + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      throw new Error(`Linha ${line_number}: esperado CHAVE=VALOR.`);
    }

    const key = trimmed.slice(0, separator).trim();
    const raw_value = trimmed.slice(separator + 1).trim();

    if (!key) {
      throw new Error(`Linha ${line_number}: chave vazia.`);
    }

    if (!Object.hasOwn(config_keys, key)) {
      throw new Error(`Linha ${line_number}: opção desconhecida "${key}".`);
    }

    if (seen_keys.has(key)) {
      throw new Error(
        `Linha ${line_number}: a opção "${key}" foi definida mais de uma vez.`,
      );
    }

    seen_keys.add(key);

    let value: unknown;

    try {
      value = parse_value(raw_value);
    } catch {
      throw new Error(
        `Linha ${line_number}: valor inválido para a opção "${key}".`,
      );
    }

    const path = config_keys[key as keyof typeof config_keys];

    set_nested_value(result, path, value);
  }

  return result;
}
