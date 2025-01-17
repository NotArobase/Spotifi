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

  // Renamed method: Get leaderboard with song vote counts
  async getLeaderboard() {
    // Aggregate vote counts for each song
    const voteResults = await this.votesCollection.aggregate([
      { $group: { _id: "$songId", count: { $sum: 1 } } },  // Group by songId and count votes
      { $sort: { count: -1 } }  // Sort by vote count in descending order
    ]).toArray();
  
    // Fetch only the necessary fields (name, artist, id)
    const allSongs = await this.songsCollection.find({}, { projection: { name: 1, artist: 1, _id: 1 } }).toArray();
    
    // Map songs to leaderboard with vote counts
    const leaderboard = allSongs.map(song => {
      const voteResult = voteResults.find(vr => vr._id === song._id.toString());
      return voteResult
        ? { ...song, voteCount: voteResult.count }
        : { ...song, voteCount: 0 };  // If no vote, set count to 0
    });
  
    // Sort leaderboard by vote count
    leaderboard.sort((a, b) => b.voteCount - a.voteCount);
  
    return leaderboard;
  }
}

module.exports = VotingService;
