const Song = require('../models/song.model');

const getById = async (req, res) => {
    try {
      let { id } = req.params;
      let song = await Song.findOne({ _id:id }).populate('artists');
      res.status(200).json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const searchSongs = async(req,res) =>{
  try {
    let {q} = req.query;
    const songs = await Song.find({ name: { $regex: new RegExp(q, 'i') }});
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getById,
  searchSongs
}