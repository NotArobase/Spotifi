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
    return this.dbService.db.collection('potentialSongs');
  }

  // Toggle vote (add or remove)
  async castVote(userId, songId) {
    const existingVote = await this.votesCollection.findOne({ userId, songId });
    
    if (existingVote) {
      // If the user has already voted, remove their vote
      await this.votesCollection.deleteOne({ userId, songId });
      return { success: true, action: 'removed' };  // Action to indicate the vote was removed
    } else {
      // If the user hasn't voted, add their vote
      const userVotes = await this.votesCollection.find({ userId }).toArray();
      if (userVotes.length >= 20) {
        throw new Error('Maximum votes (20) reached');
      }

      await this.votesCollection.insertOne({
        userId,
        songId,
        timestamp: new Date()
      });

      return { success: true, action: 'added' };  // Action to indicate the vote was added
    }
  }

  // Get available songs with an indication of whether the user has voted for them
  async getAvailableSongs(userId) {
    const userVotes = await this.votesCollection.find({ userId }).toArray();
    const votedSongIds = userVotes.map(vote => vote.songId.toString()); // Ensure IDs are strings
  
    // Find all songs
    const songs = await this.songsCollection.find({}).toArray();
  
    // Add the 'voted' flag to each song
    return songs.map(song => ({
      ...song,
      voted: votedSongIds.includes(song._id.toString()) // Compare string versions
    }));
  }

  // Get all the songs a user has voted for
  async getVotedSongs(userId) {
    const userVotes = await this.votesCollection.find({ userId }).toArray();
    const votedSongIds = userVotes.map(vote => vote.songId);

    // Find songs based on voted song IDs
    const votedSongs = await this.songsCollection.find({
      _id: { $in: votedSongIds }
    }).toArray();

    return votedSongs;
  }

  // Get the final selection of songs based on the votes
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
