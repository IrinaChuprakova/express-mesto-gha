const { ObjectId } = require('mongoose').Types;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  if (name === undefined || link === undefined) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    return;
  }
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  if (!(ObjectId.isValid(req.params.cardId) && (String)(new ObjectId(req.params.cardId)) === req.params.cardId)) {
    res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
    return;
  }
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else { res.status(200).send(card); }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const cardLike = (req, res) => {
  if (!(ObjectId.isValid(req.params.cardId) && (String)(new ObjectId(req.params.cardId)) === req.params.cardId)) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    return;
  }
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
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const cardLikeDelete = (req, res) => {
  if (!(ObjectId.isValid(req.params.cardId) && (String)(new ObjectId(req.params.cardId)) === req.params.cardId)) {
    res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    return;
  }
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
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardLikeDelete,
};
