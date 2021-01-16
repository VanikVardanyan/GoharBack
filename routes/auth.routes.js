const { Router } = require('express');
const router = Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
// api/auth/register
router.post(
  '/register',
  [
    check('email', 'братан email не тот').isEmail(),
    check('password', 'братан пароль с такой длинной херня').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'братик данные нужно поправить',
        });
      }
      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        res.status(400).json({ message: 'брат такой пользователь уже есть' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'брат для тебя все создано, кайфуй' });
    } catch (e) {
      res.status(500).json({ message: 'что то пашло не так брат' });
    }
  }
);
// api/auth/login

router.post(
  '/login',
  [
    check('email', 'Введи нормальный пароль братик').normalizeEmail().isEmail(),
    check('password', 'брат где пароль').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'братик данные нужно поправить при входе',
        });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'нет такого чувака' });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'братик пароль не тот' });
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: 'что то пашло не так брат' });
    }
  }
);

module.exports = router;
