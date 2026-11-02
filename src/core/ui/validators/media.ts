import type { FileComponent, MediaGallery, MediaItem, Thumbnail } from '../types';

import { UI_LIMITS, UI_REGEX } from '../constants';

export function validate_media_url(url: string): void {
  if (!UI_REGEX.http_url.test(url) && !UI_REGEX.attachment_url.test(url)) {
    throw new Error(
      'A mídia precisa utilizar uma URL HTTP, HTTPS ou attachment:// válida.',
    );
  }
}

export function validate_media_item(item: MediaItem): void {
  validate_media_url(item.url);

  if (
    item.description !== undefined &&
    item.description.length > UI_LIMITS.media_description
  ) {
    throw new Error(
      `A descrição da mídia não pode ultrapassar ${UI_LIMITS.media_description} caracteres.`,
    );
  }
}

export function validate_thumbnail(thumbnail: Thumbnail): void {
  validate_media_item(thumbnail);
}

export function validate_gallery(gallery: MediaGallery): void {
  if (gallery.items.length === 0) {
    throw new Error('A galeria precisa possuir pelo menos uma imagem.');
  }

  if (gallery.items.length > UI_LIMITS.media_gallery_items) {
    throw new Error(
      `A galeria não pode possuir mais de ${UI_LIMITS.media_gallery_items} imagens.`,
    );
  }

  for (const item of gallery.items) {
    validate_media_item(item);
  }
}

export function validate_file(file: FileComponent): void {
  if (!UI_REGEX.attachment_url.test(file.url)) {
    throw new Error('O arquivo precisa utilizar uma URL attachment:// válida.');
  }
}
