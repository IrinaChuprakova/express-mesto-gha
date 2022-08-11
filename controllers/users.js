const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else { res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else { res.status(200).send(user); }
    })
    .catch(() => {
      if (!(ObjectId.isValid(req.params.cardId) && (String)(new ObjectId(req.params.cardId)) === req.params.cardId)) {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      } res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else { res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

const updateProfile = (req, res) => {
  if (req.body.name === undefined || req.body.about === undefined) {
    res.status(400).send({ message: ' Переданы некорректные данные при обновлении профиля' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      } else { res.status(200).send(user); }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  if (req.body.avatar === undefined) {
    res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((avatar) => {
      if (avatar === null) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      } else { res.status(200).send(avatar); }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
};
