import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // 
import  { useEffect } from 'react';
import './config';

const BorrarplaylistForm2 = ({ playlist, songs, onAddSong }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylist(event.target.value);
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPlaylist ) {
      const userstorage = localStorage.getItem('Iduser');

      let data = {       
        Idplaylist: selectedPlaylist ,
        Iduser:userstorage,
      };
  
      console.log(JSON.stringify(data));
  
      var postdataf = Postdata.sendDataToServer(data, 'playlist/borrarplaylist');
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
    <div className="container">
      <div className="row mt-3">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Seleccione playlist:</label>
              <select className="form-select" onChange={handlePlaylistChange} value={selectedPlaylist || ''}>
                <option value="" disabled>Seleccione playlist</option>
                {playlist
  ?playlist.map((list, index) => (
                  <option key={index} value={list.idPlaylist}>{list.Nombre}</option>
                )) : <option ></option>}
              </select>
            </div>
           
            <button type="submit" className="btn btn-danger">Borrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
/*
const BorrarplaylistForm = () => {
 
  const playlist = [
    {
      "Nombre": "Lista1"    
    },
    {
       "Nombre": "Lista2"
    }
  ]; 

  */
const BorrarplaylistForm = () => {
 
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {


   fetch(urlconf+'/playlist/listadoplaylist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Iduser: userId}), 
  })
    .then((response) => response.json())
    .then((data) => {
      setPlaylist(data.playlists);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching albums:', error);
      setIsLoading(false); 
    });
      
   
 }, []); 
 
 if (isLoading) {
   return <div>cargando datos...</div>; // Show a loading message until data is loaded
 }

  

  return (
    <div>
      <BorrarplaylistForm2 playlist={playlist}  />
    </div>
  );
};

export default BorrarplaylistForm;