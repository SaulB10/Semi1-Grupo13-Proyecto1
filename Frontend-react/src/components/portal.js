import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'bootstrap';
import './config';
import  {  useEffect } from 'react';
import  Postdata from './ApisGetPost'; // 
import ReactAudioPlayer from 'react-audio-player';




    const CancionesList = ({ canciones ,urlbucket}) => {
      const [filteredCanciones, setFilteredCanciones] = useState(canciones);
      const [selectedArtista, setSelectedArtista] = useState('All Artists');
      const [selectedAlbum, setSelectedAlbum] = useState('All Albums');
      const audioRef = React.createRef();
      const [selectedSong, setSelectedSong] = useState(null);

      const Like = (SongI) => {
        const userstorage = localStorage.getItem('Iduser');

        let data = {    
          Iduser:userstorage,     
          Idcancion:SongI.Idcancion
       }
      // SendPost(data);
      var postdataf= Postdata.sendDataToServer(data,"favorite/darfavorito")
       if(postdataf){  
        postdataf.then((response) => {
          // Set the response data in state
         
         
          console.log('Response from class B:', response);
        })
        .catch((error) => {
        
          console.error('There was a problem with the POST request:', error);
        });
      }
        

/*
        var SongIdalbum=0
        var SongIdartista=0
        if(SongI.Idalbum)SongIdalbum=SongI.Idalbum
        if(SongI.Idartista)SongIdartista=SongI.Idartista
    */
   

  };
  
  
      const playSong = (url,SongI) => {
        setSelectedSong(SongI);
        if (audioRef) {
          if (audioRef.current) {
            audioRef.current.src = urlbucket+"/"+url;
            audioRef.current.play();
          }
        }
/*
        var SongIdalbum=0
        var SongIdartista=0
        if(SongI.Idalbum)SongIdalbum=SongI.Idalbum
        if(SongI.Idartista)SongIdartista=SongI.Idartista
    */
       enviarapost(SongI.Idcancion); 

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
      const filterCanciones = () => {
        let filtered = canciones;
    
        if (selectedArtista !== 'All Artists') {
          filtered = filtered.filter((cancion) => cancion.Artista === selectedArtista);
        }
    
        if (selectedAlbum !== 'All Albums') {
          filtered = filtered.filter((cancion) => cancion.Album === selectedAlbum);
        }
    
        setFilteredCanciones(filtered);
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
        <div>
          
          <div className=" text-white">
                <h3>canciones</h3>
            </div>
          <div className="filters">
            <select    className="form-control" onChange={(e) => setSelectedArtista(e.target.value)}>
              <option value="All Artists">Todos los Artistas</option>
              {/* Populate artist options dynamically */}
              {Array.from(new Set(canciones.map((cancion) => cancion.Artista)))
                .filter((artista) => artista !== null)
                .map((artista) => (
                  <option key={artista} value={artista}>
                    {artista}
                  </option>
                ))}
            </select>
            <select     className="form-control" onChange={(e) => setSelectedAlbum(e.target.value)}>
              <option value="All Albums">Todos los Albums</option>
             
              {Array.from(new Set(canciones.map((cancion) => cancion.Album)))
                .filter((album) => album !== null)
                .map((album) => (
                  <option key={album} value={album}>
                    {album}
                  </option>
                ))}
            </select>
            <button className="btn btn-primary" onClick={filterCanciones}>Filtrar</button>
          </div>
          <table className="table"  class="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Artista</th>
                <th>Album</th>
                <th>Play</th>
                <th>Me gusta</th>
              </tr>
            </thead>
            <tbody>
              {filteredCanciones.map((cancion) => (
                <tr key={cancion.Idcancion}>
                  <td>{cancion.Name}</td>
                  <td>{cancion.Artista || 'Unknown'}</td>
                  <td>{cancion.Album || 'Unknown'}</td>
                  <td>
                  <button onClick={() => playSong(cancion.Url,cancion)} className="btn btn-primary">
                  Play
                </button>
                  </td>
                  <td>
                  <button onClick={() => Like(cancion)} className="btn btn-success">
                  Like
                </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {renderAudioPlayer(selectedSong)}


        </div>
      );
    };
    
    
/*const PortalForm = () => {
 
  const arraylistsongs = [{ Artist: "Bruno kenner", Idartista: "11", Name: "wonderful", Album: "Full",Idalbum:"77", Url: "song.mp3",Idcancion:"7" },
  { Artist: "Mark rous", Idartista: "10", Name: "happy" , Album: "Rouse",Idalbum:"78", Url: "song2.mp3",Idcancion:"6" },
  { Artist: "Bruno kenner", Idartista: "19", Name: "Is me again", Album: "Full",Idalbum:"76" , Url: "song3.mp3",Idcancion:"8" },
  { Artist: "Mark rous", Idartista: "9", Name: "sunshine" , Album: "my life",Idalbum:"57", Url: "song4.mp3",Idcancion:"5" },
  { Artist: "Pitbull", Idartista: "8", Name: "Powerful", Album: "ops",Idalbum:"75", Url: "song5.mp3",Idcancion:"4"  },
  { Artist: "Mark rous", Idartista: "7", Name: "happy" , Album: "Rouse",Idalbum:"74", Url: "song6.mp3",Idcancion:"2" },
   { Artist: "Bruno kenner", Idartista: "6", Name: "Sale", Album: "Youtube",Idalbum:"22", Url: "song8.mp3",Idcancion:"4" },
  { Artist: "Mark rous", Idartista: "5", Name: "Valentines day" , Album: "Egipt",Idalbum:"73", Url: "song7.mp3",Idcancion:"3" },
  { Artist: "Pitbull", Idartista: "4", Name: "ella baila sola", Album: "Ops" ,Idalbum:"72", Url: "song0.mp3",Idcancion:"1" }];



  return (
    <div>
      <SongList arraylistsongs={arraylistsongs}  />
    </div>
  );
};*/


const PortalForm = () => {
 
       
  const [canciones, setCanciones] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  
  const handleSubmit = (e) => {
  // e.preventDefault();

 };
 var urlconf=global.config.i18n.apiget

 useEffect(() => {
  // Fetch artistas data from the API
  fetch(urlconf+'/song/canciones')
    .then((response) => response.json())
    .then((data) => {
      console.error('ok data :', data);

      setCanciones(data.canciones);
      setIsLoading(false); 

    })
    .catch((error) => {
      console.error('Error fetching artistas:', error);
    });

  
}, []); 



if (isLoading) {
  return <div>cargando datos...</div>;
}
var urlaws=global.config.i18n.awslocation
    
  return (
    <div>
      <CancionesList canciones={canciones}  urlbucket={urlaws}/>
    </div>
  );
};


export default PortalForm;
