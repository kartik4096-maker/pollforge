const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  poll:      { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  optionIdx: { type: Number, required: true },
  votedAt:   { type: Date, default: Date.now },
});

// Prevent double voting
voteSchema.index({ poll: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
