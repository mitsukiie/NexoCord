type UserSettings = Record<string, any>;

declare global {
  var settings: UserSettings;
}

export function set_global_settings(settings?: UserSettings): UserSettings {
  globalThis.settings = settings ?? {};

  return globalThis.settings;
}
