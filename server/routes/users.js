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
 * Inscription d'un utilisateur
 * @memberof module:routes/users
 * @name POST /users/register
 */
router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      response.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Email and password are required" });
      return;
    }
    const user = await userService.registerUser(email, password);
    response.status(HTTP_STATUS.CREATED).json(user);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Connexion utilisateur
 * @memberof module:routes/users
 * @name POST /users/login
 */
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      response.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Email and password are required" });
      return;
    }
    const token = await userService.loginUser(email, password);
    if (token) {
      response.status(HTTP_STATUS.SUCCESS).json({ token });
    } else {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid email or password" });
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
router.delete("/:id", async (request, response) => {
  try {
    const isDeleted = await userService.deleteUser(request.params.id);
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
