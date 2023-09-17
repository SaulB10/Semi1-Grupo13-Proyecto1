const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/crearplaylist',playlistController.createPlaylist);
router.post('/editarplaylist',playlistController.editPlaylist);
router.post('/borrarplaylist',playlistController.deletePlaylist);
router.post('/agregarcancionplaylist',playlistController.addSongToPlaylist);
router.post('/eliminacancionplaylist',playlistController.deletePlaylistSong);
router.post('/listadoplaylist',playlistController.GetAllPlaylists);
router.post('/listadoplaylistuser',playlistController.GetAllPlaylistsWithSongs);
router.post('/detalle',playlistController.GetDetailPlaylist);
module.exports = router;