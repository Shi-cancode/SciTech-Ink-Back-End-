
const mongoose = require('mongoose');

const TaleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tale', TaleSchema);