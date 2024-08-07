const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);