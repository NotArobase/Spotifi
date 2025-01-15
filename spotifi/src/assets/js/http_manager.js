import { SERVER_URL, SONG_SERVER_URL } from "./consts.js";

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
        "Authorization": `Bearer ${token}`, // Add the token to the headers
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
        "Authorization": `Bearer ${token}`, // Add the token to the headers
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.status;
  },

  PATCH: async function (endpoint) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`, // Add the token to the headers
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
        "Authorization": `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor() {
    this.songsBaseURL = "audio";
    this.playlistBaseURL = "playlists";
    this.searchBaseURL = "search";
    this.songStorageURL = SONG_SERVER_URL; // Use SONG_SERVER_URL from consts.js
  }

  /**
   * Récupère et retourne toutes les chansons du serveur
   * @returns {Promise} Liste des chansons
   */
  async fetchAllSongs() {
    const songs = await HTTPInterface.GET(`${this.songsBaseURL}`);
    return songs;
  }

  /**
   * Récupère et retourne toutes les playlists du serveur
   * @returns {Promise} Liste des playlists
   */
  async fetchAllPlaylists() {
    const playlists = await HTTPInterface.GET(`${this.playlistBaseURL}`);
    return playlists;
  }

  /**
   * Récupère et retourne une chanson du serveur en fonction de son id
   * @param {number} id Identifiant de la chanson
   * @returns {Promise} Une chanson
   */
  async fetchSong(id) {
    const song = await HTTPInterface.GET(`${this.songsBaseURL}/${id}`);
    return song;
  }

  /**
   * Récupère et retourne un URL qui représente le fichier de musique
   * @param {number} id Identifiant de la chanson
   * @returns {Promise} Un URL qui représente le fichier de musique
   */
  async getSongURLFromId(id) {
    // Construct the URL dynamically using SONG_SERVER_URL
    const url = `${this.songStorageURL}/${id}.mp3`;
    return url;
  }

  /**
   * Effectue une recherche de mot clé sur le serveur et retourne le résultat
   * @param {string} query Mot clé à rechercher
   * @param {boolean} exact Flag indiquant si la recherche est sensible à la casse
   * @returns {{playlist: [], songs:[]}} Résultat de la recherche
   */
  async search(query, exact) {
    const searchResults = await HTTPInterface.GET(`${this.searchBaseURL}?search_query=${query}&exact=${exact}`);
    return searchResults;
  }

  /**
   * @returns {Promise} Liste des chansons
   */
  async getAllSongs() {
    const songsPromises = new Promise((resolve, reject) => {
      try {
        const songs = this.fetchAllSongs();
        resolve(songs);
      } catch (err) {
        reject("Échec lors de la requête GET /api/songs");
      }
    });

    const songsReceived = Promise.resolve(songsPromises);
    return songsReceived;
  }

  /**
   * @returns {Promise} Liste des playlists
   */
  async getAllPlaylists() {
    const playlistsPromises = new Promise((resolve, reject) => {
      try {
        const playlists = this.fetchAllPlaylists();
        resolve(playlists);
      } catch (err) {
        reject("Échec lors de la requête GET /api/playlists");
      }
    });

    const playlistsReceived = Promise.resolve(playlistsPromises);
    return playlistsReceived;
  }

  /**
   * Récupère et retourne une playlist du serveur en fonction de son id
   * @param {number} id Id de la playlist
   * @returns {Promise} Playlist correspondant à l'id
   */
  async getPlaylistById(id) {
    try {
      const playlist = await HTTPInterface.GET(`${this.playlistBaseURL}/${id}`);
      return playlist;
    } catch (err) {
      window.alert(err);
    }
  }

  /**
   * Ajoute une nouvelle playlist sur le serveur à travers une requête
   * @param {Object} playlist Playlist à envoyer au serveur
   */
  async addNewPlaylist(playlist) {
    try {
      await HTTPInterface.POST(`${this.playlistBaseURL}`, playlist);
    } catch (err) {
      window.alert("An error has occurred while adding a new playlist", err);
    }
  }

  /**
   * Modifie une playlist en envoyant un objet avec les nouvelles valeurs au serveur
   * @param {Object} playlist Playlist à envoyer au serveur
   */
  async updatePlaylist(playlist) {
    try {
      await HTTPInterface.PUT(`${this.playlistBaseURL}/${playlist.id}`, playlist);
    } catch (err) {
      window.alert("An error has occurred while updating the playlist", err);
    }
  }

  /**
   * Supprime une playlist sur le serveur à travers une requête
   * @param {string} id Identifiant de la playlist à supprimer
   */
  async deletePlaylist(id) {
    try {
      await HTTPInterface.DELETE(`${this.playlistBaseURL}/${id}`);
    } catch (err) {
      window.alert("An error has occurred while deleting the playlist", err);
    }
  }

  /**
   * Modifie l'état aimé d'une chanson
   * @param {number} id Identifiant de la chanson à modifier
   */
  async updateSong(id) {
    try {
      await HTTPInterface.PATCH(`${this.songsBaseURL}/${id}/like`);
    } catch (err) {
      window.alert("An error has occurred while trying to change the song status", err);
    }
  }
}
