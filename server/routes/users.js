const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { UserService } = require("../services/user.service");

const userService = new UserService();

/**
 * Retourne la liste de tous les utilisateurs
 * @memberof module:routes/users
 * @name GET /users
 */
router.get("/", async (request, response) => {
  try {
    const users = await userService.getAllUsers();
    response.status(HTTP_STATUS.SUCCESS).json(users);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne un utilisateur en fonction de son id
 * @memberof module:routes/users
 * @name GET /users/:id
 */
router.get("/:id", async (request, response) => {
  try {
    const user = await userService.getUserById(request.params.id);
    if (user) {
      response.status(HTTP_STATUS.SUCCESS).json(user);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send("User not found");
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/** 
 * Retourne le nombre de playlists pour un utilisateur donné
 * @memberof module:routes/users
 * @name GET /users/:id/playlists-count
 */ 
router.get("/:id/playlists-count", async (req, res) => {
  try {
    const userId = req.params.id;

    // Valider que l'ID est au bon format MongoDB ObjectID
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Invalid user ID format" });
    }

    const playlistsCount = await userService.getPlaylistsCountForUser(userId);
    res.status(HTTP_STATUS.SUCCESS).json({ userId, playlistsCount });
    } catch (error) {
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des playlists" });
  }
});

/**
 * Supprimer un utilisateur
 * @memberof module:routes/users
 * @name DELETE /users/:username
 */
router.delete("/:username", async (request, response) => {
  try {
    const isDeleted = await userService.deleteUser(request.params.username);
    if (isDeleted) {
      response.status(HTTP_STATUS.SUCCESS).json({ message: "User deleted" });
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne les chansons d'un utilisateur en fonction de son id
 * @memberof module:routes/users
 * @name GET /users/:id/songs
 */
router.get("/:username/songs", async (request, response) => {
  try {
    const songs = await userService.getUserSongs(request.params.username);
    response.status(HTTP_STATUS.SUCCESS).json(songs);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Retourne les playlists d'un utilisateur en fonction de son id
 * @memberof module:routes/users
 * @name GET /users/:id/playlists
 */
router.get("/:username/playlists", async (request, response) => {
  try {
    const playlists = await userService.getUserPlaylists(request.params.username);
    response.status(HTTP_STATUS.SUCCESS).json(playlists);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Met à jour le nombre de playlists pour un utilisateur donné
 * @memberof module:routes/users
 * @name PATCH /users/:id/playlists-count
 */
router.patch("/:id/playlists-count", async (req, res) => {
  try {
    const userId = req.params.id;
    const { nbPlaylist } = req.body;

    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "Invalid user ID format" });
    }

    // Pass the responsibility to the service
    const updatedUser = await userService.updateUserPlaylistsCount(userId, nbPlaylist);

    res.status(HTTP_STATUS.SUCCESS).json(updatedUser);
  } catch (error) {
    res
      .status(HTTP_STATUS.BAD_REQUEST) // Use BAD_REQUEST for user errors
      .json({ error: error.message });
  }
});


module.exports = { router, userService };
