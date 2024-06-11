const Playlist = require('../models/playlist.model');
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const path = require('path');
const { bucket } = require('../firebaseConfig');

const allPlaylists = async (req, res) => {
  try {
    let playlists = await Playlist.find().populate('songs categories');
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUserPlaylist = async (req,res) => {
  try {
    
    var userPlaylistsCount = await User.aggregate([
      {$match: {_id: req.user._id}},
      {$lookup: { from: 'playlists', localField: 'playlists', foreignField: '_id', as: 'playlists'}},
      {$unwind: '$playlists'},
      {$match: {'playlists.isUserPlaylist': true}},
      {$group:{ _id: '$_id', count: {$sum:1}}}
    ]);

    if (userPlaylistsCount.length > 0) {
      userPlaylistsCount = userPlaylistsCount[0].count;
    } else {
      userPlaylistsCount = 0;
    }

    var newPlaylist = await Playlist.create({
      title:`My Playlist #${userPlaylistsCount + 1}`,
      image:null,
      songs:[],
      description:'my new playlist',
      categories: null,
      isUserPlaylist: true
    })

    res.status(200).json(newPlaylist);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const allPlaylistsByCategory = async (req, res) => {
  try {
    const playlistsByCategory = await Playlist.aggregate([
      {
        $lookup: {
          from: 'songs',
          localField: 'songs',
          foreignField: '_id',
          as: 'songs'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $unwind: '$songs'
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'songs.artists',
          foreignField: '_id',
          as: 'songs.artists'
        }
      },
      {
        $sort: {'songs.name': 1}
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          image: { $first: '$image' },
          description: { $first: '$description' },
          categories: { $first: '$categories' },
          songs: { $push: '$songs' }
        }
      },
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id:  {
            categoryId: '$categories._id',
            categoryName: '$categories.name'
          },
          playlists: { $push: '$$ROOT' }
        }
      }
    ]);
    res.json(playlistsByCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const playlistsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const playlistsByCategory = await Playlist.find({categories: categoryId})
    .populate({
      path: 'songs',
      populate: {
        path: 'artists',
        model: 'Artist'
      }
    })
    .populate('categories');

    playlistsByCategory.forEach(playlist => {
      playlist.songs.sort((a, b) => a.name.localeCompare(b.name)); // Sort songs by name
    });
    res.json(playlistsByCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editPlaylist = async (req, res) => {
  try {
    const id = req.params.id;
    let {image, title, description} = req.body;

    const playlist = await Playlist.findOne({_id: id});

    if(playlist.image){
      const file = bucket.file(`images/${playlist.image}`);
      file.delete()
    }

    playlist.image = image;
    playlist.title = title;
    playlist.description = description;
    
    await playlist.save();

    let updatedPlaylist = await Playlist.findOne({ _id: id })
      .populate({
        path: 'songs',
        populate: {
          path: 'artists',
          model: 'Artist'
        }
      })
      .populate('categories');

    res.status(200).json(updatedPlaylist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getById = async (req, res) => {
  try {
    let {id} = req.params;
    let playlist = await Playlist.findOne({ _id: id })
      .populate({
        path: 'songs',
        populate: {
          path: 'artists',
          model: 'Artist'
        }
      })
      .populate('categories');
    // Sort the songs by name
    playlist.songs.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchPlaylists = async(req,res) =>{
  try {
    let {q} = req.query;

    const allPlaylists = await Playlist.find({ title: { $regex: new RegExp(q, 'i') }, isUserPlaylist: false });
    const userPlaylists = await User.findOne({ _id: req.user._id }).populate({
      path: 'playlists',
      match: { title: { $regex: new RegExp(q, 'i') }, isUserPlaylist: true }
    }).select('playlists');

    let playlists = allPlaylists;
    if (userPlaylists && userPlaylists.playlists.length > 0) {
      playlists = playlists.concat(userPlaylists.playlists);
    }

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const uploadTempImage = async (req,res) =>{
  try {
    const fileName = `images/${Date.now()}${path.extname(req.file.originalname)}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on('finish', () => {
      const justFileName = path.basename(blob.name);
      res.status(200).json(justFileName);
    });
  
    blobStream.end(req.file.buffer);
  
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteTempImage = async (req,res) =>{
  try {
    let {imageName} = req.params;
    const file = bucket.file(`images/${imageName}`);

    file.delete()
      .then(() => {
        res.status(200).send({ message: 'File deleted successfully' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getUserCreatedPlaylists = async (req,res)=>{
  try {
    var userCreatedPlaylists = await User.aggregate([
      {$match: {_id: req.user._id}},
      {$lookup: { from: 'playlists', localField: 'playlists', foreignField: '_id', as: 'playlists'}},
      {$unwind: '$playlists'},
      {$match: {'playlists.isUserPlaylist': true}},
      { $replaceRoot: { newRoot: '$playlists' } } 
    ]);

    res.status(200).json(userCreatedPlaylists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addSongToPlaylist = async (req,res)=>{
  try {
    let {playlistId, songId} = req.params;
    
    let playlist = await Playlist.findOne({_id:playlistId});

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json({ message: 'Song added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const removeSongFromPlaylist = async (req,res)=>{
  try {
    let {playlistId, songId} = req.params;
    
    let playlist = await Playlist.findOne({_id:playlistId});

    playlist.songs = playlist.songs.filter(item => item._id != songId);
    await playlist.save();
   
    let updatedPlaylist = await Playlist.findOne({_id:playlistId})
    .populate({
      path: 'songs',
      populate: {
        path: 'artists',
        model: 'Artist'
      }
    })
    .populate('categories');

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  allPlaylists,
  allPlaylistsByCategory,
  playlistsByCategory,
  getById,
  createUserPlaylist,
  getUserCreatedPlaylists,
  removeSongFromPlaylist,
  addSongToPlaylist,
  uploadTempImage,
  deleteTempImage,
  editPlaylist,
  searchPlaylists
}