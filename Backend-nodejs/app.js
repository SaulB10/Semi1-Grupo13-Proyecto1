const dotenv = require('dotenv/config')
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const songRoutes = require('./routes/songRoutes');
const albumRoutes = require('./routes/albumRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const searchRoutes = require('./routes/searchRoutes');
const favoriteRoutes = require('./routes/favoritesRoutes');
//middlewares
app.use(express.urlencoded({limit: '10mb',extended: true}));
app.use(express.json({limit: '10mb'}));
app.use(cors({origin : '*'}))
//rutas
app.use('/users', userRoutes); // Montar las rutas bajo /users
app.use('/artist', artistRoutes); // Montar las rutas bajo /artist
app.use('/song', songRoutes); // Montar las rutas bajo /song
app.use('/album', albumRoutes); // Montar las rutas bajo /album
app.use('/playlist', playlistRoutes); // Montar las rutas bajo /playlist
app.use('/search', searchRoutes); // Montar las rutas bajo /search
app.use('/favorite', favoriteRoutes); // Montar las rutas bajo /favorite



app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
