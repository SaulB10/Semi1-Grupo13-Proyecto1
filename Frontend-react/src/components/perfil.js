import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Table, Button, Form, Image } from 'react-bootstrap';

import { Component } from 'react';
import  Postdata from './ApisGetPost'; // 
import Swal from 'sweetalert2'

const EditUserForm  = ({ data, pickfoto,onSubmit }) => {
  const [editedData, setEditedData] = useState(data);
  const [edit_check_date, set_edit_check_date] = useState(new Date());
  const [Foto, setFoto] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  var urlaws=global.config.i18n.awslocation

  const handleDateChange = (e) => {
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
 
    setEditedData({ ...editedData, fecha: f });

  };



  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {

      setFoto(reader.result); 

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (Foto.length>0) {
     
      editedData.foto = Foto; 
       
  
    } 

    var fotofinal="";
    if( Foto){      

      fotofinal=Foto;
      fotofinal=fotofinal.replace('data:image/png;base64,', '')
      fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
      fotofinal=fotofinal.replace('data:image/gif;base64,', '')

    

   }
    let data = {
      idUsuario: editedData.Iduser,
      nombres: editedData.firstName,
      foto: fotofinal,
      apellidos: editedData.lastName,
      correo: editedData.email,
      contraseña: editedData.password,
      fecha: editedData.fecha

    };

    console.log(JSON.stringify(data));

    var postdataf = Postdata.sendDataToServer(data, 'users/edit');
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
  
     <div className="row-2 bg-white m-1 p-3">
            
     <label htmlFor="foto"></label>
   
         <img src={urlaws+"/"+pickfoto}  width={150} height={150} alt=" Cover" thumbnail />
  
            
      </div>
      <div className="row-2 bg-white m-1 p-3">
    <h2>Datos de usuario</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
        Nombre
        </div>
      </nav>
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          value={editedData.firstName}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
       
        <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
        Apellido
        </div>
      </nav> <input
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          value={editedData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
          <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
        Email
        </div>
      </nav>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={editedData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
       <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
        Password
        </div>
      </nav>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={editedData.password}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
         <nav className="bg-dark navbar-dark navbar">
        <div className="row col-12 d-flex justify-content-center text-white">
        Fecha
        </div>
      </nav>
        <DatePicker
          className="form-control"
          selected={edit_check_date}
          onChange={handleDateChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="foto">Foto</label>
      
        <input

type="file"
className="form-control-file"
id="Foto"
name="Foto"
onChange={(e) => handlePhotoChange(e)} 


       
        />
      </div>
      <hr class="hr" />

      <button type="submit" className="btn btn-primary">
        Editar
      </button>
    </form>
</div>
    </div>

  

    
   
  );
};
 

const PerfilForm = () => {
 
       
const Iduser = localStorage.getItem('Iduser');
const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const email = localStorage.getItem('email');
const fecha = localStorage.getItem('fecha');
const foto = localStorage.getItem('foto');
const password = localStorage.getItem('Password');


let data={"Iduser":Iduser,"firstName":firstName,"lastName":lastName,
"email":email,"password":password,"fecha":fecha,"foto":foto} 



  
  
return (
<div>
 <EditUserForm data={data} pickfoto={foto} />
</div>
);
};

export default PerfilForm;
