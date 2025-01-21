const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { SongService } = require("../services/songs.service");
const fs = require("fs");
const path = require("path");
const songService = new SongService();

/**
 * Retourne la liste de toutes les chansons
 * @memberof module:routes/songs
 * @name GET /songs
 */
router.get("/", async (request, response) => {
  try {
    const songs = await songService.getAllSongs();
    response.status(HTTP_STATUS.SUCCESS).json(songs);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne une chanson en fonction de son id
 * @memberof module:routes/songs
 * @name GET /songs/:id
 */
router.get("/:id", async (request, response) => {
  try {
    const song = await songService.getSongById(request.params.id);
    if (song) {
      response.status(HTTP_STATUS.SUCCESS).json(song);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne le contenu d'un fichier de musique en fonction de son id
 * @memberof module:routes/songs
 * @name GET /songs/player/:id/
 */
router.get("/player/:id", async (request, response) => {
  try {
    const song = await songService.getSongById(request.params.id);
    const filePath = path.join(__dirname + "../../" + song.src);
    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const readStream = fs.createReadStream(path.join(__dirname + "../../" + song.src));
    const headers = {
      "Content-Type": ":audio/mpeg",
      "Content-Length": fileSize,
    }
    response.status(HTTP_STATUS.SUCCESS);
    response.set(headers);
    readStream.pipe(response);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Modifie l'état aimé d'une chanson en fonction de son id
 * @memberof module:routes/songs
 * @name PATCH /songs/:id/like
 */
router.patch("/:id/like", async (request, response) => {
  const liked = await songService.updateSongLike(request.params.id);
  response.status(HTTP_STATUS.SUCCESS).json({ liked });
})

// Add a new song
router.post("/", async (req, res) => {
  try {
    const song = req.body; // Get song data from the request body
    if (!song || !song.name || !song.src) {
      return res.status(400).json({ error: "Invalid song data" });
    }

    const addedSong = await songService.addSong(song); // Use the addSong method
    res.status(201).json(addedSong); // Respond with the added song
  } catch (error) {
    console.error("Error adding song:", error);
    res.status(500).json({ error: "Failed to add song to the database" });
  }
});

module.exports = { router, songService };
