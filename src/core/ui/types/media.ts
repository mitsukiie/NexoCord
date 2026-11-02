import type { InteractionReplyOptions } from "discord.js";

/**
 * [pt-BR] URL HTTP ou HTTPS.
 * [en] HTTP or HTTPS URL.
 */
export type HttpUrl = `http://${string}` | `https://${string}`;

/**
 * [pt-BR] URL de um arquivo anexado à mensagem.
 * [en] URL for a file attached to the message.
 */
export type AttachmentUrlString = `attachment://${string}`;

/**
 * [pt-BR] URL aceita pelos componentes de mídia.
 * [en] URL accepted by media components.
 */
export type MediaUrl = HttpUrl | AttachmentUrlString;

/**
 * [pt-BR] Entrada de arquivo aceita pelas opções de resposta do Discord.js.
 * [en] File input accepted by Discord.js reply options.
 */
export type AttachmentInput = NonNullable<
  InteractionReplyOptions["files"]
>[number];

/**
 * [pt-BR] Opções de uma imagem ou miniatura.
 * [en] Image or thumbnail options.
 */
export type MediaItem = {
  /**
   * [pt-BR] Endereço da mídia.
   * [en] Media address.
   */
  url: MediaUrl;

  /**
   * [pt-BR] Texto alternativo da mídia.
   * [en] Alternative text for the media.
   */
  description?: string;

  /**
   * [pt-BR] Indica se a mídia deve ser marcada como spoiler.
   * [en] Whether the media is marked as a spoiler.
   */
  spoiler?: boolean;
};

/**
 * [pt-BR] Miniatura utilizada como acessório de uma seção.
 * [en] Thumbnail used as a section accessory.
 */
export type Thumbnail = MediaItem;

/**
 * [pt-BR] Componente de galeria de mídia.
 * [en] Media gallery component.
 */
export type MediaGallery = {
  type: "gallery";

  /**
   * [pt-BR] Imagens que serão exibidas na galeria.
   * [en] Images displayed in the gallery.
   */
  items: readonly MediaItem[];
};

/**
 * [pt-BR] Componente de arquivo exibido em uma mensagem.
 * [en] File component displayed in a message.
 */
export type FileComponent = {
  type: "file";

  /**
   * [pt-BR] URL do arquivo, normalmente no formato attachment://.
   * [en] File URL, usually in attachment:// format.
   */
  url: AttachmentUrlString;

  /**
   * [pt-BR] Indica se o arquivo deve ser marcado como spoiler.
   * [en] Whether the file is marked as a spoiler.
   */
  spoiler?: boolean;

  /**
   * [pt-BR] Arquivo que será anexado à mensagem.
   * [en] File attached to the message.
   */
  attachment?: AttachmentInput;
};
