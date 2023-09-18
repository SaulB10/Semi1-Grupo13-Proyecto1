import base64

from flask import Blueprint, Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import boto3
from sqlalchemy.sql import text
from Config import bucket_name

s3 = boto3.client('s3')


song_blueprint = Blueprint('/song', __name__)


@song_blueprint.route('/agregarcancion', methods=['POST'])
def add_song():
    from models.DBTables import Cancion, Usuario, db  # Assuming your database setup is in DBTables
    # Extract data from the form
    track = request.files.get('track')
    nombre = request.form.get('Nombre')
    image_data = request.form.get('Foto')
    duracion = request.form.get('duracion')
    id_artista = request.form.get('Idartista')
    if not nombre or not duracion or not id_artista:
        return jsonify({"mensaje": "Missing required fields"}), 400
    # Execute the stored procedure to create the song record
    conn = db.engine.connect()
    params = {
        'p_Nombre': nombre,
        'p_Duracion': duracion,
        'p_Artista_idArtista': int(id_artista)
    }
    procedure_call = text("CALL InsertarCancion(:p_Nombre, :p_Duracion, :p_Artista_idArtista)")
    with conn.begin():
        result = conn.execute(procedure_call, params)
        song_id = [row[0] for row in result][0]
    result.close()
    conn.close()
    if image_data:
        image_filename = f"Fotos/FotosCanciones/{song_id}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=image_filename, Body=image_data, ContentType='image/jpeg')

    if track:
        track_data = track.read()
        song_filename = f"Canciones/{song_id}.mp3"
        s3.put_object(Bucket=BUCKET_NAME, Key=song_filename, Body=track, ContentType='audio/mpeg')
    return jsonify({"mensaje": "Song added successfully"}), 200


@song_blueprint.route('/editarcancion', methods=['POST'])
def edit_song():
    from models.DBTables import Cancion, Usuario, db  # Assuming your database setup is in DBTables

    # Extract data from the form
    track = request.files.get('track')
    nombre = request.form.get('Nombre')
    file = request.files.get('Foto')
    duracion = request.form.get('duracion')
    id_artista = request.form.get('Idartista')
    id_cancion = request.form.get('Idcancion')


    # Check if all required data is present
    if not nombre or not duracion or not id_artista or not id_cancion:
        return jsonify({"mensaje": "Missing required fields"}), 400

    # Upload the song and image to S3 if provided
    if file:
        image_data = file.read()
        image_filename = f"Fotos/FotosCanciones/{id_cancion}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=image_filename, Body=image_data, ContentType='image/jpeg')

    if track:
        track_data = track.read()
        song_filename = f"Canciones/{id_cancion}.mp3"
        s3.put_object(Bucket=BUCKET_NAME, Key=song_filename, Body=track_data, ContentType='audio/mpeg')

    # Execute the stored procedure to update the song record
    conn = db.engine.connect()
    params = {
        'p_idCancion': int(id_cancion),
        'p_Nombre': nombre,
        'p_Foto': image_filename if file else None,  # or keep the old value if not updated
        'p_Duracion': duracion,
        'p_mp3': song_filename if track else None,  # or keep the old value if not updated
        'p_Artista_idArtista': int(id_artista)
    }

    procedure_call = text(
        "CALL ActualizarCancion(:p_idCancion, :p_Nombre, :p_Foto, :p_Duracion, :p_mp3, :p_Artista_idArtista)")
    with conn.begin():
        conn.execute(procedure_call, params)

    conn.close()

    return jsonify({"mensaje": "Song updated successfully"}), 200

@song_blueprint.route('/borrarcancion', methods=['POST'])
def delete_song():
    from models.DBTables import Cancion, Usuario, db
    id_cancion = request.json.get('Idcancion')
    conn = db.engine.connect()
    params = {
        'p_idCancion': int(id_cancion)
    }
    procedure_call = text("CALL BorrarCancionPorId(:p_idCancion)")
    with conn.begin():
        conn.execute(procedure_call, params)
    conn.close()
    return jsonify({"mensaje": "Cancion eliminada!"}), 200


