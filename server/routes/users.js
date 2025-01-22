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
 * Incrémente le nombre de playlists d'un utilisateur 
 * @memberof module:routes/users 
 * @name PUT /users/:userName/increment_playlist
 */
router.put("/:userName/increment_playlist", async (req, res) => {
  try { 
    const user = req.params.userName;
    await userService.incrementPlaylistCount(user);
    res.status(HTTP_STATUS.SUCCESS).json({ message: "N_playlist incremented successfully" });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message }); }
  });

  /**
  * Décrémente le nombre de playlists d'un utilisateur 
  * @memberof module:routes/users 
  * @name PUT /users/:user_id/decrement_playlist
  */ 
 router.put("/:userName/decrement_playlist", async (req, res) => {
  try {
    const user = req.params.userName;
    await userService.decrementPlaylistCount(user);
    res.status(HTTP_STATUS.SUCCESS).json({ message: "N_playlist decremented successfully" });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
});

  /**
  * Donne le nombre de de playlist pour un utilisateur donné 
  * @memberof module:routes/users 
  * @name GET /users/:userName/playlists-count
  */ 
  router.get("/:userName/playlists-count", async (req, res) => {
    try {
      const username = req.params.userName;
      const count = await userService.getPlaylistsCountForUser(username);
      res.status(HTTP_STATUS.SUCCESS).json({ count });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message });
  }
  });
  
module.exports = { router, userService };
