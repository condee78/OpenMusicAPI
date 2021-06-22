const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt,
  updatedAt,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt,
  updatedAt,
});

const mapDBToModelPlaylists = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapDBToModel, mapDBToModelPlaylists };
