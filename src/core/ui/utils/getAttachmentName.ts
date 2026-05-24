/**
 * Extracts a file name from an attachment-like value.
 *
 * @param attachment Attachment-like value.
 * @returns Attachment file name.
 */
export function getAttachmentName(attachment: unknown) {
  if (!attachment || typeof attachment !== 'object') {
    throw new Error('Attachment must be an object with a valid file name.');
  }

  const candidate = attachment as {
    name?: unknown;
    data?: { name?: unknown };
  };

  const name =
    typeof candidate.name === 'string'
      ? candidate.name
      : typeof candidate.data?.name === 'string'
        ? candidate.data.name
        : undefined;

  if (!name) {
    throw new Error(
      'Attachment name was not found. Define a name in AttachmentBuilder options.',
    );
  }

  return name;
}
