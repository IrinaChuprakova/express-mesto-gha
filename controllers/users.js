const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest, Unauthorized, Forbidden, NotFoundError, Conflict } = require('../errors/errors');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((next));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((next));
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new NotFoundError('Запрашиваемый пользователь не найден') })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next BadRequest('Переданы некорректные данные при создании пользователя');
        return;
      }
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
        return;

      }
      next(err);
    });
};

const updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new NotFoundError('Пользователь с указанным id не найден') })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new NotFoundError('Пользователь с указанным id не найден') })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};

module.exports = {
  login,
  getUsers,
  getCurrentUser,
  getUserId,
  createUser,
  updateProfile,
  updateAvatar,
};
