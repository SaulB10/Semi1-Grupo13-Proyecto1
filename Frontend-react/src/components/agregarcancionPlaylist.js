import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // Import class B
import  { useEffect } from 'react';
import './config';
const AddSongToPlaylistForm = ({ playlist, songs, onAddSong }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylist(event.target.value);
    console.log('event.target.valueB:', event.target.value);

  };

  const handleSongChange = (event) => {
    setSelectedSong(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPlaylist && selectedSong) {
    //  onAddSong(selectedPlaylist, selectedSong);
    const userstorage = localStorage.getItem('Iduser');

    let data = {    
      Idplaylist: selectedPlaylist,
      Idcancion:selectedSong,
      Iduser:userstorage,
   }
  // SendPost(data);
  var postdataf= Postdata.sendDataToServer(data,"playlist/agregarcancionplaylist")
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
    }
  };

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Seleccione playlist:</label>
              <select className="form-select" onChange={handlePlaylistChange} value={selectedPlaylist || ''}>
                <option value="" disabled>Seleccione playlist</option>
                {playlist.map((list, index) => (
                  <option key={index} value={list.idPlaylist}>{list.Nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Seleccione cancion:</label>
              <select className="form-select" onChange={handleSongChange} value={selectedSong || ''}>
                <option value="" disabled>Seleccione cancion</option>
                {songs.map((song, index) => (
                  <option key={index} value={song.Idcancion}>{song.Name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Agregar Cancion</button>
          </form>
        </div>
      </div>
    </div>
  );
};
/*const AgregarCancionplaylistForm = () => {
 
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
    // Add the selected song to the playlist
    console.log(`Added song "${songName}" to playlist "${playlistName}"`);
  };

  return (
    <div>
      <AddSongToPlaylistForm playlist={playlist} songs={songs} onAddSong={handleAddSong} />
    </div>
  );
};*/
const AgregarCancionplaylistForm = () => {
        
  const [canciones, setCanciones] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // To track whether data is loading


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {
 

      fetch(urlconf+'/playlist/listadoplaylist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Iduser: userId}), // JSON data to send
      })
      .then((response) => response.json())

        .then((data) => {

          console.error('data fetching    ok:', data);

          setPlaylist(data.playlists);
      
        })
        .catch((error) => {
          console.error('Error fetching albums:', error);
      
        });
          

      fetch(urlconf+'/song/canciones')
        .then((response) => response.json())
        .then((data) => {
          console.error('data fetching    ok:', data);
      
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
      <AddSongToPlaylistForm playlist={playlist} songs={canciones}  />
    </div>
  );
};

export default AgregarCancionplaylistForm;