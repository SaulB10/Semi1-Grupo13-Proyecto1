import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Postdata from './ApisGetPost';
import './config';

const AddSlistForm  =({ artistas }) => {

  const [formState, setFormState] = useState({
    Nombre: '',
    Descripcion: '',
    Foto: '',
    Idartista: '',
  });


  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'file') {
      setFormState({ ...formState, Foto: event.target.files[0] });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {

       setFormState({ ...formState, Foto: reader.result });
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const handleSelectChange = (event) => {
    setFormState({ ...formState, Idartista: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const getNombreById = (id) => {
      const artist = artistas.find((artist) => artist.Idartista === id);
      return artist ? artist.Nombre : null;
    };

    const Nombreobtained = getNombreById(formState.Idartista);
   var fotofinal="";
    if( formState.Foto){      

      fotofinal=formState.Foto;
      fotofinal=fotofinal.replace('data:image/png;base64,', '')
      fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
      fotofinal=fotofinal.replace('data:image/gif;base64,', '')

    

   }
    let data = {
      Nombre: formState.Nombre,
      Descripcion: formState.Descripcion,
      Foto: fotofinal,
      Idartista: formState.Idartista,
      Artista: Nombreobtained
    };

    console.log(JSON.stringify(data));

    var postdataf = Postdata.sendDataToServer(data, 'album/crearalbum');
    if (postdataf) {
      postdataf
        .then((response) => {
          console.log('Response from class B:', response);
        })
        .catch((error) => {
          console.error('There was a problem with the POST request:', error);
        });
    }
  };

  return (
    <div className="container">
      <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
          <h3>Crear Album</h3>
        </div>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <div className="badge bg-muted text-wrap">
                <h4>Nombre:</h4>
              </div>
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="Nombre"
                name="Nombre"
                value={formState.Nombre}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <div className="badge bg-muted text-wrap">
                <h4>Descripcion:</h4>
              </div>
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                id="Descripcion"
                name="Descripcion"
                value={formState.Descripcion}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <div className="badge bg-muted text-wrap">
                <h4>Foto:</h4>
              </div>
            </div>
            <div className="col">
              <input
                type="file"
                className="form-control-file"
                id="Foto"
                name="Foto"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <div className="badge bg-muted text-wrap">
                <h4>Selecciona un Artista:</h4>
              </div>
            </div>
            <div className="col">
              <select
                className="form-control"
                id="Idartista"
                name="Idartista"
                value={formState.Idartista}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione un Artista</option>
                {artistas.map((artista) => (
                  <option key={artista.Idartista} value={artista.Idartista}>
                    {artista.Nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-success">
          Crear Album
        </button>
      </form>
    </div>
  );
}
/*const CrearAlbumForm = () => {
 
  const artistas = [
    { Idartista: "3", Nombre: "luis miguel", Foto: "xxx64base", Fechanac: "2023-7-15" },
    { Idartista: "4", Nombre: "Rocio durcal", Foto: "xxx64base", Fechanac: "2023-6-15" },
    { Idartista: "6", Nombre: "rocardo montaner", Foto: "xxx64base", Fechanac: "2023-7-15" }
  ];
  return (
    <div>
      <AddSlistForm artistas={artistas}  />
    </div>
  );
};
*/
const CrearAlbumForm = () => {
 
  const [artistas, setArtistas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  
  const handleSubmit = (e) => {
  // e.preventDefault();

 };
 var urlconf=global.config.i18n.apiget

 useEffect(() => {
  // Fetch artistas data from the API
  fetch(urlconf+'/artist/artista')
    .then((response) => response.json())
    .then((data) => {

      setArtistas(data.artistas);
      setIsLoading(false); 
    })
    .catch((error) => {
      console.error('Error fetching artistas:', error);
    });


 
}, []); 


if (isLoading) {
  return <div>cargando datos...</div>; 
}
       


  return (
    <div>
      <AddSlistForm artistas={artistas}  />
    </div>
  );
};

export default CrearAlbumForm;