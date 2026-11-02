/** Limites definidos pela API de componentes do Discord. */
export const UI_LIMITS = {
  button_label: 80,
  custom_id: 100,

  text_content: 4000,

  container_components: 40,
  row_components: 5,

  section_texts: 3,

  media_gallery_items: 10,
  media_description: 1024,

  select_placeholder: 150,
  select_options: 25,
  select_option_label: 100,
  select_option_value: 100,
  select_option_description: 100,

  select_min_values: 0,
  select_max_values: 25,
} as const;

/** Padrões utilizados na validação de valores. */
export const UI_REGEX = {
  http_url: /^https?:\/\/\S+$/i,
  attachment_url: /^attachment:\/\/[^/\\\s]+$/i,
  hex_color: /^#?(?:[0-9a-f]{6})$/i,
} as const;

/** Valores padrão utilizados pelos builders. */
export const UI_DEFAULTS = {
  button_style: 1,
  select_min_values: 1,
  select_max_values: 1,
} as const;
