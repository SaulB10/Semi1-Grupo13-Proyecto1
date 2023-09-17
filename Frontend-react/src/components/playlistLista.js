import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './config';
import  {  useEffect } from 'react';
import  Postdata from './ApisGetPost'; // 

const PlaylistComponent = ({ playlist,urlbucket }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedUrl, setselectedUrl] = useState(null);
  const audioRef = React.createRef();

  const handlePlaylistClick = (playlistName) => {
    setSelectedPlaylist(playlistName);
   
  
  };

  const handleSongClick = (songUrl,songId,SongI) => {
    //setSelectedSong(SongIdalbum);
    setSelectedSong(SongI);
    setselectedUrl(songUrl);
    if (audioRef) {
      if (audioRef.current) {
        audioRef.current.src = urlbucket+"/"+songUrl;
        audioRef.current.play();
      }
    }
   if(document.getElementById("backgroundMusic")){
    document.getElementById("backgroundMusic").play().catch((error) => {
      document.addEventListener('click', () => {
        document.getElementById("backgroundMusic").play()
      }, { once: true } )
    })
  }

    enviarapost(songId); 

  };

  const renderSongList = (componentes) => {
    return (
      <table className="table">
        <tbody>
          {componentes.map((song, index) => (
            <tr key={index}>
              <td>
                <button class="btn btn-dark" onClick={() => handleSongClick(song.Url,song.Idcancion,song)}>
                  {song.Name}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const enviarapost = (songId) => {
    //W console.log('songId', currentSongId,'currentAlbumId', currentAlbumId,'setcurrentArtistId', currentArtistId);
 
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

  return (
    <div className="container">
       <div className="row mt-3">
        <div className="col">
          {renderAudioPlayer(selectedSong)}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-6">
          <h2>Playlists</h2>
          <table className="table">
            <tbody>
              {playlist.map((list, index) => (
                <tr key={index}>
                  <td>
                    <button class="btn btn-success" onClick={() => handlePlaylistClick(list.Nombre)}>
                      {list.Nombre}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-6">
          <h2>Canciones</h2>
          {selectedPlaylist && renderSongList(playlist.find(list => list.Nombre === selectedPlaylist).canciones)}
        </div>
      </div>
     
    </div>
  );
};
/* 
const PlaylistLista = () => {


  const playlist = [
    {
      "Nombre": "Lista1",
      "canciones": [
        
    { Artist: "Mark rous", Name: "Valentines day" , Album: "Egipt", Url: "song7.mp3",Idcancion:"5" , Idartista: "7",Idalbum:"74"},
    { Artist: "Pitbull", Name: "ella baila sola", Album: "Ops" , Url: "song0.mp3",Idcancion:"0", Idartista: "9" ,Idalbum:"74"}
        
      ]
    },
    {
       "Nombre": "Lista2",
      "canciones": [
        
     { Artist: "Pitbull", Name: "La raza llama", Album: "ops", Url: "song5.mp3",Idcancion:"85" , Idartista: "87",Idalbum:"874" },
    { Artist: "Mark rous", Name: "happy" , Album: "Rouse", Url: "song6.mp3",Idcancion:"59" , Idartista: "79",Idalbum:"749"}
        
      ]
    }
  ];
        

  return (
    <div>
      <PlaylistComponent playlist={playlist} />
    </div>
  );
};
*/

const PlaylistLista = () => {


  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {

   fetch(urlconf+'/playlist/listadoplaylistuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Iduser: userId}), //
  })
    .then((response) => response.json())
    .then((data) => {
      setPlaylist(data);
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
        
 var urlaws=global.config.i18n.awslocation

  return (
    <div>
      <PlaylistComponent playlist={playlist} urlbucket={urlaws} />
    </div>
  );
};

export default PlaylistLista;