import base64

from flask import Blueprint, Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import boto3
from sqlalchemy.sql import text
from Config import bucket_name

s3 = boto3.client('s3')


search_blueprint = Blueprint('search', __name__, url_prefix='/search')



@search_blueprint.route('/buscarcancion', methods=['POST'])
def search_songs():
    from models.DBTables import Album, Usuario, db
    entrada = request.json.get('entrada')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc('BuscarCancionesPorNombreOArtista', (entrada,))
        canciones_ = cursor.fetchall()
        canciones = [dict(zip([key[0] for key in cursor.description], row)) for row in canciones_]
        cursor.close()
        return jsonify({"canciones" :canciones}), 200
    except Exception as e:
        print(f"Error al buscar: {e}")
        return jsonify({"mensaje": "Busqueda fallida!", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()


@search_blueprint.route('/buscaralbum', methods=['POST'])
def search_albums():
    from models.DBTables import Album, Usuario, db
    entrada = request.json.get('entrada')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()
    try:
        cursor.callproc('BuscarAlbumesPorNombreOArtista', (entrada,))
        albumes_ = cursor.fetchall()
        albumes = [dict(zip([key[0] for key in cursor.description], row)) for row in albumes_]
        cursor.close()
        for album in albumes:
            cursor2 = conn.cursor()
            cursor2.callproc('GetCancionesPorAlbum', (album['IdAlbum'],))
            canciones_ = cursor2.fetchall()
            canciones = [dict(zip([key[0] for key in cursor2.description], row)) for row in canciones_]
            cursor2.close()
            album['canciones'] = canciones
        return jsonify(albumes), 200
    except Exception as e:
        return jsonify({"mensaje": "Error al obtener datos", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()


@search_blueprint.route('/buscarartista', methods=['POST'])
def search_artists():
    from models.DBTables import Album, Usuario, db
    entrada = request.json.get('entrada')
    conn = db.engine.raw_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc('BuscarArtistas', (entrada,))
        artistas_ = cursor.fetchall()
        artistas = [dict(zip([key[0] for key in cursor.description], row)) for row in artistas_]
        cursor.close()
        for artista in artistas:
            cursor2 = conn.cursor()
            cursor2.callproc('GetCancionesPorArtista', (artista['idArtista'],))
            canciones_ = cursor2.fetchall()
            canciones = [dict(zip([key[0] for key in cursor2.description], row)) for row in canciones_]
            cursor2.close()
            artista['canciones'] = canciones
        return jsonify(artistas), 200
    except Exception as e:
        print(f"Error al obtener datos: {e}")
        return jsonify({"mensaje": "Error al obtener datos", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()