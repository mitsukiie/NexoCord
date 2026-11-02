import type {
  ActionRowBuilder,
  AnyComponentBuilder,
  ContainerBuilder,
  FileBuilder,
  MediaGalleryBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from 'discord.js';

import type { Button } from './button';
import type { FileComponent, MediaGallery, Thumbnail } from './media';
import type { Row } from './row';

/**
 * [pt-BR] Texto ou lista de textos aceitos pelo componente de texto.
 * [en] Text or list of texts accepted by the text component.
 */
export type TextInput = string | readonly string[];

/**
 * [pt-BR] Opções de formatação de um componente de texto.
 * [en] Text component formatting options.
 */
export type TextStyleOptions = {
  /**
   * [pt-BR] Nível de título: de 1 a 4.
   * [en] Heading level from 1 to 4.
   */
  size?: 1 | 2 | 3 | 4;

  /**
   * [pt-BR] Aplica negrito ao texto.
   * [en] Makes the text bold.
   */
  bold?: boolean;

  /**
   * [pt-BR] Aplica itálico ao texto.
   * [en] Makes the text italic.
   */
  italic?: boolean;

  /**
   * [pt-BR] Aplica sublinhado ao texto.
   * [en] Underlines the text.
   */
  underline?: boolean;
};

/**
 * [pt-BR] Componente de texto simplificado.
 * [en] Simplified text component.
 */
export type TextComponent = {
  type: 'text';

  /**
   * [pt-BR] Conteúdo textual do componente.
   * [en] Text content of the component.
   */
  content: string;
};

/**
 * [pt-BR] Opções de um divisor visual.
 * [en] Visual separator options.
 */
export type SeparatorOptions = {
  /**
   * [pt-BR] Espaçamento utilizado pelo divisor.
   * [en] Spacing used by the separator.
   */
  spacing?: SeparatorSpacingSize;

  /**
   * [pt-BR] Indica se a linha divisória será exibida.
   * [en] Whether the divider line is shown.
   */
  divider?: boolean;
};

/**
 * [pt-BR] Componente de divisor simplificado.
 * [en] Simplified separator component.
 */
export type SeparatorComponent = {
  type: 'separator';
} & SeparatorOptions;

/**
 * [pt-BR] Textos aceitos por uma seção.
 * [en] Texts accepted by a section.
 */
export type SectionTexts =
  readonly [string] | readonly [string, string] | readonly [string, string, string];

/**
 * [pt-BR] Opções adicionais de uma seção.
 * [en] Additional section options.
 */
export type SectionOptions = {
  /**
   * [pt-BR] Botão exibido como acessório da seção.
   * [en] Button shown as the section accessory.
   */
  button?: Button;

  /**
   * [pt-BR] Miniatura exibida como acessório da seção.
   * [en] Thumbnail shown as the section accessory.
   */
  thumbnail?: Thumbnail;
};

/**
 * [pt-BR] Componente de seção simplificado.
 * [en] Simplified section component.
 */
export type SectionComponent = {
  type: 'section';

  /**
   * [pt-BR] Textos exibidos na seção.
   * [en] Texts displayed in the section.
   */
  texts: SectionTexts;
} & SectionOptions;

/**
 * [pt-BR] Elementos simplificados que podem ser adicionados a um container.
 * [en] Simplified elements that can be added to a container.
 */
export type ContainerNode =
  | TextComponent
  | SeparatorComponent
  | SectionComponent
  | Row
  | MediaGallery
  | FileComponent;

/**
 * [pt-BR] Componente de exibição construído pelo Discord.js.
 * [en] Display component built by Discord.js.
 */
export type DisplayComponent =
  | ContainerBuilder
  | TextDisplayBuilder
  | SeparatorBuilder
  | SectionBuilder
  | MediaGalleryBuilder
  | FileBuilder
  | ActionRowBuilder<AnyComponentBuilder>;

/**
 * [pt-BR] Componente que pode ser adicionado dentro de um container.
 * [en] Component that can be added inside a container.
 */
export type ContainerChild = Exclude<DisplayComponent, ContainerBuilder>;

/**
 * [pt-BR] Elemento aceito como filho de um container.
 * [en] Element accepted as a container child.
 */
export type ContainerInput = ContainerChild | ContainerNode | Button;

/**
 * [pt-BR] Opções de configuração de um container.
 * [en] Container configuration options.
 */
export type ContainerOptions = {
  /**
   * [pt-BR] Cor de destaque do container.
   * [en] Container accent color.
   */
  color?: number | string;
};

/**
 * [pt-BR] Elemento aceito como componente de exibição.
 * [en] Element accepted as a display component.
 */
export type DisplayInput = DisplayComponent | ContainerNode | Button;
