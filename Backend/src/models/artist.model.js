const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: String,
  image: String,
  caption: String,
  about: String
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;