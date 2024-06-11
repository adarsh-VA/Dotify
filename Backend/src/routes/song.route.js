// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {getById, searchSongs } = require('../controllers/song.controller');
const verifyToken = require('../middlewares/auth');

router.use(verifyToken);

// Playlist Routes
router.get('/search', searchSongs);
router.get('/:id', getById);


module.exports = router;
