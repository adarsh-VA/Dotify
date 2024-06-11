const Song = require('../models/song.model');
const Artist = require('../models/artist.model');


const getById = async (req, res) => {
    try {
      let { id } = req.params;
      let artist = await Artist.findOne({ _id: id });
      let songs = await Song.find({ artists: artist._id }).populate('artists');
      artist = artist.toObject();
      artist.songs = songs;
      res.status(200).json(artist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const searchArtists = async(req,res) =>{
  try {
    let {q} = req.query;

    const artists = await Artist.find({ name: { $regex: new RegExp(q, 'i') }});
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getById,
  searchArtists
}