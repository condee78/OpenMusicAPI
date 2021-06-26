const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToModelPlaylistSongs } = require("../../utils");

class PlaylistSongsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylistSongs({ playlistId, songId }) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3)",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu Playlist gagal ditambahkan");
    }

    // return result.rows[0].id;
  }

  async getPlaylistSongs(owner) {
    const query = {
      text: `SELECT S.id, S.title, S.performer
      FROM playlistsongs as PS
      LEFT JOIN songs as S ON S.id = PS.song_id
      LEFT JOIN playlists as P ON P.id = PS.playlist_id
      LEFT JOIN collaborations ON collaborations.playlist_id = P.id
      WHERE P.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelPlaylistSongs);
  }

  async deletePlaylistSongById(playlistid, songId) {
    const query = {
      text:
        "DELETE FROM playlistsongs WHERE playlist_id=$1 and song_id = $2 RETURNING id",
      values: [playlistid, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal dihapus. Song Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: `SELECT * FROM playlists WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this._collaborationService.verifyCollaborator(playlistId, userId);
    } catch (error) {
      if (error instanceof InvariantError) {
        throw error;
      }
      try {
        await this.verifyPlaylistOwner(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifySongID(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Lagu tidak valid");
    }
  }
}

module.exports = PlaylistSongsService;
