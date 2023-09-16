const express = require('express');
const User = require('../db/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const router = new express.Router();
const { v4: uuidv4 } = require('uuid');

const genPassword = () => {
  return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(16, '0').toUpperCase();
};

// Register route
router.post('/', async (req, res) => {
  try {
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
        return res.status(403).send({ error: 'User already exist' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        mqttCredentials: {
            username: uuidv4(),
            password: genPassword()
        }
    });
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.username });
    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
        return res.status(400).send({ error: 'Invalid password' });
    }
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 days' });

    user.lastLogin = new Date();
    await user.save();
    res.send({ user, token });
  } catch (error) {
      res.status(500).send();
  }
});

// reset route
router.post('/reset-request', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.username });
    if (!user) {
        // for this scene, we don't want to reveal whether the user exists or not
        return res.status(200).send();
    }

    // email user with reset link
    res.send({ user });
  } catch (error) {
      res.status(500).send();
  }
});

// Login route
router.post('/reset-password', async (req, res) => {
  try {
    const user = await User.findOne({ token: req.body.token });
    if (!user) {
        return res.status(404).send({ error: 'User not found, invalid reset'});
    }

    // email user with reset link
    res.send({ user });
  } catch (error) {
      res.status(500).send();
  }
});

// return user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
      res.status(500).send();
  }
});

module.exports = router;
