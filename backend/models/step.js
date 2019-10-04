const mongoose = require('mongoose');

const stepSchema = mongoose.Schema({
  recipeId: {type: String, required: true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String },
  videoLink: { type: String },
  timer: {type: Number}
});

module.exports = mongoose.model('Step', stepSchema);
