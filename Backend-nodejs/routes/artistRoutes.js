const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

router.post('/create', artistController.createArtist);
router.post('/get', artistController.getArtist);
router.post('/edit', artistController.editArtist);
router.delete('/delete', artistController.deleteArtist);
router.get('/artista', artistController.getAllArtists);

module.exports = router;