import type {
  AttachmentInput,
  AttachmentUrlString,
  FileComponent,
  MediaGallery,
  MediaItem,
  Thumbnail,
} from "../types";


/** Obtém o nome de um arquivo anexado. */
function get_attachment_name(attachment: AttachmentInput): string {
  if (!attachment || typeof attachment !== "object") {
    throw new Error("O anexo deve ser um objeto válido.");
  }

  const candidate = attachment as {
    name?: unknown;
    data?: { name?: unknown };
  };

  const name =
    typeof candidate.name === "string"
      ? candidate.name
      : typeof candidate.data?.name === "string"
        ? candidate.data.name
        : undefined;

  if (!name) {
    throw new Error(
      "Não foi possível identificar o nome do anexo. Defina um nome no AttachmentBuilder.",
    );
  }

  return name;
}

/** Cria um descritor de arquivo. */
function create_file(
  url: AttachmentUrlString,
  spoiler: boolean,
  attachment?: AttachmentInput,
): FileComponent {
  return {
    type: "file",
    url,
    spoiler,
    ...(attachment !== undefined && { attachment }),
  };
}

/** Cria um arquivo usando uma URL de anexo. */
function build_file(url: AttachmentUrlString, spoiler?: boolean): FileComponent;

/** Cria um arquivo e associa o anexo correspondente. */
function build_file(
  url: AttachmentUrlString,
  attachment: AttachmentInput,
  spoiler?: boolean,
): FileComponent;

function build_file(
  url: AttachmentUrlString,
  attachment_or_spoiler?: AttachmentInput | boolean,
  spoiler = false,
): FileComponent {
  const has_attachment =
    attachment_or_spoiler !== undefined &&
    typeof attachment_or_spoiler !== "boolean";

  return create_file(
    url,
    has_attachment ? spoiler : (attachment_or_spoiler ?? false),
    has_attachment ? attachment_or_spoiler : undefined,
  );
}

/** Cria um arquivo a partir de um AttachmentBuilder ou outro anexo. */
function from_attachment(
  attachment: AttachmentInput,
  spoiler = false,
): FileComponent {
  const name = get_attachment_name(attachment);

  return create_file(`attachment://${name}`, spoiler, attachment);
}

/**
 * Construtor de arquivos com suporte a anexos.
 *
 * [pt-BR] Use `file("attachment://nome")` para referenciar um anexo já enviado
 * ou `file.fromAttachment(attachment)` para associar o objeto do anexo.
 * [en] Use `file("attachment://name")` to reference an existing attachment or
 * `file.fromAttachment(attachment)` to associate an attachment object.
 */
export const file = Object.assign(build_file, {
  fromAttachment: from_attachment,
});

/**
 * [pt-BR] Cria um item de mídia para uma galeria.
 * [en] Creates a media item for a gallery.
 */
export function image(options: MediaItem): MediaItem {
  return options;
}

/**
 * [pt-BR] Cria uma miniatura para uma seção.
 * [en] Creates a thumbnail for a section.
 */
export function thumbnail(options: Thumbnail): Thumbnail {
  return options;
}

/**
 * Cria uma galeria de mídia.
 *
 * [pt-BR] Passe uma ou mais imagens criadas com `image`.
 * [en] Pass one or more images created with `image`.
 *
 * @param items - [pt-BR] Itens exibidos na galeria.
 * [en] Items displayed in the gallery.
 */
export function gallery(...items: MediaItem[]): MediaGallery {
  return {
    type: "gallery",
    items,
  };
}
