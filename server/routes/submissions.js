const router = require("express").Router();
const { HTTP_STATUS } = require("../utils/http");
const SubmissionsService = require("../services/submissions.service");
const { authenticateToken } = require("../middlewares/authMiddleware");

const submissionsService = new SubmissionsService();

/**
 * POST /api/submissions
 * Create a new song submission.
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, artist, genre, link, description } = req.body;
    if (!name || !artist || !genre || !link || !description) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Missing required fields (name, artist, genre, link).",
      });
    }

    const submission = await submissionsService.createSubmission({
      name,
      artist,
      genre,
      link,
      description,
    });

    res.status(HTTP_STATUS.CREATED).json(submission);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
});

/**
 * (Optional) GET /api/submissions
 * Retrieve all submissions (for moderator/admin).
 */
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const submissions = await submissionsService.getAllSubmissions();
//     res.status(HTTP_STATUS.SUCCESS).json(submissions);
//   } catch (error) {
//     res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
//   }
// });

module.exports = { router };
