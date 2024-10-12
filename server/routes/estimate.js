const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { description } = req.body;
    // This is a placeholder estimation logic
    const estimatedTime = Math.floor(Math.random() * 8) + 1; // Random number between 1 and 8
    res.json({ estimatedTime });
  } catch (error) {
    console.error('Error estimating time:', error);
    res.status(500).json({ error: 'Error estimating time' });
  }
});

module.exports = router;

