const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");
const path = require("path");
const { randomUUID } = require("crypto");

const { PlaylistService } = require("./playlist.service");
const { SongService } = require("./songs.service");

const playlistService = new PlaylistService();
const songService = new SongService();

class UserService {

  constructor () {
    this.JSON_PATH = path.join(__dirname + "../data/users.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;

    this.dbService.connectToServer(DB_CONSTS.DB_URI)
    .then(() => {
      console.log('Database connected in UserService');
    })
    .catch((error) => {
      console.error('Error connecting to database in UserService:', error); 
    });
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_USERS);
  }

  /**
   * Create a new user in the database
   * @param {Object} userData - The user data to save (username and password)
   * @returns {Promise<Object>} - The created user
   */
  async createUser(userData) {
    try { const { username, password } = userData;
      if (!username || !password) {
      throw new Error('username ou password manquant');
      }
      result = await this.collection.insertOne({ username, password, N_playlist: 0});
      const createdUser = await this.collection.findOne({ _id: result.insertedId });
      return createdUser;
    } catch (error) {
      throw new Error('Error creating user: ' + error.message); }
    }

  /**
  * incremente le nombre de playlist pour un user donné
  * @param {string} Username - The username of the user to update
  * @returns 
  */
  async incrementPlaylistCount(userId) {
    try {
      await this.collection.updateOne( { _id: userId }, { $inc: { N_playlist: 1 }} );
    } catch (error) {
      throw new Error('Error incrementing playlist count: ' + error.message);
    }
  }

  /**
  * decrements playlist number of a user 
  * @param {string} UserID - The userID of the user to update
  * @returns 
  */
  async decrementPlaylistCount(userId) {
    try {
      await this.collection.updateOne( { _id: userId }, { $inc: { N_playlist: -1 } } );
    } catch (error) {
      throw new Error('Error decrementing playlist count: ' + error.message);
    }
  }

  /**
   * Delete un user à partir du username
   * @param {string} Username - The username of the user to delete
   * @returns {Promise<boolean>} - True if the user was deleted, false otherwise
   */
  async deleteUser(Username) {
    try {
      const result = await this.collection.deleteOne({ username: Username });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  /**
   * Checker si un user existe dans la bdd grâce à son username
   * @param {string} username - The username of the user to check
   * @returns {Promise<boolean>} - True if the user exists, false otherwise
   */
  async userExists(username) {
    try {
      const user = await this.collection.findOne({ username });
      return !!user;
    } catch (error) {
      throw new Error('Error checking user existence: ' + error.message);
    }
  }

  /**
   * get the playlist count of a user
   * @param {string} userID - The user Id of the user to get the playlist count
   * @returns {Promise<Object|null>} - playlist count
   */
  async getPlaylistsCountForUser(userId) {
      try {
        // Vérifie que l'utilisateur existe d'abord (optionnel mais recommandé)
        const userExists = await this.collection.findOne({ _id: userId });
        if (!userExists) {
          throw new Error("User not found");
        }
        return user ? user.N_playlist : 0;
      } catch (error) {
        console.error("Error fetching playlists count for user:", error.message);
        throw new Error("Failed to fetch playlists count");
      }
    }

  /**
   * Get user by username
   * @param {string} username - The username of the user to retrieve
   * @returns {Promise<Object|null>} - The user data or null if not found
   */
  async getUserByUsername(username) {
    try {
      return await this.collection.findOne({ username: username });
    } catch (error) {
      throw new Error('Error retrieving user: ' + error.message);
    }
  }

  /**
   * Get all users in the database
   * @returns {Promise<Array>} - An array of all users
   */
  async getAllUsers() {
    try {
      return await this.collection.find({}).toArray();
    } catch (error) {
      throw new Error('Error retrieving users: ' + error.message);
    }
  }

  /**
   * Update a user's password in the database by username
   * @param {string} username - The username of the user to update
   * @param {string} newPassword - The new password to set
   * @returns {Promise<Object|null>} - The updated user or null if not found
   */
  async updateUserPassword(username, newPassword) {
    try {
      const result = await this.collection.findOneAndUpdate(
        { username },
        { $set: { password: newPassword } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      throw new Error('Error updating user password: ' + error.message);
    }
  }

  /**
   * Add a playlist for a specific user
   * @param {string} userID - The Id of the user to add playlist
   * @param {object} playlist -  The playlist to add
   * @returns  The updated user or null if not found
   */
  async addPlaylistForUser(userId, playlist) {
    try {
      playlist.owner = userId;
      const result = await this.collection.insertOne(playlist);
      return result.ops[0];
    } catch (error) {
      console.error("Error adding playlist:", error);
      throw new Error("Failed to add playlist");
    }
  }

  /**
   * Get user by username
   * @param {string} username - The username of the user to retrieve
   * @returns {Promise<Object|null>} - The user data or null if not found
   */
  async getUserByUsername(username) {
    try {
      return await this.collection.findOne({ username: username });
    } catch (error) {
      console.error('Error retrieving user:', error.message);
      throw new Error('Error retrieving user: ' + error.message);
    }
  }

  async getUserSongs(username) {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) {
        throw new Error('User not found');
      }

      const songs = await songService.getAllSongs();

      const filteredSongs = songs.filter((song) => song.owner === 'all' || song.owner === user.username);

      return filteredSongs;
    } catch (error) {
      console.error("Error fetching user's songs:", error.message);
      throw error;
    }
  }

  async getUserPlaylists(username) {
    try {
      const user = await this.getUserByUsername(username);
      if (!user) {
        throw new Error('User not found');
      }

      const playlists = await playlistService.getAllPlaylists();

      const userPlaylists = playlists.filter((playlist) => playlist.owner === user.username);

      return userPlaylists;
    } catch (error) {
      console.error("Error fetching user's playlists:", error.message);
      throw error;
    }
  }
}

module.exports = {UserService};