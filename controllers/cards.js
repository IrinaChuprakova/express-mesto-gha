const Card = require('../models/card');
const { BadRequest, Unauthorized, Forbidden, NotFoundError, Conflict } = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((next));
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => { throw new NotFoundError('Карточка с указанным id не найдена') })
    .then((card) => {
      // удаляет карточку только овнер
    })
    .then((card) => { res.status(200).send(card); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
        return
      } else { res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

const cardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else { res.status(200).send(card); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else { res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

const cardLikeDelete = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else { res.status(200).send(card); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else { res.status(500).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardLikeDelete,
};
