// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {allPlaylists, createUserPlaylist, editPlaylist, searchPlaylists, addSongToPlaylist, uploadTempImage, deleteTempImage, removeSongFromPlaylist, getUserCreatedPlaylists, allPlaylistsByCategory, playlistsByCategory, getById } = require('../controllers/playlist.controller');
const verifyToken = require('../middlewares/auth');
const upload = require('../middlewares/multer');

//router.use(verifyToken);

// Playlist Routes
router.get('/allPlaylists', allPlaylists);
router.get('/search', verifyToken, searchPlaylists);
router.post('/createUserPlaylist', verifyToken, createUserPlaylist);
router.put('/editPlaylist/:id', verifyToken, editPlaylist);
router.post('/uploadTempImage', verifyToken, upload.single("image"), uploadTempImage);
router.delete('/deleteTempImage/:imageName', verifyToken, deleteTempImage);
router.get('/allPlaylistsByCategory', allPlaylistsByCategory);
router.get('/playlistsByCategory/:categoryId', playlistsByCategory);
router.get('/getUserCreatedPlaylists', verifyToken, getUserCreatedPlaylists);
router.put('/:playlistId/addSongToPlaylist/:songId', verifyToken, addSongToPlaylist);
router.put('/:playlistId/removeSongFromPlaylist/:songId', verifyToken, removeSongFromPlaylist);
router.get('/:id', getById);


module.exports = router;
