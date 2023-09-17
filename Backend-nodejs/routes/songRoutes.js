const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const multer = require('multer');

const upload = multer();

router.post('/agregarcancion', upload.single('track') ,songController.createSong);
router.post('/editarcancion', upload.single('track') ,songController.editSong);
router.post('/borrarcancion', songController.deleteSong);
router.post('/detalle', songController.detailSong);
router.post('/reproducircancion', songController.playSong);
router.post('/artistasescuchados', songController.mostPlayedArtists);
router.post('/cancionesescuchadas', songController.mostPlayedSongs);
router.post('/albumsescuchados', songController.mostAlbumsPlayed);
router.post('/cancionesreproducidas', songController.mostPlayedSongsAllTime);
router.get('/canciones', songController.getAllSongs);



module.exports = router;