import { Bootstrap, GatewayIntentBits } from "__NEXO_PACKAGE__";

(async () => {
  await Bootstrap.init({
    token: process.env.TOKEN,
    intents: [GatewayIntentBits.Guilds],
  });
})();
