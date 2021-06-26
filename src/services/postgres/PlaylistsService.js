const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToModel, mapDBToModelPlaylists } = require("../../utils");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.username
      
      
    `,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelPlaylists);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal memperbarui Lagu. Id tidak ditemukan");
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
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
}

module.exports = PlaylistsService;
