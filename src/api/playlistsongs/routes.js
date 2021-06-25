const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{playlistId}/songs",
    handler: handler.postPlaylistSonghandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/songs",
    handler: handler.getPlaylistSongshandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}/songs",
    handler: handler.deletePlaylistSongBySongIdHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
];

module.exports = routes;
