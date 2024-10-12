const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { description, category, priority, complexity } = req.body;
    const response = await axios.post('http://localhost:5001/estimate', {
      description,
      category,
      priority,
      complexity
    });
    console.log('AI service response:', response.data);
    res.json({ estimatedTime: response.data.estimated_time });
  } catch (error) {
    console.error('Error estimating time:', error);
    res.status(500).json({ error: 'Error estimating time' });
  }
});

module.exports = router;
