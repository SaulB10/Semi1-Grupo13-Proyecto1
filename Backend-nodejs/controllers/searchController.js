const crypto = require('crypto');
const configS3 = require('../config/aws.config')
const aws = require('aws-sdk');
const { S3Params, S3ParamsGetFile } = require('../clases/aws.clases');
const db = require('../config/db.config')

const SearchSongs = (req , res)=>{
    const {entrada} = req.body
    db.query('CALL BuscarCancionesPorNombreOArtista(?)',[entrada], (err, result) => {
        if (err) {
          console.error('Error al buscar', err);
          res.status(400).json({ mensaje: 'Busqueda fallida!' });
          return;
        }
      
        //console.log('Resultadoo: ', result[0]);
        res.status(200).json({ canciones:result[0]});
        
        
      });
}
const SearchAlbums = async (req , res)=>{
    const {entrada} = req.body
    try {
        // Primero obtenemos los ID de los álbumes
        const albumes = await new Promise((resolve, reject) => {
          db.query('CALL BuscarAlbumesPorNombreOArtista(?)',[entrada], (err, result) => {
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
            db.query('CALL GetCancionesPorAlbum(?)', [album.IdAlbum], (err, result) => {
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

}
const SearchArtists = async (req , res)=>{
    const {entrada} = req.body

try {
        // Primero obtenemos los ID de los álbumes
        const artistas = await new Promise((resolve, reject) => {
          db.query('CALL BuscarArtistas(?)',[entrada], (err, result) => {
            if (err) {
              console.error('Error al obtener artistas', err);
              reject(err);
            } else {
              resolve(result[0]);
            }
          });
        });
    
        // Luego, para cada artista, obtenemos las canciones y agregamos la propiedad "canciones"
        for (const artista of artistas) {
          const canciones = await new Promise((resolve, reject) => {
            db.query('CALL GetCancionesPorArtista(?)', [artista.idArtista], (err, result) => {
              if (err) {
                console.error('Error al obtener canciones', err);
                reject(err);
              } else {
                resolve(result[0]);
              }
            });
          });
    
          artista.canciones = canciones;
        }
    
        //console.log(albumes);
        res.status(200).json(artistas);
      } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener datos', error: err.message });
      }
}
module.exports = {SearchSongs,SearchAlbums,SearchArtists}