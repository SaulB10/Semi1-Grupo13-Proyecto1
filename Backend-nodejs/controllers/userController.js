const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config')



// userController.js

  
  const createUser = (req, res) => {

    // Lógica para crear un nuevo usuario
    const { nombres, apellidos, foto, correo, contraseña, fechaNacimiento } = req.body;

    //insertarlo en BD
    const encryptedPassword = crypto
    .createHash('md5')
    .update(contraseña)
    .digest('hex');
    
    db.query('CALL InsertUsuario(?,?,?,?,?)', [nombres,apellidos,correo,encryptedPassword,fechaNacimiento], (err, result) => {
      if (err) {
        console.error('Error al insertar nuevo usuario:', err);
        return;
      }
    
      console.log('Nuevo usuario insertado. ID:', result[0][0].InsertedID);
      // Uso de la función
      uploadPhoto("fotosUsuarios/" +result[0][0].InsertedID + ".jpg",foto)
      .then(result => {
      console.log("Resultado de la subida:", result);
      return res.status(200).json({ mensaje: 'Usuario registrado!' });
      })
      .catch(error => {
      console.error("Error en la función uploadPhoto:", error);
      return res.status(400).json({ mensaje: 'imagen no cargada!' });
      });
    });
    //--------------------------------------------
    

  };

  const login = (req, res) => {

    const { email, password } = req.body;// obtenemos del body
    // Encriptar la contraseña proporcionada en formato MD5
    const encryptedPassword = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');
    //validar en base de datos
    db.query('CALL VerificarCredenciales(?, ?)', [email, encryptedPassword], (err, results) => {
      if (err) {
        console.error('Error al verificar credenciales:', err);
        return;
      }
    
      //console.log(results[0][0]);
      var resultado = results[0][0].idUsuario;
      var objeto = results[0][0];
      if (resultado !== null) {
        const fechaOriginal = results[0][0].Fecha_Nacimiento;
        const fecha = new Date(fechaOriginal);

        const fechaFormateada = fecha.toISOString().substring(0, 10);
        //console.log(fechaFormateada); 
        objeto.Fecha_Nacimiento = fechaFormateada
        res.status(200).json(objeto);
      }else{
        res.status(400).json({ mensaje: 'Credenciales incorrectas!' });
      }
      
    });
   //------------------------------
    
    
    
    
    // Credenciales inválidas, enviar una respuesta de error
    //res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    
  };

  

  const editUser = (req, res)=>{
    const { idUsuario, nombres, apellidos, foto, correo, contraseña } = req.body;
    //la foto se debe recibir en base 64 para almacenarla en el bucket y el link del bucket se guarda en BD.
    // nombre de la foto
    const urlImage = "fotosUsuarios/" + idUsuario + ".jpg";
    
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
    //encriptar la contrase;a
    const encryptedPassword = crypto
    .createHash('md5')
    .update(contraseña)
    .digest('hex');
    //--------------------------
    //verificar la contrase;a
    var resultado;
    //nombre de la foto = correo+foto
    const namephoto = correo+" - foto"
    db.query('CALL VerificarPasswordPorID(?, ?)', [idUsuario, encryptedPassword], (err, results) => {
      if (err) {
        console.error('Error al verificar credenciales:', err);
        return;
      }
    
      //console.log("res:::",results[0][0]);
      resultado = results[0][0].Resultado;
      if (resultado == 1) {
        //update en BD
        db.query('CALL ActualizarUsuario(?,?,?,?,?)', [idUsuario,nombres,apellidos,urlImage,correo], (err, result) => {
          if (err) {
            console.error('Error al editar nuevo usuario:', err);
            res.status(400).json({ mensaje: 'Usuario no editado!' });
            return;
          }
        
          //console.log('Resultadoo: ', result);
          
          res.status(200).json({ mensaje: 'Usuario editado!' });
          
          
        });
        //--------------------------------------------
      }else{
        res.status(400).json({ mensaje: 'Credenciales incorrectas!' });
      }
      
    });
    //--------------------------
    
    
    
    
    
  }

  /*const deleteUser = (req, res)=>{

  }*/

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
    createUser,
    login,
    editUser
  };
  