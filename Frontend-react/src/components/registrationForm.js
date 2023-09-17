import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Swal from 'sweetalert2'
import './config';
import  Postdata from './ApisGetPost'; // 


function RegistrationForm() {
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [fecha, setFecha] = useState("");
    const [Foto, setFoto] = useState("");
    const [edit_check_date, set_edit_check_date] = useState(new Date());


    

      const  handlePhotoChange= (event) => {   
          const file = event.target.files[0];
          let reader = new FileReader();

          reader.readAsDataURL(file);
          reader.onload = function () {             
              setFoto(reader.result); 
          };
          reader.onerror = function (error) {
              console.log('Error: ', error);
          };
      }


      const handleInputDate = (e) => {  
        set_edit_check_date(e);
     
        var d = e+'';       
        d = d.split('T')[0];

        var f=   e.getFullYear()+'-'+
        e.getMonth()+'-'+
        e.getDate();
        setFecha(f);            
        console.log( f);


    };

    const handleInputChange = (e) => {

        const {id , value} = e.target;
        if(id === "firstName"){
           setFirstName(value);
             // this.firstName1=value;
        }
        if(id === "lastName"){
            setLastName(value);
             // this.lastName1=value;

        }
        if(id === "email"){
              setEmail(value);
             // this.email1=value;
        }
        if(id === "password"){
             setPassword(value);
            //  this.password1=value;
        }
        if(id === "confirmPassword"){
         setConfirmPassword(value);             
        }
        if(id === "fecha"){
            setFecha(value);            
       }
       
 
        };



    

    const handleSubmit  = () => {
 
      if( password!=confirmPassword){

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña no es igual'
          })
    }else{


      
    var fotofinal="";
    if( Foto){      

      fotofinal=Foto;
      fotofinal=fotofinal.replace('data:image/png;base64,', '')
      fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
      fotofinal=fotofinal.replace('data:image/gif;base64,', '')

    

   }
   


            let data = {    
              nombres: firstName,
              apellidos:lastName,
              correo: email,
              contraseña: password,
              confirmarContraseña: confirmPassword,
              foto: fotofinal,
              fechaNacimiento : fecha

             }

          
        
            console.log(JSON.stringify(data));
        
            var postdataf = Postdata.sendDataToServer(data, 'users/create');
            if (postdataf) {
              postdataf
                .then((response) => {
                  console.log('Response from class B:', response);
                })
                .catch((error) => {
                  console.error('There was a problem with the POST request:', error);
                });
            }



        
     //   console.log(firstName,lastName,email,password,confirmPassword);
    }
    }

    return(
        <div >
        <nav class="bg-dark navbar-dark navbar">
            <div className="row col-12 d-flex justify-content-center text-white">
                <h3>Registro</h3>
            </div>
        </nav>
        <div className="form">


            <div className="form-body">

            <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>    
              
                Nombre:
              
              
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                name="firstName"
                id="firstName"
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          

            </div>
       
            <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Apellido:</label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                name="lastName"  
                id="lastName"       
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Email:</label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                name="email"    
                id="email"           
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
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
                name="Foto"
                id="Foto"
                accept="image/*"              
                onChange={(e) => handlePhotoChange(e)} 
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
                name="password"   
                id="password"  
                onChange={(e) => handleInputChange(e)} 
              
                style={{ width: '100%' }}
              />
            </div>
          </div>


          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Repita Password:</label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="password"
                name="confirmPassword" 
                id="confirmPassword"       
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Fecha:</label>
            </div>
            <div style={{ flex: 1 }}>
            <DatePicker           
             
              dateFormat="yyyy-MM-dd"
              name="fecha" 
              id="fecha"  
              onChange={(e) => handleInputDate(e)} 
              selected={edit_check_date}

            />
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
            
            </div>
            <div style={{ flex: 1 }}>
            <button onClick={()=>handleSubmit()}class="btn btn-success" type="submit" >Registro</button>

            </div>
          </div>

          


            </div>
          
        </div>
        </div>
    )       
}

export default RegistrationForm
