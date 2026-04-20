const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  options:   [{ text: String, votes: { type: Number, default: 0 } }],
  creator:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive:  { type: Boolean, default: true },
  expiresAt: { type: Date },
  subscribers: [{ type: String }], // email list
  invitees:    [{ type: String }], // invited email list
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);