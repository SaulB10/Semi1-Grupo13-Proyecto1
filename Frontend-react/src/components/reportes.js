import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // 
import { Table, Button, Form, Image } from 'react-bootstrap';

const ReportesForm = () => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('song');
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongId, setCurrentSongId] = useState(null);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  var urlaws=global.config.i18n.awslocation

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };
  const handleSongClick = (songUrl,songId,SongI) => {
    
    
    var SongIdalbum=0
    var SongIdartista=0
    if(SongI.Idalbum)SongIdalbum=SongI.Idalbum
    if(SongI.Idartista)SongIdartista=SongI.Idartista

    //console.log('songId', songId,'currentAlbumId', SongIdalbum,'setcurrentArtistId', SongIdartista);

  

    setCurrentSong(songUrl);
   setCurrentSongId(songId);
      // setcurrentAlbumId(SongIdalbum);
      // setcurrentArtistId(SongIdartista);
    enviarapost(songId,SongIdalbum,SongIdartista); 

  };
  const enviarapost = (songId,SongIdalbum,SongIdartista) => {
    //W console.log('songId', currentSongId,'currentAlbumId', currentAlbumId,'setcurrentArtistId', currentArtistId);
 
     //  onAddSong(selectedPlaylist, selectedSong);
     const userstorage = localStorage.getItem('Iduser');
 
     let data = {    
       Iduser:userstorage,
       Idalbum:SongIdalbum,
       Idcancion:songId,
       Idartista:SongIdartista
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
 

  const handleSubmit =async (event) => {
      event.preventDefault();

    console.log(`Searching for "${searchText}" in ${searchType}`);

    const userstorage = localStorage.getItem('Iduser');

    var datoabuscar='cancionesescuchadas';
    if(searchType==2)datoabuscar='artistasescuchados';
    if(searchType==3)datoabuscar='albumsescuchados';
    let data = {       
      Iduser:userstorage,
    };



    const canciones =[
        
      { Reproducciones: "32",Name: "La raza llama",Idcancion: "29",Artist: "madonna", Idartista: "11", Album: "ops", Idalbum: "8", Url: "song5.mp3" },
  { Reproducciones: "22",Name: "happy" , Idcancion: "30",Artist: "madonna", Idartista: "9",  Album: "Rouse", Idalbum: "9", Url: "song6.mp3"},
     { Reproducciones: "12",Name: "happy" , Idcancion: "30",Artist: "madonna", Idartista: "9",  Album: "Rouse", Idalbum: "9", Url: "song6.mp3"},
     { Reproducciones: "3",Name: "happy" , Idcancion: "30",Artist: "madonna", Idartista: "9",  Album: "Rouse", Idalbum: "9", Url: "song6.mp3"},
     { Reproducciones: "2",Name: "happy" , Idcancion: "30",Artist: "madonna", Idartista: "9",  Album: "Rouse", Idalbum: "9", Url: "song6.mp3"}
     
   ]

    //setData(canciones);

  const artistas = [
    { Idartista: "3", Nombre: "luis miguel",  Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=", Fechanac: "2023-7-15" },
    { Idartista: "4", Nombre: "Rocio durcal", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg==", Fechanac: "2023-6-15" },
    { Idartista: "6", Nombre: "rocardo montaner", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=", Fechanac: "2023-7-15" }
  ];

   //  setData2(artistas);

    const albums = [
    
      {  Idalbum:"33",Nombre: "reggaeton 2033",Descripcion:"album de prueba", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",Artista: "Luis miguel",Idartista:"3"},
      {  Idalbum:"34",Nombre: "para todos",Descripcion:"album de prueba 3", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg==",Artista: "Rocio durcal",Idartista:"4"},
      {  Idalbum:"36",Nombre: "Confie en ti",Descripcion:"para todos ", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",Artista: "rocardo montaner",Idartista:"6"}
      
        ]


           //setData3(albums);


    console.log(JSON.stringify(data));
    var urlconf=global.config.i18n.apiget


    const response = await fetch(urlconf+"/song/"+datoabuscar, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }


    const dat = await response.json();

          if(searchType==1)setData(dat.canciones);
          if(searchType==2)setData2(dat.artistas);
          if(searchType==3)setData3(dat.albumes);


     console.log('data out');

     console.log(JSON.stringify(data));


  };
  const getCurrentSongDetails = () => {
    if (currentSong) {
      const currentSongDetails = data.find(song => song.Url === currentSong);
      if (currentSongDetails) {
        return `${currentSongDetails.Name} - ${currentSongDetails.Artist} - ${currentSongDetails.Album}`;
      }
    }
    return '';
  };
  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
           
            </div>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="searchType"
                        value="1"
                        checked={searchType === '1'}
                        onChange={handleSearchTypeChange}
                      />
                      <label className="form-check-label">Top 5 canciones más reproducidas</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="searchType"
                        value="2"
                        checked={searchType === '2'}
                        onChange={handleSearchTypeChange}
                      />
                      <label className="form-check-label">Top 3 artistas más escuchados</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="searchType"
                        value="3"
                        checked={searchType === '3'}
                        onChange={handleSearchTypeChange}
                      />
                      <label className="form-check-label">Top 5 álbumes más reproducidos</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
      </div>
      <div className="row mt-3">
      <h4>{getCurrentSongDetails()}</h4>
            {currentSong && (
              <audio controls autoPlay>
                <source src={currentSong} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
      </div>

      <div className="row mt-3">
        <div className="col">
        <h2>Canciones</h2>
        <table className="table">
        <thead>
          <tr>
          
          <th>Reproducciones</th>
            <th>Name</th>
            <th>Idcancion</th>
            <th>Artist</th>
            <th>Idartista</th>
            <th>Album</th>
            <th>Idalbum</th>
          
          </tr>
        </thead>
        <tbody>  {data && data.length > 0 ? (

          data.map((item, index) => (
            <tr key={index}>
               <td>{item.Reproducciones}</td>
               <td>{item.Name}</td>
              <td>{item.Idcancion}</td>
              <td>{item.Artist}</td>
              <td>{item.Idartista}</td>
              <td>{item.Album}</td>
              <td>{item.Idalbum}</td>                 
             
            </tr>
           ))
           ) : (
             <tr>
               <td colSpan="7"></td>
             </tr>
           )}
        </tbody>
      </table>
        </div>
        <div className="col">
        <h2>Artistas</h2>
        <table className="table">
        <thead>
          <tr>
          <th>Reproducciones</th>
            <th>Idartista</th>
            <th>Artista</th>            
            <th>Foto</th>
            <th>Fecha Nacimiento</th>
           
          </tr>
        </thead>
        <tbody>
        {data2 && data2.length > 0 ? (
          data2.map((item, index) => (
            <tr key={index}>
               <td>{item.Reproducciones}</td>
                <td>{item.Idartista}</td>
              <td>{item.Nombre}</td>
              <td><Image src={urlaws+"/"+item.Foto}  width={150} height={150}alt="Album Cover" thumbnail /></td>
              <td>{item.Fechanac}</td>    


          
            </tr>
           ))
           ) : (
             <tr>
               <td colSpan="7"></td>
             </tr>
           )}
        </tbody>
      </table>
        </div>
        <div className="col">
       <h2>Albums</h2>
        <table className="table">
        <thead>
          <tr>  
          <th>Reproducciones</th>         
            <th>Idalbum</th>
            <th>Nombre</th>            
            <th>Descripcion</th>
            <th>Foto</th>
            <th>Artista</th>            
          </tr>
        </thead>
        <tbody>
        {data3 && data3.length > 0 ? (

          data3.map((item, index) => (
            <tr key={index}>
               <td>{item.Reproducciones}</td>
               <td>{item.Idalbum}</td>
              <td>{item.Nombre}</td>
              <td>{item.Descripcion}</td>
              <td>                <Image src={urlaws+"/"+item.Foto}  width={150} height={150} alt="Album Cover" thumbnail />
</td>    
              <td>{item.Artista}</td>    
          
            </tr>
           ))
           ) : (
             <tr>
               <td colSpan="7"></td>
             </tr>
           )}
        </tbody>
      </table>

        </div>
      </div>

    </div>
  );
};

export default ReportesForm;