const songs = [];

const displayClientSongs = (recordSongs = songs) => {
  const clientSongs = recordSongs.map((song) => ({
    id: song.id,
    title: song.title,
    performer: song.performer,
  }));
  return clientSongs;
};

const filterBookByName = (name) => {
  const bookFilter = songs.filter((book) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    book.name.toLowerCase().includes(name.toLowerCase())
  );
  return bookFilter;
};

const filterBookByReading = (reading) => {
  const readingState = reading === "1";
  const bookFilter = songs.filter((book) => book.reading === readingState);
  return bookFilter;
};

const filterBookByFinished = (finished) => {
  const finishedState = finished === "1";
  const bookFilter = songs.filter((book) => book.finished === finishedState);
  return bookFilter;
};

module.exports = {
  songs,
  displayClientSongs,
  filterBookByName,
  filterBookByReading,
  filterBookByFinished,
};
