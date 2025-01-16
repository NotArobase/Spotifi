const router = require("express").Router();
const { HTTP_STATUS } = require("../utils/http");
const VotingService = require("../services/voting.service");  // Changed this line
const { authenticateToken } = require("../middlewares/authMiddleware");

const votingService = new VotingService();

router.get("/songs", authenticateToken, async (req, res) => {
  try {
    const songs = await votingService.getAvailableSongs(req.user.id);
    res.status(HTTP_STATUS.SUCCESS).json(songs);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
});

// Route to get all the songs a user has voted for
router.get("/votedSongs", authenticateToken, async (req, res) => {
  try {
    const votedSongs = await votingService.getVotedSongs(req.user.id);
    res.status(HTTP_STATUS.SUCCESS).json(votedSongs);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
});

router.post("/vote", authenticateToken, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Song ID required" });
    }
    const result = await votingService.castVote(req.user.id, songId);
    
    if (result.action === 'removed') {
      return res.status(HTTP_STATUS.SUCCESS).json({ message: 'Vote removed!' });
    } else {
      return res.status(HTTP_STATUS.SUCCESS).json({ message: 'Thank you for voting!' });
    }

  } catch (error) {
    if (error.message.includes("Maximum votes")) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    } else {
      res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
    }
  }
});

router.get("/results", authenticateToken, async (req, res) => {
  try {
    const results = await votingService.getFinalSelection();
    res.status(HTTP_STATUS.SUCCESS).json(results);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
});

module.exports = { router };
