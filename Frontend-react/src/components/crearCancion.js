import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, Image } from 'react-bootstrap';
import  Postdata from './ApisGetPost'; // 
import './config';
import  {  useEffect } from 'react';
import Swal from 'sweetalert2'

const AddSlistForm =({ artistas }) => {
  const [formState, setFormState] = useState({
    Nombre: '',
    Duracion: '',
    Foto: null, 
    Idartista: '',
    Archivo: null,    
    SelectedId: '',
  });

 

  const handleArchivomp3 = (event) => {
    const file = event.target.files[0];


    setFormState({ ...formState, Archivo: file})

  };


  const  handlePhotoChange= (event) => {   
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {            
      setFormState({ ...formState, Foto: reader.result})

    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}


  

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
   
    const formData = new FormData();

   
    formData.append('Nombre', formState.Nombre);
    formData.append('duracion', formState.Duracion);
    formData.append('Foto', fotofinal);
    formData.append('Idartista', formState.Idartista);
    formData.append('artista', Nombreobtained);

    formData.append('track', formState.Archivo);

    for (const value of formData.values()) {
      console.log(value);
    }
    var urlconf=global.config.i18n.apiget


    
   

    fetch(urlconf+'/song/agregarcancion', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json()) // You can parse the response if needed
      .then((data) => {
        console.log('Form Submitted:', data);
        
        Swal.fire({
          icon: 'success',
          title: 'Hecho',
          text: 'accion ejecutada correctamente'
        })
      })
      .catch((error) => {
        console.error('Error occurred while submitting the form:', error);
      });
  };

  return (
    <div className="container">
      <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
          <h3>Crear Cancion</h3>
        </div>
      </nav>

      <form onSubmit={handleSubmit}>
      <div className="form-group">
           
           <div className="row">
             <div className="col">
             
             <div class="badge bg-muted text-wrap" >
             <h4>Nombre:</h4>  
   
 </div>
 
         
 
 
               </div>
               <div className="col">
                 <input
                 type="text"
                 className="form-control"
                 id="Nombre"
                 name="Nombre"                 
                 onChange={(e) =>
                  setFormState({ ...formState, Nombre: e.target.value })
                }
              

               />
               </div>
 
             </div>
 
 
      
           </div>
           <div className="form-group">
 
                        
           <div className="row">
             <div className="col">
             <div class="badge bg-muted text-wrap" >
             <h4>Duracion:</h4>  
   
 </div>
 
 
            
 
               </div>
               <div className="col">
               <input
               type="text"
               className="form-control"
               id="Duracion"
               name="Duracion"
               onChange={(e) =>
                setFormState({ ...formState, Duracion: e.target.value })
              }
              
             />
               </div>
 
             </div>
 
 
 
            
           </div>
           <div className="form-group">
 
           <div className="row">
             <div className="col">
          
             <div class="badge bg-muted text-wrap" >
             <h4>Foto:</h4>  
   
 </div>
               </div>
               <div className="col">
               <input
               type="file"
               className="form-control-file"
               id="Foto"
               name="Foto"
               onChange={(e) => handlePhotoChange(e)} 
               />
               </div>
 
             </div>
 
 
 
            
           </div>
           <div className="form-group">
 
           <div className="row">
             <div className="col">
           
             <div class="badge bg-muted text-wrap" >
             <h4>Selecciona un Artista:</h4>  
   
 </div>
               </div>
               <div className="col">
             
               <Form.Control
                  as="select"    
                    
                  onChange={(e) =>
                    setFormState({ ...formState, Idartista: e.target.value})
                  }
                >
                  {artistas.map((artista) => (
                    <option key={artista.Idartista} value={artista.Idartista}>
                      {artista.Nombre}
                    </option>
                  ))}
                </Form.Control>
 
 
               </div>
 
 
               <div className="form-group">
 
 <div className="row">
   <div className="col">
 
   <div class="badge bg-muted text-wrap" >
   <h4>Archivo de audio:</h4>  
 
 </div>
     </div>
     <div className="col">
     <input
               type="file"
               className="form-control-file"
               id="Foto"
               name="Foto"
               onChange={(e) => handleArchivomp3(e)} 
               />


     </div>
 
   </div>
 
 
 
  
 </div>
 
 
 
 
 
             </div>
 
 
 
           
           </div>
           <button type="submit" className="btn btn-success">Crear Cancion</button>
         </form>
  
    </div>
  );
};
/*const CrearCancionForm = () => {
 
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
};*/

const CrearCancionForm = () => {
 
  
  const [artistas, setArtistas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // To track whether data is loading

  
  const handleSubmit = (e) => {
  // e.preventDefault();

 };
 var urlconf=global.config.i18n.apiget

 useEffect(() => {

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

export default CrearCancionForm;