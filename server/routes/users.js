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
 * Supprimer un utilisateur
 * @memberof module:routes/users
 * @name DELETE /users/:id
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

router.post("/:id/playlists", async (req, res) => {
  try {
    const userId = req.params.id;
    const playlistData = req.body;

    // Valider que l'ID est au bon format MongoDB ObjectID
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Invalid user ID format" });
    }

    const playlistId = await userService.addPlaylistForUser(userId, playlistData);
    res.status(HTTP_STATUS.SUCCESS).json({ message: "Playlist added successfully", playlistId });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
});

module.exports = { router, userService };
