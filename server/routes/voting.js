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

router.post("/vote", authenticateToken, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Song ID required" });
    }
    const result = await votingService.castVote(req.user.id, songId);
    res.status(HTTP_STATUS.SUCCESS).json(result);
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