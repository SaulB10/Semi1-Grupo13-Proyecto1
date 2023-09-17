import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

import  {  useEffect } from 'react';

import  Postdata from './ApisGetPost'; // 

// or

const MusicPlayer = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = React.createRef();
  var urlaws=global.config.i18n.awslocation

  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    setCurrentSong(randomSong);
    if (audioRef) {
      if (audioRef.current) {
        audioRef.current.src = urlaws+"/"+randomSong.Url;
        audioRef.current.play();
      }
    }
  
    var songId=0

    if (randomSong) {

    if(randomSong.Idcancion)songId=randomSong.Idcancion
 
    enviarapost(songId); 
  }
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
  return (
    <div>
      <h2>Radio</h2>
      <button  className="btn btn-primary"onClick={playRandomSong}> Random </button>
      {currentSong && (
        <div>
          <h3> {currentSong.Name} - {currentSong.Artist}</h3>
          <audio ref={audioRef} controls autoPlay />



        </div>
      )}
    </div>
  );
};
/*
const RadioForm = () => {
  const songs = [
    { Artist: "Bruno kenner", Name: "wonderful", Idcancion: "3", Album: "Full", Url: "https://mega.nz/file/gB41hIiA#EOCe6vOB6hgcyuIxnhZ-U8P-3-SYGyA08EBMj80or6Q" },
    { Artist: "Mark rous", Name: "happy", Idcancion: "4", Album: "Rouse", Url: "https://mega.nz/file/gB41hIiA#EOCe6vOB6hgcyuIxnhZ-U8P-3-SYGyA08EBMj80or6Q" },
    { Artist: "Bruno kenner", Name: "Is me again", Idcancion: "6", Album: "Full", Url: "https://mega.nz/file/gB41hIiA#EOCe6vOB6hgcyuIxnhZ-U8P-3-SYGyA08EBMj80or6Q" },
    { Artist: "Mark rous", Name: "sunshine", Idcancion: "8", Album: "my life", Url: "https://mega.nz/file/gB41hIiA#EOCe6vOB6hgcyuIxnhZ-U8P-3-SYGyA08EBMj80or6Q" }
  ];

  return (
    <div>
      <MusicPlayer songs={songs} />
    </div>
  );
};*/

const RadioForm = () => {
        
  const [canciones, setCanciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  var urlconf=global.config.i18n.apiget
  const userId = localStorage.getItem('Iduser');

  useEffect(() => {


  
      
   
   fetch(urlconf+'/song/canciones')
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
   return <div>cargando datos...</div>
 }
        

  return (
    <div>
      <MusicPlayer  songs={canciones}  />
    </div>
  );
};

export default RadioForm;