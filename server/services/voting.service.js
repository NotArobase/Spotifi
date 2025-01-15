const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");

class VotingService {
  constructor() {
    this.dbService = dbService;
  }

  get votesCollection() {
    return this.dbService.db.collection('votes');
  }

  get songsCollection() {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_SONGS);
  }

  async castVote(userId, songId) {
    const userVotes = await this.votesCollection.find({ userId }).toArray();
    if (userVotes.length >= 20) {
      throw new Error('Maximum votes (20) reached');
    }

    const existingVote = await this.votesCollection.findOne({ userId, songId });
    if (existingVote) {
      throw new Error('Already voted for this song');
    }

    await this.votesCollection.insertOne({
      userId,
      songId,
      timestamp: new Date()
    });

    return { success: true };
  }

  async getAvailableSongs(userId) {
    const userVotes = await this.votesCollection.find({ userId }).toArray();
    const votedSongIds = userVotes.map(vote => vote.songId);

    return await this.songsCollection.find({
      _id: { $nin: votedSongIds }
    }).toArray();
  }

  async getFinalSelection() {
    const voteResults = await this.votesCollection.aggregate([
      { $group: { _id: "$songId", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    const selectedSongs = [];
    const remainingSongs = [];

    const allSongs = await this.songsCollection.find({}).toArray();
    
    for (const song of allSongs) {
      const voteResult = voteResults.find(vr => vr._id === song._id.toString());
      if (voteResult) {
        selectedSongs.push({ ...song, voteCount: voteResult.count });
      } else {
        remainingSongs.push(song);
      }
    }

    selectedSongs.sort((a, b) => b.voteCount - a.voteCount);

    while (selectedSongs.length < 20 && remainingSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingSongs.length);
      const randomSong = remainingSongs.splice(randomIndex, 1)[0];
      selectedSongs.push({ ...randomSong, voteCount: 0 });
    }

    return selectedSongs;
  }

  async resetVotes() {
    await this.votesCollection.deleteMany({});
    return true;
  }
}

module.exports = VotingService; 