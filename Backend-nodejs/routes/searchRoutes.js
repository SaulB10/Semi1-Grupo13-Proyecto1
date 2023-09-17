const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/buscarcancion', searchController.SearchSongs);
router.post('/buscaralbum', searchController.SearchAlbums);
router.post('/buscarartista', searchController.SearchArtists);


module.exports = router;