@song_blueprint.route('/detalle', methods=['POST'])
def detail_song():
    from models.DBTables import Cancion, Usuario, db
    id_cancion = request.json.get('Idcancion')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("GetDetalleSongId", (id_cancion,))
        result = cursor.fetchall()
        cancion = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        if not result or not result[0]:
            raise Exception('No song detail found for the given Idcancion')

        return jsonify(cancion[0]), 200

    except Exception as e:
        print(f"Error al obtener la cancion: {e}")
        return jsonify({"mensaje": "Cancion no obtenida!"}), 400

    finally:
        cursor.close()
        conn.commit()
        conn.close()


@song_blueprint.route('/artistasescuchados', methods=['POST'])
def most_played_artists():
    from models.DBTables import Cancion, Usuario, db
    id_user = request.json.get('Iduser')

    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("GetTopArtistasPorUsuario", (id_user,))
        result = cursor.fetchall()
        artistas = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        if not result:
            raise Exception('No artists found for the given Iduser')

        return jsonify({"artistas": artistas}), 200

    except Exception as e:
        print(f"Error al obtener el historial: {e}")
        return jsonify({"mensaje": "Error al obtener el historial"}), 400

    finally:
        cursor.close()
        conn.commit()
        conn.close()


@song_blueprint.route('/cancionesreproducidas', methods=['POST'])
def most_played_songs_all_time():
    from models.DBTables import Cancion, Usuario, db
    body = request.json
    id_user = body.get('Iduser')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc('GetHistorialCancionesReproducidasPorUsuario', (id_user,))
        result = cursor.fetchall()
        canciones = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        return jsonify({"canciones" : canciones}), 200
    except Exception as err:
        print(f"Error: {err}")
        return jsonify(mensaje='Error al obtener el historial'), 400
    finally:
        cursor.close()
        conn.close()


@song_blueprint.route('/cancionesescuchadas', methods=['POST'])
def most_played_songs():
    from models.DBTables import Cancion, Usuario, db
    id_user = request.json.get('Iduser')

    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("GetTopCancionesReproducidasPorUsuario", (id_user,))
        result = cursor.fetchall()
        canciones = [dict(zip([key[0] for key in cursor.description], row)) for row in result]

        if not result:
            raise Exception('No songs found for the given Iduser')

        return jsonify({"canciones" : canciones}), 200

    except Exception as e:
        print(f"Error al obtener el historial: {e}")
        return jsonify({"mensaje": "Error al obtener el historial"}), 400

    finally:
        cursor.close()
        conn.commit()
        conn.close()


@song_blueprint.route('/albumsescuchados', methods=['POST'])
def most_albums_played():
    from models.DBTables import Cancion, Usuario, db
    id_user = request.json.get('Iduser')

    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("GetTopAlbumesReproducidosPorUsuario", (id_user,))
        result = cursor.fetchall()
        albums = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        if not result:
            raise Exception('No albums found for the given Iduser')

        return jsonify({"albumes": albums}), 200

    except Exception as e:
        print(f"Error al obtener el historial: {e}")
        return jsonify({"mensaje": "Error al obtener el historial"}), 400

    finally:
        cursor.close()
        conn.commit()
        conn.close()


@song_blueprint.route('/reproducircancion', methods=['POST'])
def play_song():
    from models.DBTables import Cancion, Usuario, db
    id_user = request.json.get('Iduser')
    id_cancion = request.json.get('Idcancion')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc("InsertarRegistroHistorico", (id_user, id_cancion))
        result = cursor.fetchall()
        cancion = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        if not result or not result[0]:
            raise Exception('Error inserting into historical record')

        return jsonify(cancion[0]), 200

    except Exception as e:
        print(f"Error al insertar el historial: {e}")
        return jsonify({"mensaje": "Error al insertar el historial"}), 400

    finally:
        cursor.close()
        conn.commit()
        conn.close()


@song_blueprint.route('/canciones', methods=['GET'])
def getallSong():
    from models.DBTables import Cancion, Usuario, db

    id_user = request.args.get('Iduser')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("GetTodasLasCanciones")
        result = cursor.fetchall()
        canciones = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        if not result:
            raise Exception('Error obtaining song history')
        return jsonify({"canciones" : canciones}), 200

    except Exception as e:
        print(f"Error al obtener el historial: {e}")
        return jsonify({"mensaje": "Error al obtener el historial"}), 400

    finally:
        cursor.close()
        conn.commit()
        conn.close()