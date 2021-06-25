const ClientError = require("../../exceptions/ClientError");

class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSonghandler = this.postPlaylistSonghandler.bind(this);
    this.getPlaylistSongshandler = this.getPlaylistSongshandler.bind(this);
    this.deletePlaylistSongBySongIdHandler = this.deletePlaylistSongBySongIdHandler.bind(
      this
    );
  }

  async postPlaylistSonghandler(request, h) {
    try {
      console.log("plalylistsongs", request.payload);
      this._validator.validatePlaylistSongsPayload(request.payload);

      const { playlistId } = request.params;
      const { songId } = request.payload;

      const { id: credentialId } = request.auth.credentials;

      console.log(playlistId);
      console.log(songId);
      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.verifySongID(songId);
      await this._service.addPlaylistSongs({
        playlistId,
        songId,
      });

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongshandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      const songs = await this._service.getPlaylistSongs(credentialId);

      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongBySongIdHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deletePlaylistSongById(playlistId, songId);

      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
