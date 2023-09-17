import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Swal from 'sweetalert2'
import  Postdata from './ApisGetPost'; // 


function CrearplaylistForm() {
    
    const [Nombre, setNombre] = useState("");
    const [Descripcion, setDescripcion] = useState("");   
    const [Foto, setFoto] = useState("");
  
   
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



    const handleInputChange = (e) => {

        const {id , value} = e.target;
        if(id === "Nombre"){
           setNombre(value);
             // this.firstName1=value;
        }
        if(id === "Descripcion"){
            setDescripcion(value);
             // this.lastName1=value;
        }
       
 
        };



    

    const handleSubmit  = () => {
      var fotofinal="";
      if( Foto){      
  
        fotofinal=Foto;
        fotofinal=fotofinal.replace('data:image/png;base64,', '')
        fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
        fotofinal=fotofinal.replace('data:image/gif;base64,', '')
  
      
  
     }

      const userstorage = localStorage.getItem('Iduser');


            let data = {    
              Iduser: userstorage,
              Nombre: Nombre,
              Descripcion:Descripcion,            
              foto: fotofinal
             }

  // SendPost(data);
  var postdataf= Postdata.sendDataToServer(data,"playlist/crearplaylist")
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


        
        
     //   console.log(firstName,lastName,email,password,confirmPassword);

    }

    return(
        <div >
        <nav class="bg-dark navbar-dark navbar">
            <div className="row col-12 d-flex justify-content-center text-white">
                <h3>Crear playlist</h3>
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
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          

            </div>
       
            <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Descripcion:</label>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                name="Descripcion"  
                id="Descripcion"       
                onChange={(e) => handleInputChange(e)} 
                style={{ width: '100%' }}
              />
            </div>
          </div>

        

          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={{ width: '120px', marginRight: '10px' }}>
              <label>Fondo de pantalla:</label>
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
            
            </div>
            <div style={{ flex: 1 }}>
            <button onClick={()=>handleSubmit()}class="btn btn-success" type="submit" >Crear</button>

            </div>
          </div>

          


            </div>
          
        </div>
        </div>   
    )       
}

export default CrearplaylistForm
