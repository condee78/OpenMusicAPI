const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class OpenMusicService {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newSong = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      insertedAt,
      updatedAt,
    };

    this._songs.push(newSong);
    console.log("masuuk", newSong);
    const isSuccess = this._songs.filter((note) => note.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return id;
  }

  getSongs() {
    return this._songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
    // return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((n) => n.id === id)[0];
    console.log("idnya", song);
    if (!song) {
      throw new NotFoundError("Catatan tidak ditemukan");
    }
    return song;
  }

  editSongById(id, { title, year, performer, genre, duration }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }

    const updatedAt = new Date().toISOString();

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      performer,
      genre,
      duration,
      updatedAt,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError("lagu gagal dihapus. Id tidak ditemukan");
    }
    this._songs.splice(index, 1);
  }
}

module.exports = OpenMusicService;
