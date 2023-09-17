import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './config';
import  {  useEffect } from 'react';
import  Postdata from './ApisGetPost'; // 

const SongList = ({ songs}) => {
  const audioRef = React.createRef();
  const [selectedSong, setSelectedSong] = useState(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  const enviarapost = (songId) => {
    console.log('songId', songId);
 
     //  onAddSong(selectedPlaylist, selectedSong);
     const userstorage = localStorage.getItem('Iduser');
 
     let data = {    
       Iduser:userstorage,     
       Idcancion:songId
    }
   // SendPost(data);
   var postdataf= Postdata.sendDataToServerPlay(data,"song/reproducircancion")
    if(postdataf){  
     postdataf.then((response) => {
      
      
       console.log('Response from class B:', response);
     })
     .catch((error) => {
     
       console.error('There was a problem with the POST request:', error);
     });
 
      }
   
   
    console.log('data out');
    console.log(JSON.stringify(data));
 
 
    // setSelectedPlaylist(null);
     //  setSelectedSong(null);
     
   };

  const handleArtistClick = (artistName) => {
    setCurrentArtist(artistName);
    setCurrentAlbum(null);
  };

  const handleAlbumClick = (albumName) => {
    setCurrentAlbum(albumName);
    setCurrentArtist(null);
  };

 
  const filteredSongs = songs.filter((song) => {
    return (!currentArtist || song.Artist === currentArtist) &&
           (!currentAlbum || song.Album === currentAlbum);
  }); 
  const playSong = (url,SongI) => {
    setSelectedSong(SongI);
    var urlaws=global.config.i18n.awslocation

    if (audioRef) {
      if (audioRef.current) {
        audioRef.current.src = urlaws+"/"+url;
        audioRef.current.play();
      }
    }
    enviarapost(SongI.IdCancion); 

  }
    const renderAudioPlayer = (song) => {
      if (song) {
        return (
          <div>
            <h5>{song.Name}</h5>
            <p>Artist: {song.Artist}</p>
            <p>Album: {song.Album}</p>
            <audio ref={audioRef} controls autoPlay />
  
          </div>
        );
      }
      return null;
    };

  const getCurrentSongDetails = () => {
    if (currentSong) {
      const currentSongDetails = songs.find(song => song.Url === currentSong);
      if (currentSongDetails) {
        return `${currentSongDetails.Name} - ${currentSongDetails.Artist} - ${currentSongDetails.Album}`;
      }
    }
    return '';
  };


  return (
    <div className="container">
      <div className="row">
     

      <div className="col">
      

        <div className="row-2 bg-white m-1 p-3">
                <h2>Lista de Favoritos</h2>

                {renderAudioPlayer(selectedSong)}


                <table className="table"  class="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Artista</th>
                <th>Album</th>
                <th>Play</th>               
              </tr>
            </thead>
            <tbody>
              {songs.map((cancion) => (
                <tr key={cancion.IdCancion}>
                  <td>{cancion.Nombre}</td>
                  <td>{cancion.Artista || 'Unknown'}</td>
                  <td>{cancion.Album || 'Unknown'}</td>
                  <td>
                  <button onClick={() => playSong(cancion.Url,cancion)} className="btn btn-primary">
                  Play
                </button>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>


      </div>
   
    </div>

    </div>
   
   </div>
  );
};


/*
const FavoritosForm = () => {
 
  const playlist = [
    {
      "Nombre": "Lista1"    
    },
    {
       "Nombre": "Lista2"
    }
  ]; 
  const songs = [{ Artist: "Bruno kenner", Name: "wonderful",Idcancion: "3", Album: "Full", Url: "song.mp3" },
  { Artist: "Mark rous", Name: "happy" ,Idcancion: "4", Album: "Rouse", Url: "song2.mp3"},
  { Artist: "Bruno kenner", Name: "Is me again",Idcancion: "6", Album: "Full" , Url: "song3.mp3"},
  { Artist: "Mark rous", Name: "sunshine",Idcancion: "8" , Album: "my life", Url: "song4.mp3"}]; 

  const handleAddSong = (playlistName, songName) => {
    console.log(`Added song "${songName}" to playlist "${playlistName}"`);
  };

  return (
    <div>
      <SongList songs={songs}  />
    </div>
  );
};

*/
const FavoritosForm = () => {
        
  const [canciones, setCanciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {

    const userId = localStorage.getItem('Iduser');

    fetch(urlconf+'/favorite/favoritos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Iduser: userId}), 
    })
      .then((response) => response.json())
      .then((data) => {
  
        setCanciones(data.canciones);
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
      <SongList  songs={canciones}  />
    </div>
  );
};


export default FavoritosForm;