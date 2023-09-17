import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // Import class B
import  { useEffect } from 'react';
import './config';
import Swal from 'sweetalert2'

const MusicForm = ({ albums, canciones, onSubmit }) => {
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [songsForSelectedAlbum, setSongsForSelectedAlbum] = useState([]);
  const [selectedSong, setSelectedSong] = useState('');
  const [error, setError] = useState('');

  const handleAlbumChange = (e) => {
    const albumId = e.target.value;
    setSelectedAlbum(albumId);

    // Filtrar canciones que coincidan con el Idartista del álbum seleccionado
    /*const songs = canciones.filter((song) => {
      const album = albums.find((album) => album.Idalbum === albumId);
      return song.Idartista === album.Idartista;
    });

    setSongsForSelectedAlbum(songs);
    setSelectedSong('');*/
  };

  const handleSongChange = (e) => {
    setSelectedSong(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var isSongAlreadyAdded =false

/*

    const album = albums.find((album) => album.Idalbum === selectedAlbum);
   
    if (album.canciones) {
     if (album.canciones.length > 0) {
       isSongAlreadyAdded = album.canciones.some(
        (song) => song.Idcancion === selectedSong
      );
    }
  }

    if (isSongAlreadyAdded) {
      setError('Cancion ya esta en album.');
    } else {
    //  onSubmit(selectedAlbum, selectedSong);
      let data = {    
        Idalbum: selectedAlbum,
        Idcancion:selectedSong
     }
     */
    // SendPost(data);
    let data = {    
      Idalbum: selectedAlbum,
      Idcancion:selectedSong
   }
    var urlconf=global.config.i18n.apiget

    fetch(urlconf+'/album/agregarcancionalbum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    })
      .then((response) => response.json())
      .then((data) => {

        const {  mensaje        } =  data;

        Swal.fire({
          icon: 'success',
          title: 'Mensaje',
          text:mensaje
        })
       
  
      })
      .catch((error) => {
        console.error('Error fetching albums:', error);
      });
  
    





 
    
     console.log('data out');
     console.log(JSON.stringify(data));



      setSelectedAlbum('');
      setSelectedSong('');
      setError('');
    }
  

  return (
    <div>
    <nav class="bg-dark navbar-dark navbar">
            <div className="row col-12 d-flex justify-content-center text-white">
                <h3>Agregar cancion a Album</h3>
            </div>
        </nav>
              <form onSubmit={handleSubmit}>

              <div className="form-group">
           
           <div className="row">
             <div className="col">
             
             <div class="badge bg-muted text-wrap" >
             <h4>Seleccione Album:</h4>  
   
 </div>
 
               </div>
               <div className="col">
               <select class="form-select" aria-label="Default select example"value={selectedAlbum} onChange={handleAlbumChange}>
            <option value="">Seleccione Album</option>
            {albums.map((album) => (
              <option key={album.Idalbum} value={album.Idalbum}>
                {album.Nombre}
              </option>
            ))}
          </select>
               </div>
 
             </div>
 
 
      
           </div>
           <div className="form-group">
           
           <div className="row">
             <div className="col">
             
             <div class="badge bg-muted text-wrap" >
             <h4>Seleccione cancion:</h4>  
   
 </div>
 
               </div>
               <div className="col">
               <select class="form-select" aria-label="De" value={selectedSong} onChange={handleSongChange}>
            <option value="">Seleccione cancion</option>
            {canciones.map((song) => (
              <option key={song.Idcancion} value={song.Idcancion}>
                {song.Name}
              </option>
            ))}
          </select>
               </div>
 
             </div>
 
 
      
           </div>

 
        
        <button type="submit" className="btn btn-primary">
          Agregar
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

/*
const AgregarCancionplaylistForm = () => {
 
       
  const handleSubmit = (e) => {
   e.preventDefault();

 };
 const canciones = [

   {  Idcancion: "1", Name: "Is me again",Artist: "thalia", Idartista: "18", Album: "Full" , Idalbum: "9", Url: "song3.mp3"},
  { Idcancion: "2", Name: "sunshine", Artist: "madonna", Idartista: "14" , Album: "my life2", Idalbum: "11", Url: "song7.mp3"},
   { Idcancion: "3", Name: "paro", Artist: "thalia", Idartista: "18" , Album: "my life3", Idalbum: "13", Url: "song9.mp3"},
   { Idcancion: "4", Name: "sunshine4", Artist: "FEY", Idartista: "13" , Album: "", Idalbum: "", Url: "song2.mp3"},
  { Idcancion: "5", Name: "te ame", Artist: "thalia", Idartista: "18" , Album: "my life8", Idalbum: "16", Url: "song11.mp3"},
   { Idcancion: "27", Name: "ella baila sola", Artist: "Bronco", Idartista: "11" , Album: "Ops" , Idalbum: "5", Url: "song11.mp3"},
   { Idcancion: "34", Name: "te parti", Artist: "Bronco", Idartista: "11" , Album: "", Idalbum: "", Url: "song2.mp3"},
  { Idcancion: "35", Name: "puerta negra", Artist: "Bronco", Idartista: "11" , Album: "", Idalbum: "", Url: "song11.mp3"}
  
      ]
      
      

const albums = [
    {
      "Idalbum":"3",
      "Nombre": "para todos",
      "Artista":"thalia"   ,
      "Idartista": "18",
      "canciones": [
        
  { Idcancion: "5", Name: "te ame", Artist: "thalia", Idartista: "18" , Album: "my life8", Idalbum: "16", Url: "song11.mp3"},
  { Idcancion: "8", Name: "te ame con dolor", Artist: "thalia", Idartista: "18" , Album: "my life8", Idalbum: "16", Url: "song11.mp3"}
        
      ]
      
      
    },
    {
       "Idalbum":"5",
      "Nombre": "arc",
      "Artista":"Bronco"   ,
       "Idartista": "11",
      "canciones": [
      {  Name: "Valentines day",Idcancion: "26",Artist: "Bronco", Idartista: "11" , Album: "arc", Idalbum: "5", Url: "song7.mp3"},
     {  Name: "ella baila sola",Idcancion: "27",Artist: "Bronco", Idartista: "11", Album: "arc" , Idalbum: "5", Url: "song0.mp3"}
       
      ]
    },
    {
       "Idalbum":"7",
      "Nombre": "regando",
      "Artista":"FEY"   ,
       "Idartista": "13",
      "canciones": [
      {  Name: "Valenti4",Idcancion: "26",Artist: "FEY", Idartista: "13" , Album: "Egipt", Idalbum: "7", Url: "song7.mp3"},
     {  Name: "ella bai3",Idcancion: "27",Artist: "FEY", Idartista: "13", Album: "Ops" , Idalbum: "7", Url: "song0.mp3"}
       
      ]

    }
      ]
  
  
return (
<div>
 <MusicForm albums={albums} canciones={canciones} onSubmit={handleSubmit} />
</div>
);
};
*/ 
const AgregarCancionplaylistForm = () => {
 
       
  const [canciones, setCanciones] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // To track whether data is loading

  
  const handleSubmit = (e) => {
  // e.preventDefault();

 };
 var urlconf=global.config.i18n.apiget

 useEffect(() => {
  fetch(urlconf+'/song/canciones')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.error('success  canciones 66  :');
      console.error(data.canciones);

      setCanciones(data.canciones);
    })
    .catch((error) => {
      console.error('Error fetching artistas :', error);
      console.error(urlconf+'/song/canciones');
    });


  fetch(urlconf+'/album/veralbum')
    .then((response) => response.json())
    .then((data) => {
      console.error('ok fetching albums:', data);

      setAlbums(data);
      setIsLoading(false); // 
    })
    .catch((error) => {
      console.error('Error fetching albums:', error);
      setIsLoading(false); // 
    });
}, []); // 

if (isLoading) {
  return <div>cargando datos...</div>; 
}
       
  return (
    <div>
      <MusicForm albums={albums} canciones={canciones} onSubmit={handleSubmit} />
    </div>
  );
};

export default AgregarCancionplaylistForm;