import {
  ActionRowBuilder,
  ButtonBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  type AnyComponentBuilder,
} from 'discord.js';

import type {
  AttachmentInput,
  Button,
  ContainerChild,
  ContainerInput,
  ContainerNode,
  DisplayComponent,
  DisplayInput,
  Row,
  RowComponent,
  SectionComponent,
  SeparatorComponent,
  TextComponent,
} from '../types';

import { normalize_button } from './button';

import {
  attach_attachments,
  collect_attachments,
  get_component_attachments,
  normalize_file,
  normalize_gallery,
  normalize_thumbnail,
} from './media';

import { normalize_select } from './select';

/** Verifica se um valor representa um botão do NexoCord. */
export function is_button(value: unknown): value is Button {
  return (
    typeof value === 'object' &&
    value !== null &&
    'label' in value &&
    ('customId' in value || 'url' in value)
  );
}

/** Verifica se um valor representa um componente de texto. */
function is_text_component(value: unknown): value is TextComponent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'text'
  );
}

/** Verifica se um valor representa um divisor. */
function is_separator_component(value: unknown): value is SeparatorComponent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'separator'
  );
}

/** Verifica se um valor representa uma seção. */
function is_section_component(value: unknown): value is SectionComponent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'section'
  );
}

/** Verifica se um valor representa uma linha de ações. */
function is_row_component(value: unknown): value is Row {
  return (
    typeof value === 'object' && value !== null && 'type' in value && value.type === 'row'
  );
}

/** Converte um componente de texto. */
function normalize_text(component: TextComponent): TextDisplayBuilder {
  return new TextDisplayBuilder().setContent(component.content);
}

/** Converte um divisor visual. */
function normalize_separator(component: SeparatorComponent): SeparatorBuilder {
  const builder = new SeparatorBuilder();

  if (component.spacing !== undefined) {
    builder.setSpacing(component.spacing);
  }

  if (component.divider !== undefined) {
    builder.setDivider(component.divider);
  }

  return builder;
}

/** Converte uma seção com textos e acessórios opcionais. */
function normalize_section(component: SectionComponent): SectionBuilder {
  const builder = new SectionBuilder();

  builder.addTextDisplayComponents(
    ...component.texts.map((content) => new TextDisplayBuilder().setContent(content)),
  );

  if (component.button !== undefined) {
    builder.setButtonAccessory(normalize_button(component.button));
  }

  if (component.thumbnail !== undefined) {
    builder.setThumbnailAccessory(normalize_thumbnail(component.thumbnail));
  }

  return builder;
}

/** Converte um elemento de uma linha de ações. */
function normalize_row_component(
  component: RowComponent,
): ButtonBuilder | ReturnType<typeof normalize_select> {
  if (is_button(component)) {
    return normalize_button(component);
  }

  return normalize_select(component);
}

/** Converte uma linha de ações. */
function normalize_row(row: Row): ActionRowBuilder<AnyComponentBuilder> {
  const builder = new ActionRowBuilder<AnyComponentBuilder>();

  const components = row.components.map(normalize_row_component);

  builder.addComponents(...(components as AnyComponentBuilder[]));

  return attach_attachments(builder, collect_attachments(components));
}

/** Converte um descritor simplificado em um builder. */
function normalize_node(component: ContainerNode): ContainerChild {
  if (is_text_component(component)) {
    return normalize_text(component);
  }

  if (is_separator_component(component)) {
    return normalize_separator(component);
  }

  if (is_section_component(component)) {
    return normalize_section(component);
  }

  if (is_row_component(component)) {
    return normalize_row(component);
  }

  if (component.type === 'gallery') {
    return normalize_gallery(component);
  }

  if (component.type === 'file') {
    return normalize_file(component);
  }

  throw new Error('Tipo de componente não suportado.');
}

/** Verifica se um valor é um builder nativo aceito em containers. */
function is_container_child_builder(component: unknown): component is ContainerChild {
  return (
    component instanceof TextDisplayBuilder ||
    component instanceof SeparatorBuilder ||
    component instanceof SectionBuilder ||
    component instanceof ActionRowBuilder ||
    component instanceof MediaGalleryBuilder ||
    component instanceof FileBuilder
  );
}

/** Converte um elemento aceito dentro de um container. */
export function to_container_child(component: ContainerInput): ContainerChild {
  if (is_button(component)) {
    return normalize_row({
      type: 'row',
      components: [component],
    });
  }

  if (component instanceof ContainerBuilder) {
    throw new Error('Não é permitido adicionar um container dentro de outro container.');
  }

  if (is_container_child_builder(component)) {
    return component;
  }

  return normalize_node(component as ContainerNode);
}

/** Converte um componente aceito em uma mensagem com Components V2. */
export function to_display_component(component: DisplayInput): DisplayComponent {
  if (component instanceof ContainerBuilder) {
    return component;
  }

  if (is_button(component)) {
    return normalize_row({
      type: 'row',
      components: [component],
    });
  }

  if (is_container_child_builder(component)) {
    return component;
  }

  return normalize_node(component as ContainerNode);
}

/** Converte vários componentes para builders do Discord.js. */
export function to_display_components(
  components: readonly DisplayInput[],
): DisplayComponent[] {
  return components.map(to_display_component);
}

/** Recupera os anexos associados aos componentes normalizados. */
export function collect_component_attachments(
  components: readonly DisplayComponent[],
): AttachmentInput[] {
  return components.flatMap((component) => get_component_attachments(component));
}
