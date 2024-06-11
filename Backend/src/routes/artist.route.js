// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {getById, searchArtists } = require('../controllers/artist.controller');
const verifyToken = require('../middlewares/auth');

router.use(verifyToken);

// Artist Routes
router.get('/search', searchArtists);
router.get('/:id', getById);


module.exports = router;
