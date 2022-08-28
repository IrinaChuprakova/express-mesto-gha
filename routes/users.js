const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getCurrentUser,
  getUserId,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/avatar', celebrate({
  body: Joi.object().keys({ avatar: Joi.string().required().regex(/^http/) }),
}), updateAvatar);

module.exports = router;
