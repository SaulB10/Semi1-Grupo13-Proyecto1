db = None
Usuario = None
Album = None
Album_Cancion = None
Artista = None
Cancion = None
Favorito = None
Historico = None
Playlist = None
Playlist_Cancion = None


def define_models():
    global Usuario, Album, Album_Cancion, Artista, Cancion, Favorito, Historico, Playlist, Playlist_Cancion, ADMIN_ID


    class _Usuario(db.Model):
        __tablename__ = 'Usuario'
        idUsuario = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Nombre = db.Column(db.String(45), nullable=False)
        Apellidos = db.Column(db.String(45), nullable=False)
        Foto = db.Column(db.String(45))
        Correo = db.Column(db.String(45), nullable=False)
        Password = db.Column(db.String(200), nullable=False)
        Fecha_Nacimiento = db.Column(db.Date, nullable=False)

        def __repr__(self):
            return f'<Usuario {self.idUsuario} - {self.Nombre} {self.Apellidos}>'

    # Artista table model
    class _Artista(db.Model):
        __tablename__ = 'Artista'
        idArtista = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Nombre = db.Column(db.String(45), nullable=False)
        Fotografia = db.Column(db.String(45))
        Fecha_Nacimiento = db.Column(db.Date, nullable=False)

    # Album table model
    class _Album(db.Model):
        __tablename__ = 'Album'
        idAlbum = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Nombre = db.Column(db.String(45), nullable=False)
        Descripcion = db.Column(db.String(200))
        Foto = db.Column(db.String(200))
        Artista_idArtista = db.Column(db.Integer, db.ForeignKey('Artista.idArtista'), nullable=False)

    # Cancion table model
    class _Cancion(db.Model):
        __tablename__ = 'Cancion'
        idCancion = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Nombre = db.Column(db.String(45), nullable=False)
        Foto = db.Column(db.String(200))
        Duracion = db.Column(db.String(45), nullable=False)
        mp3 = db.Column(db.String(200), nullable=False)
        Artista_idArtista = db.Column(db.Integer, db.ForeignKey('Artista.idArtista'), nullable=False)

    # Album_Cancion table model
    class _Album_Cancion(db.Model):
        __tablename__ = 'Album_Cancion'
        idAlbum_Cancion = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Album_idAlbum = db.Column(db.Integer, db.ForeignKey('Album.idAlbum'), nullable=False)
        Cancion_idCancion = db.Column(db.Integer, db.ForeignKey('Cancion.idCancion'), nullable=False)

    # Favorito table model
    class _Favorito(db.Model):
        __tablename__ = 'Favorito'
        idFavorito = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Cancion_idCancion = db.Column(db.Integer, db.ForeignKey('Cancion.idCancion'), nullable=False)
        Usuario_idUsuario = db.Column(db.Integer, db.ForeignKey('Usuario.idUsuario'), nullable=False)

    # Historico table model
    class _Historico(db.Model):
        __tablename__ = 'Historico'
        idHistorico = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Usuario_idUsuario = db.Column(db.Integer, db.ForeignKey('Usuario.idUsuario'), nullable=False)
        Cancion_idCancion = db.Column(db.Integer, db.ForeignKey('Cancion.idCancion'), nullable=False)

    # Playlist table model
    class _Playlist(db.Model):
        __tablename__ = 'Playlist'
        idPlaylist = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Nombre = db.Column(db.String(45), nullable=False)
        Descripcion = db.Column(db.String(200))
        Foto = db.Column(db.String(200))
        Usuario_idUsuario = db.Column(db.Integer, db.ForeignKey('Usuario.idUsuario'), nullable=False)

    # Playlist_Cancion table model
    class _Playlist_Cancion(db.Model):
        __tablename__ = 'Playlist_Cancion'
        idPlaylist_Cancion = db.Column(db.Integer, primary_key=True, autoincrement=True)
        Playlist_idPlaylist = db.Column(db.Integer, db.ForeignKey('Playlist.idPlaylist'), nullable=False)
        Cancion_idCancion = db.Column(db.Integer, db.ForeignKey('Cancion.idCancion'), nullable=False)

    # Assign each local class to the global reference

    Usuario = _Usuario
    Album = _Album
    Album_Cancion = _Album_Cancion
    Artista = _Artista
    Cancion = _Cancion
    Favorito = _Favorito
    Historico = _Historico
    Playlist = _Playlist
    Playlist_Cancion = _Playlist_Cancion



def init_app(database):
    global db
    db = database
    define_models()
