const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const router = express.Router();

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

router.post('/', auth, async (req, res) => {
  try {
    console.log('Received task data:', req.body);
    const { title, description, category, priority, complexity } = req.body;
    const task = new Task({ title, description, category, priority, complexity, user: req.userId });
    const savedTask = await task.save();
    console.log('Saved task:', savedTask.toObject());
    res.status(201).send(savedTask);
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(400).send(error);
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    console.log('Fetched tasks from database:', JSON.stringify(tasks, null, 2));
    res.send(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send(error);
  }
});

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'completed', 'category', 'priority', 'complexity', 'estimatedTime'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
