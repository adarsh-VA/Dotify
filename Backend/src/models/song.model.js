const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  image: String,
  artists: [{type: mongoose.Schema.Types.ObjectId, ref:'Artist'}],
  album: String,
  file: String,
  dateAdded: {type: Date, default: new Date()},
  duration: Number
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
