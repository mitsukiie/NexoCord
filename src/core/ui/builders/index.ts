import { button } from './button';
import { container } from './container';
import { divider, separator } from './separator';
import { section } from './section';
import { text } from './text';
import { gallery, image, file, thumbnail } from './media';
import { row } from './row';

import { channel, mentionable, role, string, user } from './select';

/**
 * API pública para criação de componentes Components V2.
 *
 * [pt-BR] Use os métodos diretamente ou por `ui` para montar respostas
 * declarativas compatíveis com o Discord.
 * [en] Use the methods directly or through `ui` to build declarative responses
 * compatible with Discord.
 */
export const ui = {
  text,
  button,
  container,
  separator,
  divider,
  section,
  thumbnail,
  gallery,
  image,
  file,
  row,

  select: {
    user,
    role,
    mentionable,
    channel,
    string,
  },
};

export {
  button,
  container,
  divider,
  file,
  gallery,
  image,
  row,
  section,
  separator,
  text,
  thumbnail,
};

export { channel, mentionable, role, string, user };
