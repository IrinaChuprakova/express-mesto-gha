const Card = require('../models/card');
const { BadRequest, Forbidden, NotFoundError } = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send({ card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ card }))
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
        .then(() => res.status(200).send({ card }))
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
    .then((card) => { res.status(200).send({ card }); })
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
    .then((card) => { res.status(200).send({ card }); })
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
