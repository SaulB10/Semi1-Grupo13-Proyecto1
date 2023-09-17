const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

router.post('/crearalbum',albumController.createAlbum);
router.post('/editaralbum',albumController.editAlbum);
router.post('/borraralbum',albumController.deleteAlbum);
router.post('/agregarcancionalbum',albumController.addSongToAlbum);
router.post('/borrarcancionalbum',albumController.deleteAlbumSong);
router.get('/album',albumController.GetAllAlbums);
router.get('/veralbum',albumController.GetAllAlbumsWithSongs);
router.post('/detalle',albumController.GetDetailAlbum);
router.post('/AvalaibleSongs',albumController.GetCancionesSinAlbum);
module.exports = router;
