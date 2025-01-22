class SearchBarService {
  constructor (songsService, playlistService) {
    this.songsService = songsService;
    this.playlistService = playlistService;
  }

  async search (searchParameters, exact, username) {
    const songs = await this.songsService.search(searchParameters, exact, username);
    const playlists = await this.playlistService.search(searchParameters, exact, username);
    return { songs, playlists };
  }
}

module.exports = { SearchBarService };
