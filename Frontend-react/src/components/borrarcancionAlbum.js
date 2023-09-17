import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // 
import  { useEffect } from 'react';
import './config';


const AlbumSongForm = ({ albums }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleAlbumChange = (event) => {
    const selectedAlbumId = event.target.value;
    const album = albums.find((album) => album.Idalbum === Number(selectedAlbumId));
    setSelectedAlbum(album);
    setSelectedSong(null);
  };

  const handleSongChange = (event) => {
    const selectedSongId = event.target.value;
    setSelectedSong(selectedSongId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Selected Album ID:', selectedAlbum.Idalbum);
    console.log('Selected Song ID:', selectedSong);


    event.preventDefault();
    if (selectedAlbum && selectedSong) {
      const userstorage = localStorage.getItem('Iduser');

      let data = {
        Idcancion: selectedSong,
        Idalbum:  selectedAlbum.Idalbum,
        Iduser:userstorage,
      };
  
      console.log(JSON.stringify(data));
  
      var postdataf = Postdata.sendDataToServer(data, 'album/borrarcancionalbum');
      if (postdataf) {
        postdataf
          .then((response) => {
            console.log('Response from class B:', response);
          })
          .catch((error) => {
            console.error('There was a problem with the POST request:', error);
          });
      }
    }

  };

  return (
    <form onSubmit={handleSubmit}>
       <div className="form-group">
           
           <div className="row">
             <div className="col">
             
             <div class="badge bg-muted text-wrap" >
             <h4>Seleccione Album:</h4>  
   
 </div>
 
               </div>
               <div className="col">
               <select   id="albumSelect"
          name="album"
          onChange={handleAlbumChange}
          value={selectedAlbum ? selectedAlbum.Idalbum : ''}>
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
               <select  id="songSelect"
          name="song"
          onChange={handleSongChange}
          value={selectedSong || ''}>
              <option value="">Seleccione cancion</option>
          {selectedAlbum &&
            selectedAlbum.canciones.map((song) => (
              <option key={song.Idcancion} value={song.Idcancion}>
                {song.Name}
              </option>
            ))}
          </select>
               </div>
 
             </div>
 
 
      
           </div>



    
    
      <div>
        <button className="btn btn-danger" type="submit">Submit</button>
      </div>
    </form>
  );
};


const BorrarcancionAlbumForm = () => {

  const [canciones, setCanciones] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // To track whether data is loading
  
  
  var urlconf=global.config.i18n.apiget
  
  useEffect(() => {

  fetch(urlconf+'/canciones')
    .then((response) => response.json())
    .then((data) => {
  
      setCanciones(data);
    })
    .catch((error) => {
      console.error('Error fetching artistas:', error);
    });
  

  fetch(urlconf+'/album/veralbum')
    .then((response) => response.json())
    .then((data) => {
  
      setAlbums(data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching albums:', error);
      setIsLoading(false); 
    });
  }, []); 
  
  
  
  if (isLoading) {
  return <div>cargando datos...</div>; 
  }
       
  return (
    <div>
      <AlbumSongForm albums={albums}   />
    </div>
  );
  };

  export default BorrarcancionAlbumForm;
/*
const AgregarCancionplaylistForm = () => {
 
       
       const handleSubmit = (e) => {
       // e.preventDefault();
   
      };
  
           
    
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
      <MusicForm albums={albums}  onSubmit={handleSubmit} />
    </div>
  );
};
*/
