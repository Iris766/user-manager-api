const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// modles
const User = require('../models/User');
const varifyToken = require('./varifyToken');
// get all users
router.get('/users', varifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
// create user/accout route
router.post('/register', async (req, res) => {
  try {
    // check isUserExist
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(201).json({ message: 'email already exist' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const data = await user.save();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// login route
router.post('/login', async (req, res) => {
  // find user info from his email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(201).json({ message: 'You May Have to Create an Account' });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid Password' });
  }

  // create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  res.header('auth-token', token);

  res.status(200).json({ message: 'Loged in Successfully', token, user });
});

module.exports = router;
