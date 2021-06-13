const OpenMusicHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "openMusic",
  version: "1.0.0",
  register: async (server, { service }) => {
    const openMusicHandler = new OpenMusicHandler(service);
    server.route(routes(openMusicHandler));
  },
};
