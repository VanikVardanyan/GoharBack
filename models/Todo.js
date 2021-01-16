const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  todo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  owner: { type: Types.ObjectId, ref: 'User' },
  isChecked: { type: Boolean, default: false },
});

module.exports = model('Todo', schema);
