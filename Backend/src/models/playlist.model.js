const mongoose = require('mongoose');
const Song = require('../models/song.model');

const playlistSchema = new mongoose.Schema({
  title: String,
  image: String,
  songs: [{type: mongoose.Schema.Types.ObjectId, ref:'Song'}],
  description: String,
  categories: [{type: mongoose.Schema.Types.ObjectId, ref:'Category'}],
  isUserPlaylist: {type: Boolean, default: false}
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;