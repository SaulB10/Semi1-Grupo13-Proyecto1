import base64

from flask import Blueprint, Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import boto3
from sqlalchemy.sql import text
from Config import bucket_name

s3 = boto3.client('s3')


playlist_blueprint = Blueprint('playlist', __name__, url_prefix='/playlist')


@playlist_blueprint.route('/crearplaylist', methods=['POST'])
def create_playlist():
    from models.DBTables import Album, db
    nombre = request.json.get('Nombre')
    descripcion = request.json.get('Descripcion')
    image_data = request.json.get('foto')
    iduser = request.json.get('Iduser')
    if not nombre or not descripcion or not image_data or not iduser:
        return jsonify({"mensaje": "Missing required fields"}), 400
    conn = db.engine.connect()
    params = {
        'p_Nombre': nombre,
        'p_Descripcion': descripcion,
        'p_Usuario_idUsuario': int(iduser)
    }
    procedure_call = text('CALL InsertarPlaylist(:p_Nombre, :p_Descripcion, :p_Usuario_idUsuario)')
    with conn.begin():
        result = conn.execute(procedure_call, params)
        playlist_id = [row[0] for row in result][0]
    result.close()
    conn.close()
    if image_data:
        image_filename = f"Fotos/Playlists/{playlist_id}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=image_filename, Body=image_data, ContentType='image/jpeg')
    return jsonify({"mensaje": "Playlist created successfully."}), 200


@playlist_blueprint.route('/editarplaylist', methods=['POST'])
def edit_playlist():
    from models.DBTables import Album, db
    idplaylist = request.json.get('Idplaylist')
    nombre = request.json.get('Nombre')
    descripcion = request.json.get('Descripcion')
    image_data = request.json.get('foto')

    if not nombre or not descripcion or not idplaylist:
        return jsonify({"mensaje": "Missing required fields"}), 400
    conn = db.engine.connect()
    params = {
        'p_idPlaylist': int(idplaylist),
        'p_Nombre': nombre,
        'p_Descripcion': descripcion
    }
    # Execute the stored procedure
    procedure_call = text("CALL EditarPlaylist(:p_idPlaylist, :p_Nombre, :p_Descripcion)")
    with conn.begin():
        conn.execute(procedure_call, params)
    conn.close()
    if image_data:
        image_filename = f"Fotos/Playlists/{idplaylist}.jpg"
        s3.put_object(Bucket=BUCKET_NAME, Key=image_filename, Body=image_data, ContentType='image/jpeg')
    return jsonify({"mensaje": "Playlist actualizada!"}), 200


@playlist_blueprint.route('/borrarplaylist', methods=['POST'])
def delete_playlist():
    from models.DBTables import Album, db
    idplaylist = request.json.get('Idplaylist')
    conn = db.engine.connect()
    params = {
        'p_idPlaylist': int(idplaylist)
    }
    procedure_call = text("CALL EliminarPlaylist(:p_idPlaylist)")
    with conn.begin():
        conn.execute(procedure_call, params)
    conn.close()
    return jsonify({"mensaje": "Playlist eliminada!"}), 200


@playlist_blueprint.route('/agregarcancionplaylist', methods=['POST'])
def add_song_to_playlist():
    from models.DBTables import Album, db
    idplaylist = request.json.get('Idplaylist')
    idcancion = request.json.get('Idcancion')

    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("AgregarCancionAPlaylist", (idplaylist, idcancion))
        result = cursor.fetchone()
        result_value = int(result[0])

        if result_value == 1:
            return jsonify({"mensaje": "Cancion insertada a playlist!"}), 200
        elif result_value == 2:
            return jsonify({"mensaje": "La cancion ya se encuentra en la playlist!"}), 200
        elif result_value == 0:
            return jsonify({"mensaje": "Cancion no insertada a playlist!"}), 400

    except Exception as e:
        print(f"Error al agregar cancion: {e}")
        return jsonify({"mensaje": "Cancion no insertada a playlist!", "error": str(e)}), 400
    finally:
        cursor.close()
        conn.commit()
        conn.close()


@playlist_blueprint.route('/eliminacancionplaylist', methods=['POST'])
def delete_playlist_song():
    from models.DBTables import Album, db
    idplaylist = request.json.get('Idplaylist')
    idcancion = request.json.get('Idcancion')

    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc("BorrarCancionDePlaylist", (idplaylist, idcancion))
        return jsonify({"mensaje": "Cancion eliminada de la playlist!"}), 200

    except Exception as e:
        print(f"Error al eliminar cancion de la playlist: {e}")
        return jsonify({"mensaje": "Cancion no eliminada de la playlist!", "error": str(e)}), 400
    finally:
        cursor.close()
        conn.commit()
        conn.close()


@playlist_blueprint.route('/listadoplaylist', methods=['POST'])
def get_all_playlists():
    from models.DBTables import Album, db
    id_user = request.json.get('Iduser')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc('GetPlaylists', (id_user,))
        result = cursor.fetchall()
        lists = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        return jsonify({"playlists" : lists}), 200
    except Exception as e:
        print(f"Error al obtener playlists: {e}")
        return jsonify({"mensaje": "Playlists no obtenidas!", "error": str(e)}), 400
    finally:
        cursor.close()
        conn.commit()
        conn.close()

@playlist_blueprint.route('/listadoplaylistuser', methods=['POST'])
def get_all_playlists_with_songs():
    from models.DBTables import Album, db
    id_user = request.json.get('Iduser')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc('GetPlaylists', (id_user, ))
        playlists_ = cursor.fetchall()
        playlists = [dict(zip([key[0] for key in cursor.description], row)) for row in playlists_]
        cursor.close()  # close the previous cursor

        for playlist in playlists:
            cursor2 = conn.cursor()
            cursor2.callproc('GetCancionesPorPlaylist', (playlist['idPlaylist'],))
            canciones_ = cursor2.fetchall()
            canciones = [dict(zip([key[0] for key in cursor2.description], row)) for row in canciones_]
            cursor2.close()
            playlist['canciones'] = canciones

        return jsonify(playlists), 200
    except Exception as e:
        print(f"Error al obtener datos: {e}")
        return jsonify({"mensaje": "Error al obtener datos", "error": str(e)}), 500
    finally:
        cursor2.close()
        conn.commit()
        conn.close()

@playlist_blueprint.route('/detalle', methods=['POST'])
def get_detail_playlist():
    from models.DBTables import Album, db
    id_playlist = request.json.get('Idplaylist')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc('GetPlaylistPorId', (id_playlist, ))
        playlist_ = cursor.fetchone()
        playlist = dict(zip([key[0] for key in cursor.description], playlist_))
        cursor.close()
        print(playlist)
        songs_cursor = conn.cursor()
        songs_cursor.callproc('GetCancionesPorPlaylistId', (id_playlist[0],))
        canciones_ = songs_cursor.fetchall()
        canciones = [dict(zip([key[0] for key in songs_cursor.description], row)) for row in canciones_]
        playlist['canciones'] = canciones
        songs_cursor.close()

        return jsonify(playlist), 200
    except Exception as e:
        print(f"Error al obtener datos: {e}")
        return jsonify({"mensaje": "Error al obtener datos", "error": str(e)}), 500
    finally:
        songs_cursor.close()
        conn.commit()
        conn.close()