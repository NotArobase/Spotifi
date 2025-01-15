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
    this.songStorageURL = `${SONG_SERVER_URL}/audio`; // Base URL for songs
    this.playlistBaseURL = "playlists";
    this.searchBaseURL = "search";
  }

  /**
   * Récupère et retourne toutes les chansons
   * @returns {Promise} Liste des chansons
   */
  async fetchAllSongs() {
    const response = await fetch(this.songStorageURL);
    return await response.json();
  }

  /**
   * Récupère et retourne une chanson par son id
   * @param {number} id Identifiant de la chanson
   * @returns {Promise} Une chanson
   */
  async fetchSong(id) {
    const response = await fetch(`${this.songStorageURL}/${id}.mp3`);
    if (response.ok) {
      return await response.blob(); // Retourne la chanson sous forme de Blob
    } else {
      throw new Error(`Erreur lors de la récupération de la chanson avec l'id ${id}`);
    }
  }

  /**
   * Récupère et retourne un URL qui représente le fichier de musique
   * @param {number} id Identifiant de la chanson
   * @returns {Promise} URL du fichier de musique
   */
  async getSongURLFromId(id) {
    const blob = await this.fetchSong(id);
    const url = URL.createObjectURL(blob);
    return url;
  }

  /**
   * Effectue une recherche de mot clé sur les playlists et retourne le résultat
   * @param {string} query Mot clé à rechercher
   * @param {boolean} exact Flag indiquant si la recherche est sensible à la casse
   * @returns {{playlist: [], songs: []}} Résultat de la recherche
   */
  async search(query, exact) {
    const searchResults = await HTTPInterface.GET(`${this.searchBaseURL}?search_query=${query}&exact=${exact}`);
    return searchResults;
  }

  /**
   * @returns {Promise} Liste des playlists
   */
  async fetchAllPlaylists() {
    return await HTTPInterface.GET(this.playlistBaseURL);
  }

  /**
   * Ajoute une nouvelle playlist
   * @param {Object} playlist Playlist à envoyer au serveur
   */
  async addNewPlaylist(playlist) {
    try {
      await HTTPInterface.POST(this.playlistBaseURL, playlist);
    } catch (err) {
      window.alert("An error occurred while adding a new playlist", err);
    }
  }

  /**
   * Modifie une playlist
   * @param {Object} playlist Playlist à envoyer au serveur
   */
  async updatePlaylist(playlist) {
    try {
      await HTTPInterface.PUT(`${this.playlistBaseURL}/${playlist.id}`, playlist);
    } catch (err) {
      window.alert("An error occurred while updating the playlist", err);
    }
  }

  /**
   * Supprime une playlist
   * @param {string} id Identifiant de la playlist à supprimer
   */
  async deletePlaylist(id) {
    try {
      await HTTPInterface.DELETE(`${this.playlistBaseURL}/${id}`);
    } catch (err) {
      window.alert("An error occurred while deleting the playlist", err);
    }
  }
}
