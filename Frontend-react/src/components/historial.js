import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './config';
import  {  useEffect } from 'react';
import  Postdata from './ApisGetPost'; // 

const SongList = ({ songs}) => {

  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  const handleSongClick = (songUrl,songId,SongI) => {
    /*setCurrentSong(songUrl);
    
    var SongIdalbum=0
    var SongIdartista=0
    if(SongI.Idalbum)SongIdalbum=SongI.Idalbum
    if(SongI.Idartista)SongIdartista=SongI.Idartista

    enviarapost(songId,SongIdalbum,SongIdartista); 
*/
  };
  const enviarapost = (songId,SongIdalbum,SongIdartista) => {
   //W console.log('songId', currentSongId,'currentAlbumId', currentAlbumId,'setcurrentArtistId', currentArtistId);

    //  onAddSong(selectedPlaylist, selectedSong);
    const userstorage = localStorage.getItem('Iduser');

    let data = {    
      Iduser:userstorage,
     
      Idcancion:songId
    
   }
  // SendPost(data);
  var postdataf= Postdata.sendDataToServerPlay(data,"reproducircancion")
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
                <h2>Historial</h2>
                <table className="table">
                  <tbody>
                    {songs.map((song, index) => (
                      <tr key={index}>
                        <td>
                          <button style={{  border:"white" }} onClick={() => handleSongClick(song.Url,song.Idcancion,song)}>
                            <i className="bi bi-music-note"></i> {song.Name}
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
const HistorialForm = () => {
 

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

const HistorialForm = () => {
        
  const [canciones, setCanciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {
 
    const userId = localStorage.getItem('Iduser');

  
    fetch(urlconf+'/song/cancionesreproducidas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Iduser: userId}), 
    })
      .then((response) => response.json())
      .then((data) => {
        console.error('listadoHH albums:', data);
  
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


export default HistorialForm;