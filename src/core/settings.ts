type UserSettings = Record<string, any>;

declare global {
  var settings: UserSettings;
}

/**
 * Define configurações adicionais disponíveis durante a execução do bot.
 *
 * [pt-BR] Use este helper antes de iniciar recursos que leem configurações personalizadas.
 * [en] Use this helper before starting features that read custom settings.
 *
 * @param settings - [pt-BR] Valores personalizados; omitido, limpa os valores atuais.
 * [en] Custom values; omitting it clears the current values.
 * @returns [pt-BR] O objeto armazenado.
 * [en] The stored settings object.
 */
export function set_global_settings(settings?: UserSettings): UserSettings {
  globalThis.settings = settings ?? {};

  return globalThis.settings;
}
