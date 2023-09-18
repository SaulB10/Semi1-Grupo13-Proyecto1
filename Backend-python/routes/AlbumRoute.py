import base64

from flask import Blueprint, Flask, request, jsonify, session
import boto3
from sqlalchemy.sql import text
from Config import bucket_name
from util.util import md5_hash

s3 = boto3.client('s3')
album_blueprint = Blueprint('album', __name__)


@album_blueprint.route('/crearalbum', methods=['POST'])
def create_album():
    from models.DBTables import Album, db
    # Check if user is an admin (user_id is 1)
    #if 'user_id' not in session or session['user_id'] != ADMIN_ID:
    #    return jsonify({"mensaje": "Unauthorized. Only admins can add albums."}), 403
    data = request.json
    # Retrieve data from form
    nombre = data.get('Nombre')
    descripcion = data.get('Descripcion')
    artista_id = data.get('Idartista')
    image_data = data.get('Foto')  # Assuming the image is being uploaded as a file
    # Check if all required data is present
    if not nombre or not descripcion or not artista_id:
        return jsonify({"mensaje": "Missing required fields"}), 400

    conn = db.engine.connect()
    params = {
        'p_Nombre': nombre,
        'p_Descripcion': descripcion,
        'p_Artista_id': int(artista_id)
    }

    # Execute the stored procedure
    procedure_call = text("CALL InsertAlbum(:p_Nombre, :p_Descripcion, :p_Artista_id)")
    with conn.begin():
        result = conn.execute(procedure_call, params)
        album_id = [row[0] for row in result][0]

    result.close()
    conn.close()

    if image_data:
        image_filename = f"Fotos/Albumes/{album_id}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=image_filename, Body=image_data, ContentType='image/jpeg')

    return jsonify({"mensaje": "Album created successfully."}), 200


@album_blueprint.route('/editaralbum', methods=['POST'])
def edit_album():
    from models.DBTables import Album, db
    #if 'user_id' not in session or session['user_id'] != ADMIN_ID:
    #    return jsonify({"mensaje": "Unauthorized. Only admins can edit artists."}), 403
    data = request.json
    # Retrieve data from form
    id_album = data.get('Idalbum')
    nombre = data.get('Nombre')
    descripcion = data.get('Descripcion')
    image_data = data.get('Foto')  # Assuming the image is being uploaded as a file

    # Check if all required data is present
    if not id_album or not nombre or not descripcion:
        return jsonify({"mensaje": "Missing required fields"}), 400

    conn = db.engine.connect()
    params = {
        'p_idAlbum': int(id_album),
        'p_Nombre': nombre,
        'p_Descripcion': descripcion
    }

    # Execute the stored procedure
    procedure_call = text("CALL ActualizarAlbum(:p_idAlbum, :p_Nombre, :p_Descripcion)")
    with conn.begin():
        conn.execute(procedure_call, params)

    conn.close()

    # Update album image in S3 if provided
    if image_data:
        image_filename = f"Fotos/Albumes/{id_album}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=image_filename, Body=image_data, ContentType='image/jpeg')

    return jsonify({"mensaje": "Album updated successfully"}), 200


@album_blueprint.route('/borraralbum', methods=['POST'])
def delete_album():
    from models.DBTables import Album, Usuario, db  # Assuming your database setup is in DBTables
    # Retrieve data from form
    data = request.json
    id_album = data.get('Idalbum')
    password = data.get('password')
    hashed_password = md5_hash(password)
    # Check if all required data is present
    if not id_album or not password:
        return jsonify({"mensaje": "Missing required fields"}), 400

    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc('VerificarPasswordPorID', (1, hashed_password, ))
        result_ = cursor.fetchone()
        result = dict(zip([key[0] for key in cursor.description], result_))
        cursor.close()
    except Exception as e:
        return jsonify({"mensaje": "Password incorrecto."}), 400
    if result["Resultado"] != 1:
        return jsonify({"mensaje": "Password incorrecto."}), 400



    # Fetch artist details using the provided ID
    album = Album.query.filter_by(idAlbum=id_album).first()
    if not album:
        return jsonify({"mensaje": "Album not found."}), 400
    album_image_path = album.Foto
    # First, let's fetch the Fotografia field (path to S3 image) before deleting
    # artist_image_path_query = db.session.execute(f"SELECT Fotografia FROM Artista WHERE idArtista = {artist_id}").first()
    # Execute the stored procedure
    if not album_image_path:
        return jsonify({"mensaje": "Album not found."}), 400

    conn = db.engine.connect()
    params = {
        'p_idAlbum': int(id_album)
    }
    # Execute the stored procedure to delete the album
    procedure_call = text("CALL BorrarAlbum(:p_idAlbum)")
    with conn.begin():
        conn.execute(procedure_call, params)
    conn.close()
    # Remove the artist's photo from S3 if exists
    if album_image_path:
        s3.delete_object(Bucket=bucket_name, Key=album_image_path)
    return jsonify({"mensaje": "Album deleted successfully"}), 200


