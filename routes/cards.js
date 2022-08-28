const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardLikeDelete,
} = require('../controllers/cards');

const CardId = celebrate({
  params: {
    cardId: Joi.string().hex().length(24),
  },
});

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', CardId, deleteCard);
router.put('/:cardId/likes', CardId, cardLike);
router.delete('/:cardId/likes', CardId, cardLikeDelete);

module.exports = router;
