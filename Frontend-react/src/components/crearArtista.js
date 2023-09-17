import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Postdata from './ApisGetPost'; // 
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import  { useState } from 'react';

function CrearArtistaForm() {
  const [formState, setFormState] = useState({
    Nombre: '',
    Foto: '',
    Fecha: ''
  });
  const [edit_check_date, set_edit_check_date] = useState(new Date());

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

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'file') {
      const file = event.target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = function () {
         setFormState({ ...formState, Foto: reader.result });
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleInputDate = (e) => {
    set_edit_check_date(e);

    var d = e + '';
    d = d.split('T')[0];

    var f =
      e.getFullYear() +
      '-' +
      e.getMonth() +
      '-' +
      e.getDate();

    console.log(f);

    setFormState({ ...formState, Fecha: f });
  };

  const handleSubmit = (event) => {
 //   event.preventDefault();

 var fotofinal="";
    if( formState.Foto){      

      fotofinal=formState.Foto;
      fotofinal=fotofinal.replace('data:image/png;base64,', '')
      fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
      fotofinal=fotofinal.replace('data:image/gif;base64,', '')

    

   }

    let data = {
      Nombre: formState.Nombre,
      Foto: fotofinal,
      FechaNacimiento: formState.Fecha,
    };

    console.log(JSON.stringify(data));

    var postdataf = Postdata.sendDataToServer(data, 'artist/create');
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
          <h3>Crear Artista</h3>
        </div>
      </nav>

      <div className="form">
              <div className="form-body">

        <div style={{ display: 'flex', marginBottom: '10px' }}>
              <div style={{ width: '120px', marginRight: '10px' }}>
                <label>Nombre:</label>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  name="Nombre"
                  id="Nombre"
                  value={formState.Nombre}
                  onChange={handleInputChange}
                  style={{ width: '100%' }}
                />
              </div>
      </div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
              <div style={{ width: '120px', marginRight: '10px' }}>
                <label>Fecha de Nacimiento:</label>
              </div>
              <div style={{ flex: 1 }}>
              <DatePicker
                dateFormat="yyyy-MM-dd"
                name="Fecha"
                id="Fecha"
                onChange={handleInputDate}
                selected={edit_check_date}
                />
              </div>
      </div>

      <div style={{ display: 'flex', marginBottom: '10px' }}>
              <div style={{ width: '120px', marginRight: '10px' }}>
                <label>Foto:</label>
              </div>
              <div style={{ flex: 1 }}>
              <input
                type="file"
                className="form-control-file"
                id="Foto"
                name="Foto"
                onChange={handlePhotoChange}
              />
              </div>
      </div>

      <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
            
            </div>
            <div style={{ flex: 1 }}>
            <button onClick={()=>handleSubmit()}class="btn btn-success" type="submit" >Crear Artista</button>

            </div>
      </div>




        </div>
     </div>
 
    </div>
  );
}

export default CrearArtistaForm;