import { ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * [pt-BR] Identificador personalizado de um botão.
 * [en] Custom identifier for a button.
 */
export type ButtonID = string & {};

/**
 * [pt-BR] Emoji aceito pelo construtor de botões do Discord.js.
 * [en] Emoji accepted by the Discord.js button builder.
 */
export type ButtonEmoji = Parameters<ButtonBuilder['setEmoji']>[0];

/**
 * [pt-BR] Propriedades compartilhadas entre os tipos de botão.
 * [en] Properties shared by button types.
 */
export type CommonButton = {
  /**
   * [pt-BR] Texto exibido no botão.
   * [en] Text displayed on the button.
   */
  label: string;

  /**
   * [pt-BR] Emoji exibido junto ao texto.
   * [en] Emoji displayed with the text.
   */
  emoji?: ButtonEmoji;

  /**
   * [pt-BR] Indica se o botão ficará desabilitado.
   * [en] Whether the button is disabled.
   */
  disabled?: boolean;
};

/**
 * [pt-BR] Botão que utiliza um identificador personalizado.
 * [en] Button that uses a custom identifier.
 */
export type CustomButton = CommonButton & {
  /**
   * [pt-BR] Identificador recebido quando o botão é acionado.
   * [en] Identifier received when the button is clicked.
   */
  customId: ButtonID;

  /**
   * [pt-BR] Estilo visual do botão, exceto Link.
   * [en] Button style, excluding Link.
   */
  style?: Exclude<ButtonStyle, ButtonStyle.Link>;

  /**
   * [pt-BR] URL não é permitida em botões personalizados.
   * [en] URLs are not allowed on custom buttons.
   */
  url?: never;
};

/**
 * [pt-BR] Botão que direciona o usuário para uma URL.
 * [en] Button that directs the user to a URL.
 */
export type LinkButton = CommonButton & {
  /**
   * [pt-BR] Endereço aberto ao clicar no botão.
   * [en] Address opened when the button is clicked.
   */
  url: string;

  /**
   * [pt-BR] Botões com URL devem utilizar o estilo Link.
   * [en] URL buttons must use the Link style.
   */
  style?: ButtonStyle.Link;

  /**
   * [pt-BR] Botões Link não recebem identificador personalizado.
   * [en] Link buttons do not receive a custom identifier.
   */
  customId?: never;
};

/**
 * [pt-BR] Representa um botão criado pela API do NexoCord.
 * [en] Represents a button created by the NexoCord API.
 */
export type Button = CustomButton | LinkButton;
