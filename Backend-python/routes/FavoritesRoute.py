import base64

from flask import Blueprint, Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import boto3
from sqlalchemy.sql import text
from Config import bucket_name

s3 = boto3.client('s3')

favorite_blueprint = Blueprint('favorite', __name__)


@favorite_blueprint.route('/darfavorito', methods=['POST'])
def create_favorite():
    from models.DBTables import Album, Usuario, db
    id_user = request.json.get('Iduser')
    id_cancion = request.json.get('Idcancion')
    conn = db.engine.raw_connection()
    try:
        # First, get the album details using the first cursor
        cursor = conn.cursor()
        cursor.callproc("AgregarFavorito", (id_user, id_cancion,))
        cursor.close()
        return jsonify({"mensaje": "Favorito agregado!"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener datos", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()


@favorite_blueprint.route('/quitarfavorito', methods=['POST'])
def remove_favorite():
    from models.DBTables import Album, Usuario, db
    id_user = request.json.get('Iduser')
    id_cancion = request.json.get('Idcancion')
    conn = db.engine.raw_connection()
    try:
        # First, get the album details using the first cursor
        cursor = conn.cursor()
        cursor.callproc("EliminarFavorito", (id_user, id_cancion,))
        cursor.close()
        return jsonify({"mensaje": "Favorito removido!"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al agregar favorito!", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()


@favorite_blueprint.route('/favoritos', methods=['POST'])
def get_favorites():
    from models.DBTables import Album, Usuario, db
    id_user = request.json.get('Iduser')
    conn = db.engine.raw_connection()
    try:
        # First, get the album details using the first cursor
        cursor = conn.cursor()
        cursor.callproc("ListarFavoritosPorUsuario", (id_user,))
        result = cursor.fetchall()
        canciones = [dict(zip([key[0] for key in cursor.description], row)) for row in result]
        cursor.close()
        return jsonify({"canciones" : canciones}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener favoritos!", "error": str(e)}), 400
    finally:
        conn.commit()
        conn.close()


