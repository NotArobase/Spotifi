const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");
const { ObjectId } = require('mongodb');

const path = require("path");

class SongService {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_SONGS);
  }

  /**
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    return await this.collection.find({}).toArray();
  }

  /**
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById(id) {
    const query = { _id: new ObjectId(id) }; // Ensure the query is a number
    console.log(`Querying song with query:`, query);

    const song = await this.collection.findOne(query);

    if (!song) {
      console.log(`No song found for query:`, query);
      return null;
    }
    return song;
  }


  /**
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    let song = await this.getSongById(id);
    console.log('Retrieved song:', song);
    const newLiked = !(song.liked);
    const updateQuery = { $set: { liked: newLiked } };
    const filter = { _id: song._id };
    await this.collection.updateOne(filter, updateQuery);
    song = await this.getSongById(id);
    return song.liked;
  }

  /**
   * Incrémente de 1 le count de chanson lorsqu'elle est ajoutée
   * à une playlist
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async incrementSongCount(songId) {
    const { ObjectId } = require('mongodb');

    let objectId;
    try {
      objectId = ObjectId.isValid(songId) ? new ObjectId(songId) : null;
    } catch {
      throw new Error('Invalid songId format.');
    }
    if (!objectId) {
      throw new Error('Invalid ObjectId provided.');
    }

    const filter = { _id: objectId };
    const update = { $inc: { count: 1 } };

    try {
      const result = await this.collection.updateOne(filter, update);
      if (result.matchedCount === 0) {
        console.warn('No song found with the specified _id.');
      }
      return result;
    } catch (error) {
      console.error('Error incrementing song count:', error);
      throw error;
    }
  }

  /**
   *
   * Cherche et retourne les chansons qui ont un mot clé spécifique dans leur description (name, artist, genre)
   * Si le paramètre 'exact' est TRUE, la recherche est sensible à la case
   * en utilisant l'option "i" dans la recherche par expression régulière
   * @param {string} substring mot clé à chercher
   * @param {boolean} exact si la recherche est sensible à la case
   * @returns toutes les chansons qui ont le mot clé cherché dans leur contenu (name, artist, genre)
   */
  async search (substring, exact) {
    let filter;
    if (exact) {
      filter = { $or: [{ name: { $regex: `${substring}` } }, { artist: { $regex: `${substring}` } }, { genre: { $regex: `${substring}` } }] };
    } else {
      filter = { $or: [{ name: { $regex: `${substring}`, $options: "i" } }, { artist: { $regex: `${substring}`, $options: "i" } }, { genre: { $regex: `${substring}`, $options: "i" } }] };
    }
    const songs = await this.collection.find(filter).toArray();
    return songs;
  }

  async populateDb () {
    const songs = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).songs;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_SONGS, songs);
  }

    /**
   * Ajoute une nouvelle chanson dans la base de données avec un ID incrémental.
   * @param {Object} song Les métadonnées de la chanson (name, path, etc.)
   * @returns {Promise<Object>} La chanson insérée
   */
  async addSong(song) {
    // Check if the song already exists based on its name or other unique attribute
    const existingSong = await this.collection.findOne({ name: song.name });

    if (existingSong) {
      // If the song already exists, skip adding it (no error raised)
      console.log(`Song '${song.name}' already exists, skipping.`);
      return null; // You can return null or the existing song if you prefer
    }

    // Insert the song into the collection
    const result = await this.collection.insertOne(song);

    if (result.acknowledged) {
      return { ...song, _id: result.insertedId }; // Return the inserted song with the generated `_id`
    } else {
      // Skip the song without raising an error if insertion fails
      console.log("Failed to insert song into the database");
      return null;
    }
  }



          
}
   

module.exports = { SongService };
