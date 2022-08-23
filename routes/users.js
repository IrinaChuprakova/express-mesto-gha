const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getCurrentUser,
  getUserId,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getUserId);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({ avatar: Joi.string().required().regex(/^http/) }),
}), updateAvatar);

module.exports = router;
