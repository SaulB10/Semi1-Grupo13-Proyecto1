import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import UserProfile from './UserProfile';
import  Postdata from './ApisGetPost'; // 
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'


function LoginForm() {
    
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Iduser, setIduser] = useState("");

    
   

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "Email"){
           setEmail(value);
             // this.firstName1=value;
        }
        if(id === "Password"){
            setPassword(value);
             // this.lastName1=value;

        }
      
       
        };



        const navigate = useNavigate();


    const handleSubmit  = () => {
/** 
        let data = {    
          Email: Email,         
          Password: Password
         }


        // UserProfile.setName(User);
         //UserProfile.setPassword(Password);
         localStorage.setItem('Email', Email);
         localStorage.setItem('Password', Password);
         localStorage.setItem('Iduser', '4');

*/
       
         try {
        
        
          let data = {
            email: Email,
            password:Password
      
          };
         
          var urlconf=global.config.i18n.apiget
          console.error('urlconf:', urlconf);


   fetch(urlconf+'/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), 
  })
    .then((response) => response.json())
    .then((data) => {
      console.error('listadoplaylistuser albums:', data);

      const { idUsuario, Nombre, Apellidos, Foto, Fecha_Nacimiento } =  data;

      localStorage.setItem('Iduser', idUsuario);
      localStorage.setItem('firstName', Nombre);
      localStorage.setItem('lastName', Apellidos);
      localStorage.setItem('email', Email);
      localStorage.setItem('fecha', Fecha_Nacimiento);
      localStorage.setItem('foto', Foto);
      localStorage.setItem('Password', Password);
      navigate('/Portal');

    })
    .catch((error) => {
      console.error('Error fetching albums:', error);
    });

  } catch (error) {

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrio un error, revise sus credenciales o checkee su conexion'
    })

    console.error('Error occurred while editing and saving album', error);
  }




    }

    return(
        <div >
        <nav class="bg-dark navbar-dark navbar">
            <div className="row col-12 d-flex justify-content-center text-white">
                <h3>Login</h3>
            </div>
        </nav>
        <div className="form">


            <div className="form-body">

            <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Email:</label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                name="Email"
                id="Email"
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          

            </div>
       
            <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Password:</label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="password"
                name="Password"  
                id="Password"       
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          </div>

         
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
            
            </div>
            <div style={{ flex: 1 }}>
            <button onClick={()=>handleSubmit()}class="btn btn-success" type="submit" >Login</button>

            </div>
          </div>

          


            </div>
          
        </div>
        </div>
    )       
}

export default  LoginForm

