from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import secrets
from routes import UserRoute, ArtistRoute, AlbumRoute, FavoritesRoute, PlaylistRoute, SearchRoute, SongRoute
import boto3
from models.DBTables import init_app
from Config import bucket_name

s3 = boto3.client('s3')

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)
# Assuming you are using MySQL on RDS, your connection string would look like this:
app.config[
    'SQLALCHEMY_DATABASE_URI'] = 'mysql://admin:Usac2s2023@database-1.cp3za1qipyxl.us-east-2.rds.amazonaws.com/semi1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)  # Initialize the SQLAlchemy instance with your Flask app
# Initialize models with db
init_app(db)

app.register_blueprint(UserRoute.users_blueprint, url_prefix='/users')
app.register_blueprint(ArtistRoute.artist_blueprint, url_prefix='/artist')
app.register_blueprint(AlbumRoute.album_blueprint, url_prefix='/album')
app.register_blueprint(FavoritesRoute.favorite_blueprint, url_prefix='/favorite')
app.register_blueprint(PlaylistRoute.playlist_blueprint, url_prefix='/playlist')
app.register_blueprint(SearchRoute.search_blueprint, url_prefix='/search')
app.register_blueprint(SongRoute.song_blueprint, url_prefix='/song')


@app.route('/test', methods=['GET'])
def test():
    return jsonify({"test": "test"})


@app.route('/getS3Content', methods=['GET'])
def list_s3_keys():
    keys = []

    prefixes = [
        'fotos/',
        'FotosUsuario/',
        'Fotos/Albumes/',
        'Canciones/',
        'Fotos/FotosCanciones/',
        'fotosArtistas/'
    ]

    for prefix in prefixes:
        objects = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

        # For the first prefix we're interested in the 'CommonPrefixes'
        if prefix == 'fotos/':
            keys.extend([folder['Prefix'] for folder in objects.get('CommonPrefixes', [])])
        else:
            keys.extend([obj['Key'] for obj in objects.get('Contents', [])])

    return jsonify(keys)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
