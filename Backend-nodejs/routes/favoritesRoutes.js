const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

router.post('/darfavorito', favoritesController.createFavorite);
router.post('/quitarfavorito', favoritesController.removeFavorite);
router.post('/favoritos', favoritesController.getFavorites);

module.exports = router;