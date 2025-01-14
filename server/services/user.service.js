const { DB_COLLECTION_USERS } = require('../utils/db');

class UserService {
  /**
   * Create a new user in the database
   * @param {Object} userData - The user data to save (login and password)
   * @returns {Promise<Object>} - The created user
   */
  async createUser(userData) {
    try {
      const { login, password } = userData;
      if (!login || !password) {
        throw new Error('login ou password manquant');
      }
      const result = await DB_COLLECTION_USERS.insertOne({ login, password });
      return result.ops[0]; // Return le user créé
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
      const result = await DB_COLLECTION_USERS.deleteOne({ _id: userId });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  /**
   * Checker si un user existe dans la bdd grâce à son login
   * @param {string} login - The login of the user to check
   * @returns {Promise<boolean>} - True if the user exists, false otherwise
   */
  async userExists(login) {
    try {
      const user = await DB_COLLECTION_USERS.findOne({ login });
      return !!user;
    } catch (error) {
      throw new Error('Error checking user existence: ' + error.message);
    }
  }

  /**
   * Get user by login
   * @param {string} login - The login of the user to retrieve
   * @returns {Promise<Object|null>} - The user data or null if not found
   */
  async getUserByLogin(login) {
    try {
      return await DB_COLLECTION_USERS.findOne({ login });
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
      return await DB_COLLECTION_USERS.find({}).toArray();
    } catch (error) {
      throw new Error('Error retrieving users: ' + error.message);
    }
  }

  /**
   * Update a user's password in the database by login
   * @param {string} login - The login of the user to update
   * @param {string} newPassword - The new password to set
   * @returns {Promise<Object|null>} - The updated user or null if not found
   */
  async updateUserPassword(login, newPassword) {
    try {
      const result = await DB_COLLECTION_USERS.findOneAndUpdate(
        { login },
        { $set: { password: newPassword } },
        { returnDocument: 'after' }
      );
      return result.value;
    } catch (error) {
      throw new Error('Error updating user password: ' + error.message);
    }
  }
}

module.exports = new UserService();