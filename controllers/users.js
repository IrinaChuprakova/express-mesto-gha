const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then((avatar) => res.send(avatar))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
};
