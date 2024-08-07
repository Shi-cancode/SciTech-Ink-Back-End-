// routes/tales.js
const express = require('express');
const router = express.Router();
const Tale = require('../models/Tale');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');
// Get all tales
router.get('/', async (req, res) => {
  try {
    const tales = await Tale.find();
    res.json(tales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tale
router.post('/', upload.single('image'), async (req, res) => {
  const tale = new Tale({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
    imagePath: req.file.path,
    isFeatured: req.body.isFeatured
  });

  try {
    const newTale = await tale.save();
    res.status(201).json(newTale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific tale
router.get('/:id', getTale, (req, res) => {
  res.json(res.tale);
});

// Update a tale
router.patch('/:id', getTale, upload.single('image'), async (req, res) => {
  if (req.body.title != null) {
    res.tale.title = req.body.title;
  }
  if (req.body.author != null) {
    res.tale.author = req.body.author;
  }
  if (req.body.content != null) {
    res.tale.content = req.body.content;
  }
  if (req.file != null) {
    res.tale.imagePath = req.file.path;
  }
  if (req.body.isFeatured != null) {
    res.tale.isFeatured = req.body.isFeatured;
  }

  try {
    const updatedTale = await res.tale.save();
    res.json(updatedTale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tale
router.delete('/:id', getTale, async (req, res) => {
  try {
    await res.tale.deleteOne();
    res.json({ message: 'Tale deleted' });
  } catch (error) {
    console.error('Error deleting tale:', error);
    res.status(500).json({ message: 'An error occurred while deleting the tale' });
  }
});

// Middleware function to get a tale by ID
async function getTale(req, res, next) {
  let tale;
  
  
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid tale ID format' });
  }

  try {
    tale = await Tale.findById(req.params.id);
    if (tale == null) {
      return res.status(404).json({ message: 'Cannot find tale' });
    }
  } catch (error) {
    console.error('Error in getTale middleware:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving the tale' });
  }

  res.tale = tale;
  next();
}
module.exports = router;