const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Карточка с указанным id не найдена'); })
    .then((card) => {
      if (req.user._id !== card.owner._id.valueOf()) {
        throw new Forbidden('Карточки может удалять только создатель');
      }
      Card.findByIdAndRemove(card)
        .then(() => res.send({ card }))
        .catch(next);
    })
    .catch(next);
};

const cardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка с указанным id не найдена'); })
    .then((card) => { res.send({ card }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};

const cardLikeDelete = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Карточка с указанным id не найдена'); })
    .then((card) => { res.send({ card }); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardLikeDelete,
};
