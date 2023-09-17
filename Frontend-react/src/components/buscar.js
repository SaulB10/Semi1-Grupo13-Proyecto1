import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // 
import { Table, Button, Form, Image } from 'react-bootstrap';
const BuscarForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [searchResults3, setSearchResults3] = useState([]);
  const [urlbucket, setUrlbucket] = useState([]);

  const apiUrl = 'http://localhost:3000/search/';
  const [searchType, setSearchType] = useState('song');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      var datoabuscar='buscarcancion';
      if(searchType==2)datoabuscar='buscarartista';
      if(searchType==3)datoabuscar='buscaralbum';  
 
        var urlconf=global.config.i18n.apiget

        setUrlbucket(global.config.i18n.awslocation);
      const response = await fetch(urlconf+"/search/"+datoabuscar, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entrada: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if(searchType==1)setSearchResults(data.canciones);
      if(searchType==2)setSearchResults2(data);
      if(searchType==3)setSearchResults3(data);
 
    
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
         <div className="row mt-3">
         <div className="col">
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
                      <label className="form-check-label">Buscar por Cancion</label>
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
                      <label className="form-check-label">Buscar por Artista</label>
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
                      <label className="form-check-label">Buscar por Album</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            <div className="col">
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      </div>



            </div>
      <div className="row mt-3">
        <div className="col">
        <nav class="bg-dark navbar-dark navbar">
            <div className="row col-4 d-flex justify-content-center text-white">
                <h3>canciones</h3>
            </div>
        </nav>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Artista</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((song) => (
            <tr key={song.Idcancion}>
              <td>{song.Name}</td>
              <td>{song.Artist}</td>
              <td>{song.Url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="col">
    <nav class="bg-dark navbar-dark navbar">
            <div className="row col-4 d-flex justify-content-center text-white">
                <h3>Artistas</h3>
            </div>
        </nav>
<table className="table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Foto</th>
      <th>Fechanac</th>
    </tr>
  </thead>
  <tbody>
    {searchResults2.map((song) => (
      <tr key={song.Idartista}>
        <td>{song.Nombre}</td>
        <td><Image src={urlbucket+"/"+song.Url}  width={150} height={150} alt="Album Cover" thumbnail /></td>
        <td>{song.Fecha_Nacimiento}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>


    </div> 


    <div className="row mt-3">
    <nav class="bg-dark navbar-dark navbar">
            <div className="row col-4 d-flex justify-content-center text-white">
                <h3>Albums</h3>
            </div>
        </nav>
    <table className="table">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Foto</th>
      <th>Descripcion</th>
      { //<th>IdArtista</th>
      }
    </tr>
  </thead>
  <tbody>
    {searchResults3.map((song) => (
      <tr key={song.IdAlbum}>
        <td>{song.Nombre}</td>
        <td><Image src={urlbucket+"/"+song.Foto}  width={150} height={150} alt="Album Cover" thumbnail /></td>
        <td>{song.Descripcion}</td>
        { //<td>{song.IdArtista}</td>
      } 
      </tr>
    ))}
  </tbody>
</table>
    </div>
    </div>
  );
};

export default BuscarForm;