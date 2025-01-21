const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { PlaylistService } = require("../services/playlist.service");
const { UserService } = require("../services/user.service");
const { authenticateToken } = require('../middleware/authMiddleware');

const playlistService = new PlaylistService();
const userService = new UserService();

/**
 * Retourne la liste de toutes les chansons
 * @memberof module:routes/playlists
 * @name GET /playlists
 */
router.get("/", async (request, response) => {
  try {
    const playlists = await playlistService.getAllPlaylists();
    response.status(HTTP_STATUS.SUCCESS).json(playlists);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne playlist en fonction de son id
 * @memberof module:routes/playlists
 * @name GET /playlists/:id
 */
router.get("/:id", async (request, response) => {
  try {
    const playlist = await playlistService.getPlaylistById(request.params.id);
    if (playlist) {
      response.status(HTTP_STATUS.SUCCESS).json(playlist);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send("Playlist not found");
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Ajoute une playlist
 * @memberof module:routes/playlists
 * @name POST /playlists
 */
router.post("/", async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    const playlist = await playlistService.addPlaylist(request.body);
    response.status(HTTP_STATUS.CREATED).json(playlist);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Ajoute une playlist pour un user
 * @memberof module:routes/playlists
 * @name POST /playlists/:user_id
 */
router.post("/:user_id", authenticateToken, async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    const userId = request.params.user_id;
    const currentPlaylistsCount = await userService.getPlaylistsCountForUser(userId);
    if (currentPlaylistsCount >= 10) {
      response.status(HTTP_STATUS.BAD_REQUEST).json({ message: "User cannot have more than 10 playlists" });
      return;
    }
    const playlist = await playlistService.addPlaylistForUser(request.params.user_id,request.body);
    response.status(HTTP_STATUS.CREATED).json(playlist);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Mets à jour l'information d'une playlist en fonction de son id
 * @memberof module:routes/playlists
 * @name PUT /playlists/:id
 */
router.put("/:id", async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    const playlist = request.body;
    await playlistService.updatePlaylist(playlist);
    response.status(HTTP_STATUS.SUCCESS).send({ id: playlist.id });
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Supprime une playlist en fonction de son id
 * @memberof module:routes/playlists
 * @name DELETE /playlists/:id
 */
router.delete("/:id", async (request, response) => {
  try {
    const isDeleted = await playlistService.deletePlaylist(request.params.id);
    if (isDeleted) {
      response.status(HTTP_STATUS.SUCCESS).json({ message: "Playlist deleted" });
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).json({ message: "Playlist not found" });
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router, playlistService };
