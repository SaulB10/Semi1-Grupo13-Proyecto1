import base64
from util.util import md5_hash
from flask import Blueprint, Flask, request, jsonify, session
import boto3
from sqlalchemy.sql import text
from Config import bucket_name

s3 = boto3.client('s3')

# Creas un Blueprint para artistas
artist_blueprint = Blueprint('artist', __name__)


@artist_blueprint.route('/create', methods=['POST'])
def create_artist():
    from models.DBTables import Artista, db
    # Check if user is an admin (user_id is 1)
    data = request.get_json()
    nombre = data.get('Nombre')
    fecha_nacimiento = data.get('FechaNacimiento')
    image_data = data.get('Foto')  # Assuming the input name is "Foto"

    # Create the artist without the Fotografia field first to get the ID
    new_artist = Artista(
        Nombre=nombre,
        Fecha_Nacimiento=fecha_nacimiento
    )
    db.session.add(new_artist)
    db.session.commit()
    artist_id = new_artist.idArtista
    # Set up S3 path based on this ID
    # Upload user image to S3
    image_filename = f"fotosArtistas/{artist_id}.jpg"
    s3.put_object(Bucket=bucket_name, Key=image_filename, Body=image_data, ContentType='image/jpeg')
    new_artist.Fotografia = image_filename
    db.session.commit()

    return jsonify({"mensaje": "Artist created successfully."}), 200


@artist_blueprint.route('/get', methods=['POST'])
def get_artist_by_id():
    from models.DBTables import Artista, db
    data = request.get_json()

    # Get artist ID from request payload
    artist_id = data.get('idArtista')

    # Fetch artist details using the provided ID
    artist = Artista.query.filter_by(idArtista=artist_id).first()

    # If artist not found, return an error mensaje
    if not artist:
        return jsonify({"mensaje": "Artist not found."}), 404
    artist_details = {
        "idArtista": artist.idArtista,
        "Nombre": artist.Nombre,
        "Fotografia": artist.Fotografia,
        "Fecha_Nacimiento": artist.Fecha_Nacimiento.strftime('%Y-%m-%d')  # Convert date to string format
    }
    return jsonify(artist_details), 200


@artist_blueprint.route('/edit', methods=['POST'])
def edit_artist():
    from models.DBTables import Artista, db
    data = request.get_json()
    artist_id = data.get('idArtista')
    artist = Artista.query.get(artist_id)

    if not artist:
        return jsonify({"mensaje": "Artist not found."}), 400

    # Update the artist's name and birthdate if provided
    nombre = data.get('Nombre')
    if nombre:
        artist.Nombre = nombre

    fecha_nacimiento = data.get('FechaNacimiento')
    if fecha_nacimiento:
        artist.Fecha_Nacimiento = fecha_nacimiento

    # If a photo is provided, update it on S3
    image_data = data.get('Foto')
    if image_data:
        image_filename = f"fotosArtistas/{artist_id}.jpg"
        s3.put_object(Bucket=bucket_name, Key=image_filename, Body=image_data, ContentType='image/jpeg')

    db.session.commit()

    return jsonify({"mensaje": "Artist updated successfully."}), 200


@artist_blueprint.route('/delete', methods=['DELETE'])
def delete_artist():
    from models.DBTables import Artista, Usuario,  db
    data = request.get_json()
    artist_id = int(data.get('idArtista'))
    password = data.get('password')

    if not artist_id or not password:
        return jsonify({"mensaje": "Missing required fields"}), 400

    hashed_password = md5_hash(password)
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
    artist = Artista.query.filter_by(idArtista=artist_id).first()
    if not artist:
        return jsonify({"mensaje": "Artist not found."}), 400
    artist_image_path = artist.Fotografia
    # First, let's fetch the Fotografia field (path to S3 image) before deleting
    # artist_image_path_query = db.session.execute(f"SELECT Fotografia FROM Artista WHERE idArtista = {artist_id}").first()

    if not artist_image_path:
        return jsonify({"mensaje": "Artist not found."}), 404

    # Call the stored procedure
    conn = db.engine.connect()
    procedure_call = text("CALL DeleteArtistaByID(:artistID)")
    params = {'artistID': artist_id}
    with conn.begin():
        conn.execute(procedure_call, params)
    conn.close()

    # Remove the artist's photo from S3 if exists
    if artist_image_path:
        s3.delete_object(Bucket=bucket_name, Key=artist_image_path)

    return jsonify({"mensaje": "Artist deleted successfully."}), 200


@artist_blueprint.route('/artista', methods=['GET'])
def get_all_artists():
    from models.DBTables import Artista, db

    conn = db.engine.connect()
    # Execute the stored procedure
    procedure_call = text("CALL GetAllArtists()")
    with conn.begin():
        result = conn.execute(procedure_call)
        # Fetch all artists and convert result to list of dictionaries
        #artists = [{"Idartista": row[0], "Nombre": row[1], "Foto": fetch_s3_image(row[2]), "Fechanac": row[3]}
        #           for row in result]
        artists = [{"Idartista": row[0], "Nombre": row[1], "Foto": row[2], "Fechanac": row[3]}
                   for row in result]
    result.close()  # Important to close the result after fetching the data
    conn.close()
    return jsonify({"artistas": artists}), 200


def fetch_s3_image(path):
    print(path)
    try:
        response = s3.get_object(Bucket=bucket_name, Key=path)
        image_data = response['Body'].read()
        # Convert the image bytes to a base64 encoded string
        base64_encoded_image = base64.b64encode(image_data).decode('utf-8')
        return base64_encoded_image
    except Exception as e:
        print(f"Error fetching image from S3: {e}")
        return None
