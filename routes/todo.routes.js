const { Router } = require('express');
const Todo = require('../models/Todo');
const router = Router();
const auth = require('../middleware/auth.middleware');
const { check, validationResult } = require('express-validator');

router.post(
  '/create',
  [
    check('todo', 'братан todo с такой длинной херня').isLength({
      min: 2,
    }),
  ],
  auth,
  async (req, res) => {
    try {
      const { todo } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'братик пиши нормально',
        });
      }
      const todos = new Todo({
        todo,
        owner: req.user.userId,
      });

      await todos.save();
      res.status(201).json({ todo });
    } catch (e) {
      res.status(500).json({ message: 'что то пашло не так брат' });
    }
  }
);

router.post('/delet', auth, async (req, res) => {
  try {
    const { id } = req.body;
    await Todo.deleteOne({ _id: id });
    res.status(200).json({ message: 'все четко удалил' });
  } catch (e) {
    res.status(500).json({ message: 'что то пашло не так брат' });
  }
});

router.get('/checked/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.updateOne(
      { _id: req.params.id },
      { $set: { isChecked: true } }
    );
    res.json(todo);
  } catch (e) {
    res.status(500).json({ message: 'что то пашло не так брат' });
  }
});

router.get('/unchecked/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.updateOne(
      { _id: req.params.id },
      { $set: { isChecked: false } }
    );
    res.json(todo);
  } catch (e) {
    res.status(500).json({ message: 'что то пашло не так брат' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user.userId });
    res.json(todos);
  } catch (e) {
    res.status(500).json({ message: 'что то пашло не так брат' });
  }
});

module.exports = router;
