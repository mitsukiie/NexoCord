import { createEvent, Events } from "__NEXO_PACKAGE__";

export default createEvent({
  name: Events.ClientReady,
  once: true,
  run(client) {
    console.log(`${client.user.displayName} online.`);
  },
});
