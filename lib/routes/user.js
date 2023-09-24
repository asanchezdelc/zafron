const express = require('express');
const User = require('../db/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const router = new express.Router();
const { v4: uuidv4 } = require('uuid');
const { send } = require('../services/email');

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

    delete user.password;

    res.send({ user, token });
  } catch (error) {
      res.status(500).send();
  }
});

// reset route
router.post('/reset-request', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        // for this scene, we don't want to reveal whether the user exists or not
        return res.status(200).send({ success: true});
    }

    // generate token
    const token = jwt.sign({
       _id: user._id.toString(),
       scope: 'password-reset',
      }, process.env.JWT_SECRET, { expiresIn: '1d' });


    await send('password-reset', { 
      to: user.email, 
      subject: 'Password Reset' 
    }, { 
      resetLink: `${process.env.PUBLIC_URL}/reset-password?token=${token}`,
    });

    // email user with reset link
    res.status(200).send({ success: true});
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: true });
  }
});

// Login route
router.post('/reset-password', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(404).send({ error: 'User not found, invalid reset'});
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    user.password = hashedPassword;
    await user.save();

    // email user with reset link
    res.send({ success: true });
  } catch (error) {
      console.log(error);
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
