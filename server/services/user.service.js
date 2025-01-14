const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");

const path = require("path");

class UserService {

  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/users.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
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
    try {
      const { username, password } = userData;
      if (!username || !password) {
        throw new Error('username ou password manquant');
      }
      const result = await this.collection.insertOne({ username, password });

      const createdUser = await this.collection.findOne({ _id: result.insertedId });

      return createdUser; // Return le user créé
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  /**
   * Delete un user à partir de l'ID
   * @param {string} userId - The ID of the user to delete
   * @returns {Promise<boolean>} - True if the user was deleted, false otherwise
   */
  async deleteUser(userId) {
    try {
      const result = await this.collection.deleteOne({ _id: userId });
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
   * Get user by username
   * @param {string} username - The username of the user to retrieve
   * @returns {Promise<Object|null>} - The user data or null if not found
   */
  async getUserByUsername(username) {
    try {
      return await this.collection.findOne({ username });
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
}

module.exports = {UserService};