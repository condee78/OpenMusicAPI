const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToModelPlaylistSongs } = require("../../utils");

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongs({ playlistId, songId }) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3)",
      values: [id, playlistId, songId],
    };
    console.log(query);

    const result = await this._pool.query(query);
    console.log(result);

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
      WHERE P.owner = $1`,
      values: [owner],
    };
    console.log("query getplaylistSongs", query);

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelPlaylistSongs);
  }

  async deletePlaylistSongById(songId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE song_id = $1 RETURNING id",
      values: [songId],
    };

    console.log("query delete ps", query);

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Lagu gagal dihapus. Song Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    console.log(query);
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
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
