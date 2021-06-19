require("dotenv").config();

const Hapi = require("@hapi/hapi");

// open-music
const openMusic = require("./api/open-music");
const OpenMusicService = require("./services/postgres/OpenMusicService");
const OpenMusicValidator = require("./validator/open-music");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

const init = async () => {
  const openMusicService = new OpenMusicService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: openMusic,
      options: {
        service: openMusicService,
        validator: OpenMusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
