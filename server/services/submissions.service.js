const { dbService } = require("./database.service"); // or your DB service
const { ObjectId } = require("mongodb");

class SubmissionsService {
  constructor() {
    this.dbService = dbService;
  }

  get submissionsCollection() {
    return this.dbService.db.collection("submittedSongs"); 
  }

  /**
   * Create a new song submission.
   * @param {Object} submission - The submission data containing name, artist, genre, link
   * @returns {Promise<Object>} The inserted submission document
   */
  async createSubmission(submission) {
    const result = await this.submissionsCollection.insertOne({
      name: submission.name,
      artist: submission.artist,
      genre: submission.genre,
      link: submission.link,
      approved: false, // Indicate that it's pending/moderation
      createdAt: new Date(),
    });

    return await this.submissionsCollection.findOne({ _id: result.insertedId });
  }

  /**
   * Optional: Retrieve all submissions (for a future admin/moderator interface).
   */
  async getAllSubmissions() {
    return await this.submissionsCollection.find({}).toArray();
  }

  /**
   * Optional: Approve or reject a submission (for moderators).
   */
  async updateSubmissionStatus(id, isApproved) {
    return await this.submissionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { approved: isApproved } }
    );
  }
}

module.exports = SubmissionsService;
