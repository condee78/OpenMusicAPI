const Hapi = require("@hapi/hapi");
const openMusic = require("./api/open-music");
const OpenMusicService = require("./services/inMemory/OpenMusicService");
const OpenMusicValidator = require("./validator/open-music");

const init = async () => {
  const openMusicService = new OpenMusicService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: openMusic,
    options: {
      service: openMusicService,
      validator: OpenMusicValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
