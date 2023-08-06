const { Pool } = require('pg');

class OpenmusicService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name FROM playlists
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this.pool.query(playlistQuery);

    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      RIGHT JOIN playlist_songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const songResult = await this.pool.query(songQuery);

    return {
      playlist: {
        ...playlistResult.rows[0],
        songs: songResult.rows,
      },
    };
  }
}

module.exports = OpenmusicService;
