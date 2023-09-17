const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config')

const createArtist = (req, res) => {
    const { Nombre, Foto, FechaNacimiento } = req.body;
    var idArtista;
    db.query('CALL InsertArtista(?,?)', [Nombre,FechaNacimiento], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Artista no registrado!' });
        }
        idArtista = result[0][0].InsertedID
        console.log('Nuevo usuario insertado. ID:', result[0][0].InsertedID);
        // Uso de la función
        uploadPhoto("fotosArtistas/" + idArtista + ".jpg",Foto)
        .then(result => {
        console.log("Resultado de la subida:", result);
        return res.status(200).json({ mensaje: 'Artista registrado!' });
        })
        .catch(error => {
        console.error("Error en la función uploadPhoto:", error);
        return res.status(400).json({ mensaje: 'imagen no cargada!' });
        });
  
        
    });

    
    
  };

const getArtist = (req , res)=>{
    const {idArtista} = req.body;
    //obtener data
    db.query('CALL GetArtistaByID(?)', [idArtista], (err, results) => {
        if (err) {
          console.error('Error al obtener los datos del artista:', err);
          return;
        }
      
        console.log(results[0][0]);
        var objeto = results[0][0];
        if (objeto !== undefined) {

            const fechaOriginal = results[0][0].Fecha_Nacimiento;
            const fecha = new Date(fechaOriginal);

            const fechaFormateada = fecha.toISOString().substring(0, 10);
            //console.log(fechaFormateada); 
            objeto.Fecha_Nacimiento = fechaFormateada
            res.status(200).json(objeto);
        }else{
          res.status(400).json({ mensaje: 'No existe el artista!' });
        }
        
      });
     //------------------------------
}

const editArtist = (req , res) =>{
    const { idArtista,Nombre, Foto, FechaNacimiento } = req.body;
    // nombre de la foto
    const urlImage = "fotosArtistas/" + idArtista + ".jpg";
    
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
    db.query('CALL UpdateArtistaByID(?,?,?,?)', [idArtista,Nombre,urlImage,FechaNacimiento], (err, result) => {
        if (err) {
          return res.status(400).json({ mensaje: 'Artista no actualizado!' });
        }
  
        // Send the success response
        res.status(200).json({ mensaje: 'Artista actualizado!' });
      });
    
}

const deleteArtist = (req , res) => {
    const {idArtista,password} = req.body;
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
          //update en BD
          db.query('CALL DeleteArtistaByID(?)', [idArtista], (err, result) => {
            if (err) {
              console.error('Error al eliminar el artista', err);
              res.status(400).json({ mensaje: 'Artista no eliminado!' });
              return;
            }
          
            //console.log('Resultadoo: ', result);
            
            res.status(200).json({ mensaje: 'Artista eliminado!' });
            
            
          });
          //--------------------------------------------
        }else{
          res.status(400).json({ mensaje: 'Credenciales incorrectas!' });
        }
        
      });
}

const getAllArtists = (req , res) =>{

  db.query('CALL GetAllArtists()', (err, result) => {
    if (err) {
      console.error('Error al eliminar el artista', err);
      res.status(400).json({ mensaje: 'Artista no eliminado!' });
      return;
    }
  
    //console.log('Resultadoo: ', result);
    
    res.status(200).json({ artistas: result[0]});
    
    
  });
  //--------------------------------------------
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
  
  
  
  

module.exports = {
    createArtist,
    getArtist,
    editArtist,
    deleteArtist,
    getAllArtists
}