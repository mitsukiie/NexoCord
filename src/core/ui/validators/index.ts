export { validate_button } from './button';

export {
  validate_file,
  validate_gallery,
  validate_media_item,
  validate_media_url,
  validate_thumbnail,
} from './media';

export {
  validate_channel_select,
  validate_mentionable_select,
  validate_role_select,
  validate_select,
  validate_select_base,
  validate_string_select,
  validate_user_select,
} from './select';

export {
  validate_color,
  validate_container,
  validate_container_options,
  validate_node,
  validate_row,
  validate_section,
  validate_separator,
  validate_text,
} from './container';

import { validate_button } from './button';
import {
  validate_color,
  validate_container,
  validate_node,
  validate_row,
  validate_section,
  validate_text,
} from './container';
import {
  validate_file,
  validate_gallery,
  validate_media_item,
  validate_media_url,
  validate_thumbnail,
} from './media';
import { validate_select, validate_string_select } from './select';

export const validate = {
  button: validate_button,
  color: validate_color,
  container: validate_container,
  node: validate_node,
  row: validate_row,
  section: validate_section,
  text: validate_text,
  file: validate_file,
  gallery: validate_gallery,
  mediaItem: validate_media_item,
  mediaUrl: validate_media_url,
  thumbnail: validate_thumbnail,
  select: validate_select,
  stringSelect: validate_string_select,
};
