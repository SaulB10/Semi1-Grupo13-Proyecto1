const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config')

const createFavorite = (req , res)=>{
    const {Iduser, Idcancion} = req.body
    db.query('CALL AgregarFavorito(?,?)',[Iduser,Idcancion], (err, result) => {
        if (err) {
          console.error('Error al agregar favorito', err);
          res.status(400).json({ mensaje: 'Error al agregar favorito!' });
          return;
        }
      
        //console.log('Resultadoo: ', result[0]);
        res.status(200).json({ mensaje: 'Favorito agregado!' });
        
        
      });
}

const removeFavorite = (req , res)=>{
    const {Iduser, Idcancion} = req.body
    db.query('CALL EliminarFavorito(?,?)',[Iduser,Idcancion], (err, result) => {
        if (err) {
          console.error('Error al remover favorito', err);
          res.status(400).json({ mensaje: 'Error al remover favorito!' });
          return;
        }
      
        //console.log('Resultadoo: ', result[0]);
        res.status(200).json({ mensaje: 'Favorito removido!' });
        
        
      });
}

const getFavorites = (req , res)=>{
    const {Iduser} = req.body

    db.query('CALL ListarFavoritosPorUsuario(?)',[Iduser], (err, result) => {
        if (err) {
          console.error('Error al obtener favoritos', err);
          res.status(400).json({ mensaje: 'Error al obtener favoritos!' });
          return;
        }
      
        //console.log('Resultadoo: ', result[0]);
        res.status(200).json({ canciones: result[0] });
        
        
      });
    
}

module.exports = {createFavorite,removeFavorite,getFavorites}