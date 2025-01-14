const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DB_CONSTS = require("../utils/env");
const {UserService} = require('../services/user.service');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; 

// Simulating a user database collection
const userService = new UserService();

// Registration endpoint    
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const existingUser = await userService.userExists(username);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userService.createUser({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = await userService.getUserByLogin(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '10h' });
  res.json({ token });
});

module.exports = router;
