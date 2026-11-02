import {
  FileBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ThumbnailBuilder,
} from 'discord.js';

import type {
  AttachmentInput,
  FileComponent,
  MediaItem,
  MediaGallery,
  Thumbnail,
} from '../types';

/**
 * Armazena os anexos associados a cada componente normalizado.
 * O WeakMap evita manter referências a componentes que não são mais utilizados.
 */
const component_attachments = new WeakMap<object, AttachmentInput[]>();

/** Registra anexos associados a um componente. */
export function attach_attachments<T extends object>(
  component: T,
  attachments: readonly AttachmentInput[],
): T {
  if (attachments.length > 0) {
    component_attachments.set(component, [...attachments]);
  }

  return component;
}

/** Recupera os anexos associados a um componente. */
export function get_component_attachments(component: object): AttachmentInput[] {
  return component_attachments.get(component) ?? [];
}

/** Coleta os anexos associados a vários componentes. */
export function collect_attachments(components: readonly object[]): AttachmentInput[] {
  return components.flatMap(get_component_attachments);
}

/** Converte uma imagem em um item de galeria. */
export function normalize_media_item(item: MediaItem): MediaGalleryItemBuilder {
  const builder = new MediaGalleryItemBuilder().setURL(item.url);

  if (item.description !== undefined) {
    builder.setDescription(item.description);
  }

  if (item.spoiler !== undefined) {
    builder.setSpoiler(item.spoiler);
  }

  return builder;
}

/** Converte uma galeria do NexoCord em MediaGalleryBuilder. */
export function normalize_gallery(gallery: MediaGallery): MediaGalleryBuilder {
  const builder = new MediaGalleryBuilder();

  builder.addItems(...gallery.items.map(normalize_media_item));

  return builder;
}

/** Converte uma miniatura em ThumbnailBuilder. */
export function normalize_thumbnail(thumbnail: Thumbnail): ThumbnailBuilder {
  const builder = new ThumbnailBuilder().setURL(thumbnail.url);

  if (thumbnail.description !== undefined) {
    builder.setDescription(thumbnail.description);
  }

  if (thumbnail.spoiler !== undefined) {
    builder.setSpoiler(thumbnail.spoiler);
  }

  return builder;
}

/** Converte um arquivo do NexoCord em FileBuilder. */
export function normalize_file(file: FileComponent): FileBuilder {
  const builder = new FileBuilder().setURL(file.url);

  if (file.spoiler !== undefined) {
    builder.setSpoiler(file.spoiler);
  }

  if (file.attachment !== undefined) {
    attach_attachments(builder, [file.attachment]);
  }

  return builder;
}
