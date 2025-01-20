const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
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
    await this.collection.insertOne(playlist);
    return playlist;
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
    delete playlist._id; // _id est immutable
    const updateQuery = { $set: playlist };

    try {
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
    const res = await this.collection.findOneAndDelete({ id });
    return res !== null;
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
