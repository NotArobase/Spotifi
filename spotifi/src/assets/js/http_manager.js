import { SERVER_URL } from "./consts.js";

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  // Helper function to get the token
  getAuthToken: function () {
    return localStorage.getItem("authToken"); // Or use sessionStorage or another secure mechanism
  },

  GET: async function (endpoint) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`, // Corrected Authorization header
      },
    });
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${token}`, // Corrected Authorization header
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Corrected Authorization header
      },
    });
    return response.status;
  },

  PATCH: async function (endpoint) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`, // Corrected Authorization header
      },
    });
    return response.status;
  },

  PUT: async function (endpoint, data) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${token}`, // Corrected Authorization header
      },
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor () {
    this.songs = {};
    this.playlists = {};
    this.songsBaseURL = "songs";
    this.songFileBaseURL = "player";
    this.playlistBaseURL = "playlists";
    this.songPlayer = "player";
    this.searchBaseURL = "search";
  }

  // Fetches all songs from the server
  async fetchAllSongs () {
    const songs = await HTTPInterface.GET(`${this.songsBaseURL}`);
    return songs;
  }

  // Fetches all playlists from the server
  async fetchAllPlaylists () {
    const playlists = await HTTPInterface.GET(`${this.playlistBaseURL}`);
    return playlists;
  }

  // Fetches a song from the server based on its ID
  async fetchSong (id) {
    const song = await HTTPInterface.GET(`${this.songsBaseURL}/${id}`);
    return song;
  }

  // Fetches a song file (Blob) from the server using its file name (src)
  async getSongURLFromId(src) {
    const url = `https://spotifi.web.deuxfleurs.fr/${src}`;
    console.log('Requesting URL:', url); // For debugging
    const songBlob = await fetch(url);
    const blob = await songBlob.blob();
    return URL.createObjectURL(blob);
  }

  // Performs a search on the server and returns the result
  async search (query, exact) {
    const searchResults = await HTTPInterface.GET(`${this.searchBaseURL}?search_query=${query}&exact=${exact}`);
    return searchResults;
  }

  // Get all songs
  async getAllSongs () {
    return await this.fetchAllSongs(); // Directly returning the promise
  }

  // Add a new song to the server
  async addNewSong(songMetadata) {
    try {
      return await HTTPInterface.POST(`${this.songsBaseURL}`, songMetadata);
    } catch (err) {
      console.error("Error in addNewSong:", {
        metadata: songMetadata,
        error: err.message,
        stack: err.stack,
      });
      window.alert("An error occurred while adding the song. Check the console for details.");
      throw err;
    }
  }

  // Get all playlists
  async getAllPlaylists () {
    return await this.fetchAllPlaylists(); // Directly returning the promise
  }

  // Fetch a playlist by ID
  async getPlaylistById (id) {
    try {
      const playlist = await HTTPInterface.GET(`${this.playlistBaseURL}/${id}`);
      return playlist;
    } catch (err) {
      window.alert(err);
    }
  }

  // Add a new playlist to the server
   async addNewPlaylist (playlist) {
     try {
       await HTTPInterface.POST(`${this.playlistBaseURL}`, playlist);
     } catch (err) {
       window.alert("An error has occurred while adding a new playlist", err);
     }
   }

  // Update an existing playlist on the server
  async updatePlaylist (playlist) {
    try {
      await HTTPInterface.PUT(`${this.playlistBaseURL}/${playlist._id}`, playlist);
    } catch (err) {
      window.alert("An error has occurred while updating the playlist", err);
    }
  }

  // Delete a playlist from the server
  async deletePlaylist (id) {
    try {
      await HTTPInterface.DELETE(`${this.playlistBaseURL}/${id}`);
    } catch (err) {
      window.alert("An error has occurred while deleting the playlist", err);
    }
  }

  // Update the like status of a song
  async updateSong (id) {
    try {
      await HTTPInterface.PATCH(`${this.songsBaseURL}/${id}/like`);
    } catch (err) {
      window.alert("An error has occurred while trying to change the song status", err);
    }
  }
}
