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

module.exports = { router, userService };
