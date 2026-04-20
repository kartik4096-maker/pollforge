const router = require('express').Router();
const Vote   = require('../models/Vote');
const Poll   = require('../models/Poll');
const auth   = require('../middleware/authMiddleware');

// POST /api/votes  — cast a vote (must be logged in)
router.post('/', auth, async (req, res) => {
  try {
    const { pollId, optionIdx } = req.body;
    await Vote.create({ poll: pollId, user: req.user.id, optionIdx });

    // Increment vote count on the option
    await Poll.findByIdAndUpdate(
      pollId,
      { $inc: { [`options.${optionIdx}.votes`]: 1 } }
    );

    res.status(201).json({ message: 'Vote cast' });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Already voted' });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;