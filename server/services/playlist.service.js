const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const { SongService } = require('./songs.service');
const DB_CONSTS = require("../utils/env");
const path = require("path");
const { randomUUID } = require("crypto");
const { ObjectId } = require('mongodb');

class PlaylistService {
  constructor() {
    this.JSON_PATH = path.join(__dirname + "../../data/playlists.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_PLAYLISTS);
  }

  /**
   * Retourne toutes les playlists disponibles
   * @returns {Promise<Array>} la liste de toutes les playlists
   */
  async getAllPlaylists() {
    return await this.collection.find({}).toArray();
  }

  /**
   * Retourne une playlist en fonction de son id
   * @param {string} id
   * @returns Retourne la playlist en fonction de son id
   */
  async getPlaylistById(id) {
    const query = { _id: new ObjectId(id) };
    let playlist = await this.collection.findOne(query);
    return playlist;
  }

  /**
   * Ajoute une playlist dans le fichier de toutes les playlists
   * @param {Object} playlist nouvelle playlist à ajouter
   * @returns retourne la playlist ajoutée
   */
  async addPlaylist(playlist) {
    const songService = new SongService();

    // Validate that the owner field exists
    if (!playlist.owner) {
      throw new Error("Playlist owner is required.");
    }

    // Get the user's playlist count
    const userService = require('./user.service').userService; // Import UserService
    const user = await userService.getUserByUsername(playlist.owner);

    if (!user) {
      throw new Error("User not found.");
    }
    console.log(user.nbPlaylist);
    if (user.nbPlaylist >= 10) {
      throw new Error("Cannot add more than 10 playlists for this user.");
    }

    // Increment the count for each song in the playlist
    if (playlist.songs && playlist.songs.length > 0) {
      await Promise.all(
        playlist.songs.map((songId) => songService.incrementSongCount(songId))
      );
    }

    // Adding playlist
    const result = await this.collection.insertOne(playlist);

    // Update the user's playlist count in the database
    await userService.updateUserPlaylistsCount(user._id.toString(), user.nbPlaylist + 1);

    return result.ops[0];
  }


  /**
   * Modifie une playlist en fonction de son id et met à jour le fichier de toutes les playlists
   * @param {Object} playlist nouveau contenu de la playlist
   */
  /**
 * Modifie une playlist en fonction de son id et met à jour le fichier de toutes les playlists
 * @param {Object} playlist Nouveau contenu de la playlist
 * @returns {Object} Résultat de l'opération
 */
  async updatePlaylist(playlist) {
    const { ObjectId } = require('mongodb');
    const songService = new SongService();
    
    if (!playlist._id) {
      throw new Error('Playlist _id is required.');
    }
  
    let objectId;
    try {
      objectId = ObjectId.isValid(playlist._id) ? new ObjectId(playlist._id) : null;
    } catch {
      throw new Error('Invalid _id format.');
    }
    if (!objectId) {
      throw new Error('Invalid ObjectId provided.');
    }
  
    const filter = { _id: objectId };
    
    try {
      // Fetch the existing playlist from the database
      const existingPlaylist = await this.collection.findOne(filter);
      if (!existingPlaylist) {
        throw new Error('Playlist not found.');
      }
  
      // Identify new songs added to the playlist
      const newSongs = playlist.songs.filter(
        (songId) => !existingPlaylist.songs.some((existingSongId) => existingSongId.id === songId.id)
      );

      // Increment the `count` for newly added songs
      if (newSongs.length > 0) {
        await Promise.all(
          newSongs.map((songId) => songService.incrementSongCount(songId))
        );
      }

      // Remove `_id` from the update payload
      const { _id, ...playlistData } = playlist;
  
      // Update the playlist
      const updateQuery = { $set: playlistData };
      const result = await this.collection.updateOne(filter, updateQuery);
      if (result.matchedCount === 0) {
        console.warn('No playlist found with the specified _id.');
      }
      return result;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  }


  /**
   * @param {string} id identifiant de la playlist
   * @returns {Promise<boolean>} true si la playlist a été supprimée, false sinon
   */
  async deletePlaylist(id) {
    const playlist = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!playlist) {
      throw new Error("Playlist not found.");
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      // Decrement the user's playlist count
      const userService = require('./user.service').userService;
      const user = await userService.getUserByUsername(playlist.owner);

      if (user) {
        await userService.updateUserPlaylistsCount(user._id.toString(), user.nbPlaylist - 1);
      }
    }

    return result.deletedCount > 0;
  }


  /**
   * Cherche et retourne les playlists qui ont un mot clé spécifique dans leur description (name, description)
   * Si le paramètre 'exact' est TRUE, la recherche est sensible à la case
   * en utilisant l'option "i" dans la recherche par expression régulière
   * @param {string} substring mot clé à chercher
   * @param {boolean} exact si la recherche est sensible à la case
   * @returns toutes les playlists qui ont le mot clé cherché dans leur contenu (name, description)
   */
  async search(substring, exact) {
    let filter;
    if (exact) {
      filter = { $or: [{ name: { $regex: `${substring}` } }, { description: { $regex: `${substring}` } }] };
    } else {
      filter = { $or: [{ name: { $regex: `${substring}`, $options: "i" } }, { description: { $regex: `${substring}`, $options: "i" } }] };
    }
    const playlists = await this.collection.find(filter).toArray();
    return playlists;
  }

  async populateDb() {
    const playlists = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).playlists;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_PLAYLISTS, playlists);
  }
}

module.exports = { PlaylistService };
