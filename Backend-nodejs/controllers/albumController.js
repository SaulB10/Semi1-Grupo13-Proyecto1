const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config');
const { error } = require('console');
var arrayDeObjetos = [];
const createAlbum = (req , res)=>{
    const {Nombre ,Descripcion,Foto,Idartista,Artista} = req.body
    var idAlbum;
    //console.log(req.file);
   db.query('CALL InsertAlbum(?,?,?)', [Nombre,Descripcion,Idartista], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Album no registrado!' });
        }
        idAlbum = result[0][0].InsertedID
        console.log('Nuevo album insertado. ID:', result[0][0].InsertedID);
        // Uso de la función
        uploadPhoto("Fotos/Albumes/" + idAlbum + ".jpg",Foto)
        .then(result => {
        console.log("Resultado de la subida:", result);
        return res.status(200).json({ mensaje: 'Album agregado!' });
            
            
        })
        .catch(error => {
        console.error("Error en la función uploadPhoto:", error);
        return res.status(400).json({ mensaje: 'imagen no cargada!' });
        });
  
        
    });

}

const editAlbum = (req , res)=>{
  const { Idalbum,Nombre,Descripcion,Foto,Idartista,Artista} = req.body
  // nombre de la foto
  const urlImage = "Fotos/Albumes/" + Idalbum + ".jpg";
  
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
  
  db.query('CALL ActualizarAlbum(?,?,?)', [Idalbum,Nombre,Descripcion], (err, result) => {
      if (err) {
        return res.status(400).json({ mensaje: 'Album no actualizado!' });
      }

      // Send the success response
      res.status(200).json({ mensaje: 'Album actualizado!' });
    });
}

const deleteAlbum = (req , res) =>{
  const {Idalbum,password} = req.body
  //encriptar la contrase;a
  const encryptedPassword = crypto
  .createHash('md5')
  .update(password)
  .digest('hex');
  //--------------------------
  //verificar el password en base de datos con admin
  db.query('CALL VerificarPasswordPorID(1, ?)', [ encryptedPassword], (err, results) => {
      if (err) {
        console.error('Error al verificar credenciales:', err);
        return;
      }
    
      //console.log("res:::",results[0][0]);
      resultado = results[0][0].Resultado;
      if (resultado == 1) {
        //delete en BD
        db.query('CALL BorrarAlbum(?)', [Idalbum], (err, result) => {
          if (err) {
            console.error('Error al eliminar el album', err);
            res.status(400).json({ mensaje: 'Album no eliminado!' });
            return;
          }
        
          //console.log('Resultadoo: ', result);
          
          res.status(200).json({ mensaje: 'Album eliminado!' });
          
          
        });
        //--------------------------------------------
      }else{
        res.status(400).json({ mensaje: 'Credenciales incorrectas!' });
      }
      
    });
  
}

const addSongToAlbum = (req , res) =>{
  const {Idalbum,Idcancion} = req.body
  //delete en BD
  db.query('CALL AgregarCancionAAlbum(?,?)', [Idalbum,Idcancion], (err, result) => {
    if (err) {
      console.error('Error al agregar cancion', err);
      res.status(400).json({ mensaje: 'Cancion no insertada a album!' });
      return;
    }
  
   //console.log('Resultadoo: ', result[0][0].Result);

    if (result[0][0].Result == 1) {
      //success
      res.status(200).json({ mensaje: 'Cancion insertada a album!' });
    }else if (result[0][0].Result == 2){
      // la cancion ya existe
      res.status(200).json({ mensaje: 'La cancion ya se encuentra en el Album!' });
    }else if(result[0][0].Result == 0){
      //error
      res.status(400).json({ mensaje: 'Cancion no insertada a album!' });
    }
    
    
    
    
    
  });
  //--------------------------------------------

}
const deleteAlbumSong = (req , res) =>{
  const {Idalbum,Idcancion} = req.body
  //delete en BD
  db.query('CALL BorrarCancionDeAlbum(?,?)', [Idalbum,Idcancion], (err, result) => {
    if (err) {
      console.error('Error al eliminar cancion del album', err);
      res.status(400).json({ mensaje: 'Cancion no eliminada del album!' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({ mensaje: 'Cancion eliminada del album!' });
    
    
  });
  //--------------------------------------------
}

const GetAllAlbumsWithSongs = async (req, res) => {
  try {
    // Primero obtenemos los ID de los álbumes
    const albumes = await new Promise((resolve, reject) => {
      db.query('CALL GetAlbums()', (err, result) => {
        if (err) {
          console.error('Error al obtener álbumes', err);
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });

    // Luego, para cada álbum, obtenemos las canciones y agregamos la propiedad "canciones"
    for (const album of albumes) {
      const canciones = await new Promise((resolve, reject) => {
        db.query('CALL GetCancionesPorAlbum(?)', [album.Idalbum], (err, result) => {
          if (err) {
            console.error('Error al obtener canciones', err);
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });

      album.canciones = canciones;
    }

    //console.log(albumes);
    res.status(200).json(albumes);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener datos', error: err.message });
  }
};


const GetAllAlbums = (req , res)=>{
  //obtener los albumes, solo la info
  arrayDeObjetos = []
  db.query('CALL GetAlbums()', (err, result) => {
    if (err) {
      console.error('Error al obtener albumes', err);
      res.status(400).json({ mensaje: 'Albumes no obtenidos!' });
      return;
    }
  
    //console.log('Resultadoo: ', result[0]);
    arrayDeObjetos = result[0]
    res.status(200).json({ albums:arrayDeObjetos});
    
    
  });
}

const GetDetailAlbum = async (req, res) => {
  try {
    const { Idalbum } = req.body;

    // Primero obtenemos los datos del álbum
    const album = await new Promise((resolve, reject) => {
      db.query('CALL GetAlbumPorId(?)', [Idalbum], (err, result) => {
        if (err) {
          console.error('Error al obtener álbum', err);
          reject(err);
        } else {
          resolve(result[0][0]); // Obtenemos el primer resultado del conjunto
        }
      });
    });

    // Luego, obtenemos las canciones y agregamos la propiedad "canciones"
    const canciones = await new Promise((resolve, reject) => {
      db.query('CALL GetCancionesPorAlbumId(?)', [Idalbum], (err, result) => {
        if (err) {
          console.error('Error al obtener canciones', err);
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });

    album.canciones = canciones;

    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener datos', error: err.message });
  }
};

const GetCancionesSinAlbum = (req , res) =>{
  const {Idartista} = req.body;
  db.query('CALL GetCancionesSinAlbum(?)', [Idartista],(err, result) => {
    if (err) {
      console.error('Error al obtener las canciones sin album', err);
      res.status(400).json({ mensaje: 'Error al obtener las canciones sin album!' });
      return;
    }
  
    //console.log('Resultadoo: ', result[0]);
    res.status(200).json({ canciones:result[0]});
    
    
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

module.exports = {createAlbum, editAlbum, deleteAlbum, addSongToAlbum,deleteAlbumSong,GetAllAlbums,GetAllAlbumsWithSongs
,GetDetailAlbum,GetCancionesSinAlbum}