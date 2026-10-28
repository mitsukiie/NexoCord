const { createEvent, Events } = require("__NEXO_PACKAGE__");

module.exports = createEvent({
  name: Events.ClientReady,
  once: true,
  run(client) {
    console.log(`${client.user.displayName} online.`);
  },
});
