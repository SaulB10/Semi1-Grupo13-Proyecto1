import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // 
import  { useEffect } from 'react';
import './config';

const DeletePlaylistItemForm = ({ playlist }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handlePlaylistChange = (event) => {
    const selectedPlaylistId = event.target.value;
    const selectedPlaylist = playlist.find(
      (playlist) => playlist.idPlaylist === Number(selectedPlaylistId)
    );
    setSelectedPlaylist(selectedPlaylist);
    setSelectedSong(null);
  };

  const handleSongChange = (event) => {
    const selectedSongId = event.target.value;
    setSelectedSong(selectedSongId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Selected Playlist ID:', selectedPlaylist.idPlaylist);
    console.log('Selected Song ID:', selectedSong);

    event.preventDefault();
    if (selectedPlaylist && selectedSong) {
      const userstorage = localStorage.getItem('Iduser');

      let data = {
        Idcancion: selectedSong,
        Idplaylist: selectedPlaylist.idPlaylist,
        Iduser:userstorage,
      };
  
      console.log(JSON.stringify(data));
  
      var postdataf = Postdata.sendDataToServer(data, 'playlist/eliminacancionplaylist');
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
  }
  return (
    <div className="form">

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
              <div style={{ width: '120px', marginRight: '10px' }}>
              <label htmlFor="playlistSelect"className="form-label">Seleccione playlist:</label>
            </div>
             
            <div style={{ flex: 1 }}>
             
            <select     id="playlistSelect"
          name="playlist"
          onChange={handlePlaylistChange}
          value={selectedPlaylist ? selectedPlaylist.idPlaylist : ''}>
                <option value="" >Seleccione playlist</option>
                {playlist.map((item) => (
            <option key={item.idPlaylist} value={item.idPlaylist}>
              {item.Nombre}
            </option>
          ))}
              </select>
            </div>


       </div>

       <div className="mb-3">
       <div style={{ width: '120px', marginRight: '10px' }}>
       <label htmlFor="songSelect" className="form-label">Seleccione cancion:</label>
            </div>
             
            <div style={{ flex: 1 }}>
             
            <select c  id="songSelect"
          name="song"
          onChange={handleSongChange}
          value={selectedSong || ''}>
                <option value="" disabled>Seleccione cancion</option>
                {selectedPlaylist &&selectedPlaylist.canciones &&
            selectedPlaylist.canciones.map((song) => (
              <option key={song.Idcancion} value={song.Idcancion}>
                {song.Name}
              </option>
            ))}
              </select>
              
             </div>
           
            </div>
   
      <div>
        <button type="submit" className="btn btn-danger">Borrar </button>
      </div>
    </form>  </div>
  );
};

/*
const BorrarCancionplaylistForm = () => {
  const playlist = [
    {
      "Nombre": "Lista1",
      "Componentes": [
        
    { Artist: "Mark rous", Name: "Valentines day" , Album: "Egipt",Idcancion:"7", Url: "song7.mp3"},
    { Artist: "Pitbull", Name: "ella baila sola", Album: "Ops" ,Idcancion:"9", Url: "song0.mp3"}
        
      ]
    },
    {
       "Nombre": "Lista2",
      "Componentes": [
        
          { Artist: "Pitbull", Name: "La raza llama", Album: "ops",Idcancion:"7", Url: "song5.mp3" },
    { Artist: "Mark rous", Name: "happy" , Album: "Rouse",Idcancion:"8", Url: "song6.mp3"}
        
      ]
    }
  ];

  return (
    <div>
      <DeletePlaylistItemForm playlist={playlist}  />
    </div>
  );
};
*/

const BorrarCancionplaylistForm = () => {
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {
 

   fetch(urlconf+'/playlist/listadoplaylistuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Iduser: userId}), 
  })
    .then((response) => response.json())
    .then((data) => {
      console.error('listadoplaylistuser albums:', data);

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

  return (
    <div>
      <DeletePlaylistItemForm playlist={playlist}  />
    </div>
  );
};

export default BorrarCancionplaylistForm;