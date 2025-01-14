const { MongoClient, ServerApiVersion } = require('mongodb');
const DB_CONSTS = require("../utils/env");

class DatabaseService {
  /**
   * @param {string} collectionName nom de la collection sur MongoDB
   * @param {Array} data tableau contenant les documents à mettre dans la collection
   */
  async populateDb(collectionName, data) {
    const collection = this.db.collection(collectionName);
    const count = await collection.countDocuments({});
    if (count === 0) {
      for (const element of data) {
        await collection.insertOne(element);
      }
    }
  }

  // Méthode pour établir la connection entre le serveur Express et la base de données MongoDB
  async connectToServer(uri) {
    try {
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await this.client.connect();
      this.db = this.client.db(DB_CONSTS.DB_DB);
      console.log('Successfully connected to MongoDB.');
    } catch (err) {
      console.error(err);
    }
  }
}

const dbService = new DatabaseService();

module.exports = { dbService };
