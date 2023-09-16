const jwt = require('jsonwebtoken');
const User = require('../db/models/user');
const SECRET_KEY = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
        throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
      res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = auth;
