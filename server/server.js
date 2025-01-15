const path = require("path");
require('dotenv').config();
const express = require("express");
const songsRouter = require("./routes/songs");
const playlistsRouter = require("./routes/playlists");
const searchBarRouter = require("./routes/search_bar");
const userRouter = require("./routes/users");
const authRouter = require('./routes/auth');
const votingRoutes = require("./routes/voting");
const DB_CONSTS = require("./utils/env");
const { dbService } = require('./services/database.service');
const cors = require("cors");
const { authenticateToken } = require("./middlewares/authMiddleware")

const app = express();
const PORT = 5020;
const SIZE_LIMIT = "10mb";
const PUBLIC_PATH = path.join(__dirname);

app.use(cors({ origin: "*" }));

// // afficher chaque nouvelle requête dans la console
// app.use((request, response, next) => {
//   console.log(`New HTTP request: ${request.method} ${request.url}`);
//   next();
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.static(PUBLIC_PATH));

app.use((req, res, next) => {
  const publicRoutes = ['/api/auth/login', '/api/auth/register'];
  if (publicRoutes.includes(req.path)) {
    return next(); // Skip authentication for public routes
  }
  authenticateToken(req, res, next);
});

app.use("/api/auth", authRouter);
app.use("/api/songs", songsRouter.router);
app.use("/api/playlists", playlistsRouter.router);
app.use("/api/search", searchBarRouter.router);
app.use("/api/users", userRouter.router);
app.use('/api/voting', votingRoutes.router);

const server = app.listen(PORT, () => {
  dbService.connectToServer(DB_CONSTS.DB_URL).then(async () => {
    await playlistsRouter.playlistService.populateDb();
    await songsRouter.songService.populateDb();

    console.log(`Listening on port ${PORT}.`);
  });
});

module.exports = server;
