const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    res
      .status(500)
      .json({ message: 'The User with the given ID was not found' });
  }
  res.status(200).send(user);
});

router.post('/', async (req, res) => {
  console.log(`this is the user password ${req.body.password}`);
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.zip,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(404).send('the User cannot be created!');

  res.send(user);
});

router.get('/', async (req, res) => {
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userList);
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send('The User not found');
  }

  return res.status(200).send(user);
});
module.exports = router;
