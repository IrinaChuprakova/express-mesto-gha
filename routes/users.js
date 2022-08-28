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
router.get('/:userId', celebrate({
  params: {
    userId: Joi.string().hex().length(24),
  },
}), getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({ avatar: Joi.string().required().regex(/^(ftp|http|https):\/\/[^ "]+$/) }),
}), updateAvatar);

module.exports = router;
