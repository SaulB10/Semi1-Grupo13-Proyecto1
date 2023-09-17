const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config');
const { error } = require('console');
var arrayDeObjetos = [];
const createPlaylist = (req , res)=>{
    const {Nombre ,Descripcion,foto,Iduser} = req.body
    var idPlaylist;
    //console.log(req.file);
   db.query('CALL InsertarPlaylist(?,?,?)', [Nombre,Descripcion,Iduser], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Playlist no registrada!' });
        }
        idPlaylist = result[0][0].InsertedID
        console.log('Nuevo album insertado. ID:', result[0][0].InsertedID);
        // Uso de la función
        uploadPhoto("Fotos/Playlists/" + idPlaylist + ".jpg",foto)
        .then(result => {
        console.log("Resultado de la subida:", result);
        return res.status(200).json({ mensaje: 'Playlist agregada!' });
            
            
        })
        .catch(error => {
        console.error("Error en la función uploadPhoto:", error);
        return res.status(400).json({ mensaje: 'imagen no cargada!' });
        });
  
        
    });

}

const editPlaylist = (req , res)=>{
    const {Idplaylist,Nombre ,Descripcion,foto} = req.body
    // nombre de la foto
    const urlImage = "Fotos/Playlists/" + Idplaylist + ".jpg";
    
    if (foto === "" || foto === null) {
        //console.log("FOTOOO vacia")
  
    }else{
        //viene foto, hay que cambiarla
        // Uso de la función
        uploadPhoto(urlImage,foto)
        .then(result => {
        console.log("Resultado de la subida:", result);
        //return res.status(200).json({ mensaje: 'Artista registrado!' });
        })
        .catch(error => {
        console.error("Error en la función uploadPhoto:", error);
        //return res.status(400).json({ mensaje: 'imagen no cargada!' });
        });
    }
    
    db.query('CALL EditarPlaylist(?,?,?)', [Idplaylist,Nombre,Descripcion], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Playlist no actualizada!' });
        }
  
        // Send the success response
        res.status(200).json({ mensaje: 'Playlist actualizada!' });
      });
    }

    const deletePlaylist = (req , res) =>{
        const {Idplaylist} = req.body
        //delete en BD
        db.query('CALL EliminarPlaylist(?)', [Idplaylist], (err, result) => {
            if (err) {
              console.error('Error al eliminar la playlist', err);
              res.status(400).json({ mensaje: 'Playlist no eliminada!' });
              return;
            }
          
            //console.log('Resultadoo: ', result);
            
            res.status(200).json({ mensaje: 'Playlist eliminada!' });
            
            
          });
          //--------------------------------------------
      }

      const addSongToPlaylist = (req , res) =>{
        const {Idplaylist,Idcancion} = req.body
        //delete en BD
        db.query('CALL AgregarCancionAPlaylist(?,?)', [Idplaylist,Idcancion], (err, result) => {
          if (err) {
            console.error('Error al agregar cancion', err);
            res.status(400).json({ mensaje: 'Cancion no insertada a playlist!' });
            return;
          }
        
         //console.log('Resultadoo: ', result[0][0].Result);
      
          if (result[0][0].Result == 1) {
            //success
            res.status(200).json({ mensaje: 'Cancion insertada a playlist!' });
          }else if (result[0][0].Result == 2){
            // la cancion ya existe
            res.status(200).json({ mensaje: 'La cancion ya se encuentra en la playlist!' });
          }else if(result[0][0].Result == 0){
            //error
            res.status(400).json({ mensaje: 'Cancion no insertada a playlist!' });
          }
          
          
          
          
          
        });
        //--------------------------------------------
      
      }

      const deletePlaylistSong = (req , res) =>{
        const {Idplaylist,Idcancion} = req.body
        //delete en BD
        db.query('CALL BorrarCancionDePlaylist(?,?)', [Idplaylist,Idcancion], (err, result) => {
          if (err) {
            console.error('Error al eliminar cancion de la playlist', err);
            res.status(400).json({ mensaje: 'Cancion no eliminada de la playlist!' });
            return;
          }
        
          //console.log('Resultadoo: ', result);
          
          res.status(200).json({ mensaje: 'Cancion eliminada de la playlist!' });
          
          
        });
        //--------------------------------------------
      }

      const GetAllPlaylists = (req , res)=>{
        //obtener los albumes, solo la info
        const {Iduser} = req.body;
        db.query('CALL GetPlaylists(?)',[Iduser], (err, result) => {
          if (err) {
            console.error('Error al obtener playlists', err);
            res.status(400).json({ mensaje: 'Playlists no obtenidas!' });
            return;
          }
        
          //console.log('Resultadoo: ', result[0]);
          res.status(200).json({ playlists:result[0]});
          
          
        });
      }

      const GetAllPlaylistsWithSongs = async (req, res) => {
        const {Iduser} = req.body;
        try {
          // Primero obtenemos los ID de los álbumes
          const playlists = await new Promise((resolve, reject) => {
            db.query('CALL GetPlaylists(?)',[Iduser], (err, result) => {
              if (err) {
                console.error('Error al obtener playlists', err);
                reject(err);
              } else {
                resolve(result[0]);
              }
            });
          });
      
          // Luego, para cada álbum, obtenemos las canciones y agregamos la propiedad "canciones"
          for (const playlist of playlists) {
            const canciones = await new Promise((resolve, reject) => {
              db.query('CALL GetCancionesPorPlaylist(?)', [playlist.idPlaylist], (err, result) => {
                if (err) {
                  console.error('Error al obtener canciones', err);
                  reject(err);
                } else {
                  resolve(result[0]);
                }
              });
            });
      
            playlist.canciones = canciones;
          }
      
          //console.log(albumes);
          res.status(200).json(playlists);
        } catch (err) {
          res.status(500).json({ mensaje: 'Error al obtener datos', error: err.message });
        }
      };

      const GetDetailPlaylist = async (req, res) => {
        try {
          const { Idplaylist} = req.body;
      
          // Primero obtenemos los datos del álbum
          const playlist = await new Promise((resolve, reject) => {
            db.query('CALL GetPlaylistPorId(?)', [Idplaylist], (err, result) => {
              if (err) {
                console.error('Error al obtener playlist', err);
                reject(err);
              } else {
                resolve(result[0][0]); // Obtenemos el primer resultado del conjunto
              }
            });
          });
      
          // Luego, obtenemos las canciones y agregamos la propiedad "canciones"
          const canciones = await new Promise((resolve, reject) => {
            db.query('CALL GetCancionesPorPlaylistId(?)', [Idplaylist], (err, result) => {
              if (err) {
                console.error('Error al obtener canciones', err);
                reject(err);
              } else {
                resolve(result[0]);
              }
            });
          });
      
          playlist.canciones = canciones;
      
          res.status(200).json(playlist);
        } catch (err) {
          res.status(500).json({ mensaje: 'Error al obtener datos', error: err.message });
        }
      };
      

  
const uploadPhoto = (url,Foto) => {
    return new Promise((resolve, reject) => {
      const urlImage = url;
        console.log("URL",url)
      aws.config.update(configS3);
      const s3 = new aws.S3();
      const bufferImage = Buffer.from(Foto, 'base64');
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: urlImage,
        Body: bufferImage,
        ContentType: 'image'
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error al subir la imagen:", err);
          resolve(false); // Devuelve false en caso de error
        } else {
          console.log("IMAGEN SUBIDA!!");
          resolve(true); // Devuelve true si se subió correctamente
        }
      });
    });
};

module.exports = {createPlaylist,editPlaylist,deletePlaylist,
addSongToPlaylist,deletePlaylistSong,GetAllPlaylists,GetAllPlaylistsWithSongs,
GetDetailPlaylist}