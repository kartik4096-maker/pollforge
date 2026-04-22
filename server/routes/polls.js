const router  = require('express').Router();
const Poll    = require('../models/Poll');
const auth    = require('../middleware/authMiddleware');
const mailer  = require('../utils/mailer');
const axios   = require('axios');

// GET /api/polls  — public, list active polls
router.get('/', async (req, res) => {
  const polls = await Poll.find({ isActive: true }).populate('creator', 'username');
  res.json(polls);
});

// GET /api/polls/:id
router.get('/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id).populate('creator', 'username');
  if (!poll) return res.status(404).json({ message: 'Not found' });
  res.json(poll);
});

// POST /api/polls  — protected
router.post('/', auth, async (req, res) => {
  try {
    const { title, options, expiresAt, invitees } = req.body;
    const poll = await Poll.create({
      title,
      options: options.map(text => ({ text })),
      creator: req.user.id,
      expiresAt,
      invitees: invitees || [],
    });

    // Send email invites
    if (invitees?.length) {
      for (const email of invitees) {
        await mailer.sendInvite(email, poll._id, poll.title);
      }
    }

    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/polls/:id/subscribe  — subscribe for results
router.post('/:id/subscribe', async (req, res) => {
  const { email } = req.body;
  const poll = await Poll.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { subscribers: email } },
    { new: true }
  );
  if (!poll) return res.status(404).json({ message: 'Poll not found' });
  res.json({ message: 'Subscribed successfully' });
});

// POST /api/polls/:id/close  — close poll and notify subscribers
router.post('/:id/close', auth, async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ message: 'Not found' });
  if (String(poll.creator) !== req.user.id)
    return res.status(403).json({ message: 'Not your poll' });

  poll.isActive = false;
  await poll.save();

  for (const email of poll.subscribers) {
    await mailer.sendResults(email, poll);
  }

  res.json({ message: 'Poll closed, subscribers notified' });
});

// GET /api/polls/:id/analytics  — calls FastAPI
router.get('/:id/analytics', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    const { data } = await axios.post(`${process.env.FASTAPI_URL}/analytics`, {
      poll_id: String(poll._id),
      title: poll.title,
      options: poll.options.map(o => ({
        text: o.text,
        votes: o.votes || 0
      })),
    });
    res.json(data);
  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ message: 'Analytics service error' });
  }
});

module.exports = router;