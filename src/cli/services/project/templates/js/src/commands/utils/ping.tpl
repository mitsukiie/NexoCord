const { createCommand, CommandType } = require("__NEXO_PACKAGE__");

module.exports = createCommand({
  name: "ping",
  description: "Responde com Pong!",
  type: CommandType.ChatInput,
  async run(ctx) {
    await ctx.reply({ content: "Pong!" });
  },
});
