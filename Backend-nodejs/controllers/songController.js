const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config');
const { error } = require('console');

const createSong = (req,res)=>{

    const {Nombre,Foto,duracion,artista, Idartista,archivo}= req.body
    var idCancion;
    //console.log(req.file);
   db.query('CALL InsertarCancion(?,?,?)', [Nombre,duracion,Idartista], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Cancion no registrada!' });
        }
        idCancion = result[0][0].InsertedID
        console.log('Nueva cancion insertada. ID:', result[0][0].InsertedID);
        // Uso de la función
        uploadPhoto("Fotos/Canciones/" + idCancion + ".jpg",Foto)
        .then(result => {
        console.log("Resultado de la subida:", result);
        //return res.status(200).json({ mensaje: 'Artista registrado!' });
            uploadSong("Canciones/"+ idCancion + ".mp3",req.file)
            .then(result =>{
                console.log("Resultado de la subida:", result);
                return res.status(200).json({ mensaje: 'Cancion registrada!' });
            })
            .catch(error =>{
                console.error("Error en la función uploadSong:", error);
                return res.status(400).json({ mensaje: 'Cancion no cargada!' });
        
            })
            
        })
        .catch(error => {
        console.error("Error en la función uploadPhoto:", error);
        return res.status(400).json({ mensaje: 'imagen no cargada!' });
        });
  
        
    });



   


}

const editSong = (req,res)=>{
    const {Idcancion,Nombre,Foto,duracion,artista, Idartista,archivo}= req.body
    // nombre de la foto
    const urlImage = "Fotos/Canciones/" + Idcancion + ".jpg";
    const urlMp3 = "Canciones/"+ Idcancion + ".mp3";
    
    if (Foto === "" || Foto === null) {
        //console.log("FOTOOO vacia")

    }else{
        //viene foto, hay que cambiarla
        // Uso de la función
        uploadPhoto(urlImage,Foto)
        .then(result => {
        console.log("Resultado de la subida:", result);
        //return res.status(200).json({ mensaje: 'Artista registrado!' });
        })
        .catch(error => {
        console.error("Error en la función uploadPhoto:", error);
        //return res.status(400).json({ mensaje: 'imagen no cargada!' });
        });
    }
    if (req.file) {
        //lleva 
        uploadSong(urlMp3,req.file)
            .then(result =>{
                console.log("Resultado de la subida:", result);
                //return res.status(200).json({ mensaje: 'Cancion registrada!' });
            })
            .catch(error =>{
                console.error("Error en la función uploadSong:", error);
                //return res.status(400).json({ mensaje: 'Cancion no cargada!' });
        
            })
    }else{
        //no viene cancion
        
    }
    db.query('CALL ActualizarCancion(?,?,?,?,?,?)', [Idcancion,Nombre,urlImage,duracion,urlMp3,Idartista], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Cancion no actualizada!' });
        }
  
        // Send the success response
        res.status(200).json({ mensaje: 'Cancion actualizada!' });
      });
}

const deleteSong = (req,res) =>{
    const {Idcancion} = req.body;
    //delete en BD
    db.query('CALL BorrarCancionPorId(?)', [Idcancion], (err, result) => {
        if (err) {
          console.error('Error al eliminar la cancion', err);
          res.status(400).json({ mensaje: 'Cancion no eliminada!' });
          return;
        }
      
        //console.log('Resultadoo: ', result);
        
        res.status(200).json({ mensaje: 'Cancion eliminada!' });
        
        
      });
      //--------------------------------------------
}

const detailSong = (req , res)=>{
  const {Idcancion} = req.body
  db.query('CALL GetDetalleSongId(?)', [Idcancion], (err, result) => {
    if (err) {
      console.error('Error al obtener la cancion', err);
      res.status(400).json({ mensaje: 'Cancion no obtenida!' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json( result[0][0] );
    
    
  });
}

const playSong = (req , res) =>{
  const {Iduser,Idcancion} = req.body
  db.query('CALL InsertarRegistroHistorico(?,?)', [Iduser,Idcancion], (err, result) => {
    if (err) {
      console.error('Error al insertar el historial', err);
      res.status(400).json({ mensaje: 'Error al insertar el historial' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json(result[0][0]);
    
    
  });
}

const mostPlayedArtists = (req , res) =>{
  const {Iduser} = req.body
  db.query('CALL GetTopArtistasPorUsuario(?)', [Iduser], (err, result) => {
    if (err) {
      console.error('Error al obtener el historial', err);
      res.status(400).json({ mensaje: 'Error al obtener el historial' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({artistas : result[0]});
    
    
  });
}

const mostPlayedSongs = (req , res) =>{
  const {Iduser} = req.body
  db.query('CALL GetTopCancionesReproducidasPorUsuario(?)', [Iduser], (err, result) => {
    if (err) {
      console.error('Error al obtener el historial', err);
      res.status(400).json({ mensaje: 'Error al obtener el historial' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({canciones : result[0]});
    
    
  });
}
const mostAlbumsPlayed = (req , res) =>{
  const {Iduser} = req.body
  db.query('CALL GetTopAlbumesReproducidosPorUsuario(?)', [Iduser], (err, result) => {
    if (err) {
      console.error('Error al obtener el historial', err);
      res.status(400).json({ mensaje: 'Error al obtener el historial' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({albumes : result[0]});
    
    
  });
}
const mostPlayedSongsAllTime = (req , res) =>{
  const {Iduser} = req.body
  db.query('CALL GetHistorialCancionesReproducidasPorUsuario(?)', [Iduser], (err, result) => {
    if (err) {
      console.error('Error al obtener el historial', err);
      res.status(400).json({ mensaje: 'Error al obtener el historial' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({canciones : result[0]});
    
    
  });
}

const getAllSongs = (req , res) =>{
  db.query('CALL GetTodasLasCanciones()', (err, result) => {
    if (err) {
      console.error('Error al obtener las canciones', err);
      res.status(400).json({ mensaje: 'Error al obtener las canciones' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({canciones : result[0]});
    
    
  });
}

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

const uploadSong = (url, mp3) =>{

    return new Promise((resolve, reject) => {
        aws.config.update(configS3);
      const s3 = new aws.S3();
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: url,
        Body: mp3.buffer,
        ContentType: 'audio/mpeg'
      };
  
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error al subir la cancion:", err);
          resolve(false); // Devuelve false en caso de error
        } else {
          console.log("cancion SUBIDA!!");
          resolve(true); // Devuelve true si se subió correctamente
        }
      });
    });
  
}

module.exports = {createSong,editSong,deleteSong,detailSong,playSong,
  mostPlayedArtists,mostPlayedSongs,mostAlbumsPlayed,mostPlayedSongsAllTime
,getAllSongs}