const express = require('express');
const { getStats, getUserStats, upsertUserStats } = require('../models/UserStats'); // imports already created functionalities to get data

const router = express.Router();

// gets all stats
router.get('/', (req, res) => {
  const stats = getStats();
  res.json(stats);
});

// gets data from a specific user based on their userId
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const userStats = getUserStats(userId);

  if (!userStats) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(userStats);
});

// used to create or update user stats based on their Id
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  const updatedStats = upsertUserStats(userId, updates);
  res.status(200).json(updatedStats);
});

module.exports = router;
