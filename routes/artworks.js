const express = require('express');
const router = express.Router();
const Artwork = require('../models/artworks');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');

// Get all artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create a new artwork
router.post('/', upload.single('image'), async (req, res) => {
    const artwork = new Artwork({
      name: req.body.name,
      price: req.body.price,
      imagePath: req.file.path,
      isBestSeller: req.body.isBestSeller === 'true'
    });
  
    try {
      const newArtwork = await artwork.save();
      res.status(201).json(newArtwork);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
// Get a specific artwork
router.get('/:id', getArtwork, (req, res) => {
  res.json(res.artwork);
});

// Update an artwork
router.patch('/:id', getArtwork, upload.single('image'), async (req, res) => {
    if (req.body.name != null) {
      res.artwork.name = req.body.name;
    }
    if (req.body.price != null) {
      res.artwork.price = req.body.price;
    }
    if (req.file != null) {
      res.artwork.imagePath = req.file.path;
    }
    if (req.body.isBestSeller != null) {
      res.artwork.isBestSeller = req.body.isBestSeller === 'true';
    }
  
    try {
      const updatedArtwork = await res.artwork.save();
      res.json(updatedArtwork);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete an artwork
router.delete('/:id', getArtwork, async (req, res) => {
  try {
    await res.artwork.remove();
    res.json({ message: 'Artwork deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get an artwork by ID


async function getArtwork(req, res, next) {
  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid artwork ID format' });
  }

  let artwork;
  try {
    artwork = await Artwork.findById(req.params.id);
    if (artwork == null) {
      return res.status(404).json({ message: 'Cannot find artwork' });
    }
  } catch (error) {
    console.error('Error in getArtwork middleware:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving the artwork' });
  }

  res.artwork = artwork;
  next();
}

module.exports = router;