const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  priority: { type: String },
  complexity: { type: String },
  estimatedTime: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
