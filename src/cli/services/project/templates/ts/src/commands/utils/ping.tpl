import {
  createCommand,
  CommandType,
} from "__NEXO_PACKAGE__";

export default createCommand({
  name: "ping",
  description: "Responde com Pong!",
  type: CommandType.ChatInput,
  async run(interaction) {
    await interaction.reply({ content: "Pong!" });
  },
});