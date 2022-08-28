const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  cardLike,
  cardLikeDelete,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', cardLike);
router.delete('/:cardId/likes', cardLikeDelete);

module.exports = router;