@album_blueprint.route('/agregarcancionalbum', methods=['POST'])
def add_song_to_album():
    from models.DBTables import Album, Usuario, db  # Assuming your database setup is in DBTables
    # Ensure user is logged in and is an admin
    #if 'user_id' not in session or session['user_id'] != ADMIN_ID:
    #    return jsonify({"mensaje": "Unauthorized. Only admins can delete albums."}), 403
    data = request.json
    # Retrieve data from form
    id_album = data.get('Idalbum')
    id_cancion = data.get('Idcancion')

    # Check if all required data is present
    if not id_album or not id_cancion:
        return jsonify({"mensaje": "Missing required fields"}), 400

    conn = db.engine.connect()
    params = {
        'p_Album_id': int(id_album),
        'p_Cancion_id': int(id_cancion)
    }

    # Execute the stored procedure to add song to album
    procedure_call = text("CALL AgregarCancionAAlbum(:p_Album_id, :p_Cancion_id)")
    with conn.begin():
        result = conn.execute(procedure_call, params)
        outcome = [row[0] for row in result][0]

    result.close()
    conn.commit()
    conn.close()

    if outcome == 1:
        return jsonify({"mensaje": "Song added to the album successfully"}), 200
    elif outcome == 2:
        return jsonify({"mensaje": "Song is already associated with the album"}), 400
    else:
        return jsonify({"mensaje": "There was an error adding the song to the album"}), 500


@album_blueprint.route('/borrarcancionalbum', methods=['POST'])
def delete_song_from_album():
    from models.DBTables import Album, Usuario, db  # Assuming your database setup is in DBTables
    # Ensure user is logged in and is an admin
    #if 'user_id' not in session or session['user_id'] != ADMIN_ID:
    #    return jsonify({"mensaje": "Unauthorized. Only admins can delete albums."}), 403
    data = request.json
    # Retrieve data from form
    id_album = data.get('Idalbum')
    id_cancion = data.get('Idcancion')

    # Check if all required data is present
    if not id_album or not id_cancion:
        return jsonify({"mensaje": "Missing required fields"}), 400

    conn = db.engine.connect()
    params = {
        'p_Album_id': int(id_album),
        'p_Cancion_id': int(id_cancion)
    }

    # Execute the stored procedure to delete the song from the album
    procedure_call = text("CALL BorrarCancionDeAlbum(:p_Album_id, :p_Cancion_id)")

    with conn.begin():
        result = conn.execute(procedure_call, params)
    result.close()
    conn.close()
    return jsonify({"mensaje": "Song successfully removed from album!"}), 200


@album_blueprint.route('/album', methods=['GET'])
def get_all_albums():
    from models.DBTables import Album, Usuario, db
    #if 'user_id' not in session:
    #    return jsonify({"mensaje": "Unauthorized. User must log in."}), 403

    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc("GetAlbums")
        albums = cursor.fetchall()
        albums = [dict(zip([key[0] for key in cursor.description], row)) for row in albums]
    finally:
        cursor.close()
        conn.commit()
        conn.close()

    return jsonify({"albums": albums}), 200


@album_blueprint.route('/veralbum', methods=['GET'])
def get_all_with_songs():
    from models.DBTables import Album, Usuario, db
    #if 'user_id' not in session:
    #    return jsonify({"mensaje": "Unauthorized. User must log in."}), 403

    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc("GetAlbums")
        albums_ = cursor.fetchall()
        albums = [dict(zip([key[0] for key in cursor.description], row)) for row in albums_]
        cursor.close()  # close the previous cursor

        # Fetching songs for each album
        for album in albums:
            song_cursor = conn.cursor()
            song_cursor.callproc("GetCancionesPorAlbum", (album['Idalbum'],))
            songs_ = song_cursor.fetchall()
            songs = [dict(zip([key[0] for key in song_cursor.description], row)) for row in songs_]
            album['songs'] = songs
            song_cursor.close()  # close the inner cursor
    finally:
        conn.commit()
        conn.close()

    return jsonify(albums), 200


@album_blueprint.route('/detalle', methods=['POST'])
def get_detalle():
    from models.DBTables import Album, Usuario, db
    id_album = request.json.get('Idalbum')

    conn = db.engine.raw_connection()

    try:
        # First, get the album details using the first cursor
        cursor1 = conn.cursor()
        cursor1.callproc("GetAlbumPorId", (id_album,))
        album_row = cursor1.fetchone()
        if not album_row:
            cursor1.close()
            raise Exception('No album found for the given Idalbum')
        album = dict(zip([key[0] for key in cursor1.description], album_row))
        cursor1.close()
        cursor2 = conn.cursor()
        cursor2.callproc("GetCancionesPorAlbumId", (id_album,))
        songs_ = cursor2.fetchall()
        songs = [dict(zip([key[0] for key in cursor2.description], row)) for row in songs_]
        cursor2.close()
        album['canciones'] = songs
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener datos", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()

    return jsonify(album), 200



@album_blueprint.route('/AvalaibleSongs', methods=['POST'])
def get_canciones_sin_album():
    from models.DBTables import Album, Usuario, db
    id_artista = request.json.get('Idartista')

    # I'm assuming you are using raw connection, similar to your earlier examples
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc("GetCancionesSinAlbum", (id_artista,))
        result = cursor.fetchall()
        songs = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
    except Exception as e:
        print(f"Error al obtener las canciones sin album: {e}")
        return jsonify({"mensaje": "Error al obtener las canciones sin album!"}), 400
    finally:
        cursor.close()
        conn.commit()
        conn.close()
    return jsonify({"canciones" : songs}), 200
