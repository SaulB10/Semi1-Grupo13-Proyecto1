from flask import Blueprint, Flask, request, jsonify, session
import boto3
from sqlalchemy.sql import text
from Config import bucket_name
from util.util import md5_hash

s3 = boto3.client('s3')


users_blueprint = Blueprint('users', __name__)


@users_blueprint.route('/login', methods=['POST'])
def login():
    from models.DBTables import Usuario
    data = request.get_json()
    # Validate that required fields are present in the request
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"mensaje": "Email and password are required"}), 400
    email = data['email']
    password = data['password']

    # Query the database for the user with the given email
    user = Usuario.query.filter_by(Correo=email).first()
    if user and md5_hash(password) == user.Password:  # Compare plain text passwords directly
        session['user_id'] = user.idUsuario
        user_details = {
            "idUsuario": user.idUsuario,
            "Nombre": user.Nombre,
            "Apellidos": user.Apellidos,
            "Foto": user.Foto,
            "Correo": user.Correo,
            "Fecha_Nacimiento": user.Fecha_Nacimiento.strftime('%Y-%m-%d')  # Convert date to string format
        }
        return jsonify(user_details), 200
    else:
        return jsonify({"mensaje": "Credenciales incorrectas"}), 401


@users_blueprint.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"mensaje": "Logged out successfully"}), 200


@users_blueprint.route('/create', methods=['POST'])
def create_user():
    from models.DBTables import Usuario, db
    if 'user_id' in session:
        return jsonify({"mensaje": "A user is already logged in."}), 403


    data = request.json
    name = data.get('nombres')
    apellidos = data.get('apellidos')
    email = data.get('correo')
    password = data.get('contraseña')
    birth_date = data.get('fechaNacimiento')
    image_data = data.get('foto')  # Get the uploaded file

    # Check if email already exists
    existing_user = Usuario.query.filter_by(Correo=email).first()
    if existing_user:
        return jsonify({"mensaje": "Email already registered."}), 400
    hashed_password = md5_hash(password)
    conn = db.engine.connect()
    params = {
        'userName': name,
        'userApellidos': apellidos,
        'userEmail': email,
        'userPassword': hashed_password,
        'userFechaNacimiento': birth_date
    }
    # Execute the stored procedure
    procedure_call = text(
        "CALL InsertUsuario(:userName, :userApellidos, :userEmail, :userPassword, :userFechaNacimiento)")
    with conn.begin():
        result = conn.execute(procedure_call, params)
        user_id = [row[0] for row in result][0]
    result.close()  # Important to close the result after fetching the data
    conn.close()
    # Upload user image to S3
    #image_data = file.read()
    image_filename = f"fotosUsuarios/{user_id}.jpg"
    response = s3.put_object(Bucket=bucket_name, Key=image_filename, Body=image_data, ContentType='image/jpeg')
    if response['ResponseMetadata']['HTTPStatusCode'] != 200:
        return jsonify({"imagen no cargada!"}), 400
    return jsonify({"mensaje": "User created successfully."}), 200


@users_blueprint.route('/edit', methods=['POST'])
def edit_user():
    from models.DBTables import Usuario, db
    data = request.get_json()
    email = data['correo']
    password = data['contraseña']
    # Query the database for the user with the given email
    user = Usuario.query.filter_by(Correo=email).first()
    if user and md5_hash(password) == user.Password:
        user_id = data.get('idUsuario')
    else:
        return jsonify({"mensaje": "Credenciales Incorrectas."}), 400

    name = data.get('nombres')
    apellidos = data.get('apellidos')
    email = data.get('correo')
    password = data.get('contraseña')
    image_data = data.get('foto')
    hashed_password = md5_hash(password)

    # Check if email has been changed and if new email already exists
    user = Usuario.query.get(user_id)
    if user.Correo != email:
        existing_user = Usuario.query.filter_by(Correo=email).first()
        if existing_user:
            return jsonify({"mensaje": "The new email is already registered with another user."}), 400

    # Update user details in the database
    user.Nombre = name
    user.Apellidos = apellidos
    user.Correo = email
    user.Password = hashed_password
    db.session.commit()

    # Upload new user image to S3 if provided
    image_filename = f"fotosUsuarios/{user_id}.jpg"
    s3.put_object(Bucket=bucket_name, Key=image_filename, Body=image_data, ContentType='image/jpeg')
    return jsonify({"mensaje": "User details updated successfully."}), 200
