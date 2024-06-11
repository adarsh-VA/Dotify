const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserPlaylists, registerAdmin, logoutUser, getCurrentUser, testUser, setUserPlaylist, removeUserPlaylist, deleteUserPlaylist } = require('../controllers/user.controller');
const verifyToken  = require('../middlewares/auth');

// User routes
router.post('/register', registerUser);
router.post('/adminRegister', registerAdmin);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.get('/current-user',verifyToken, getCurrentUser);
router.get('/getUserPlaylists',verifyToken, getUserPlaylists);
router.put('/addPlaylist/:id',verifyToken, setUserPlaylist);
router.put('/removePlaylist/:id',verifyToken, removeUserPlaylist);
router.delete('/:userId/deleteUserPlaylist/:playlistId',verifyToken, deleteUserPlaylist);
router.get('/test',testUser);
module.exports = router;
