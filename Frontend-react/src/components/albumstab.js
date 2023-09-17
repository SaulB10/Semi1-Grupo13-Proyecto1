import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CrearAlbumForm from './crearAlbum'
import AgregarCancionAlbumForm from './agregarcancionAlbum'
import BorrarcancionAlbumForm  from './borrarcancionAlbum'
import DetalleAlbumForm  from './detalleAlbum'



// or

function AlbumsTabForm() {
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [fecha, setFecha] = useState("");
    const [foto, setFoto] = useState("");

    const handlePhotoChange = (event) => {
        const {id , value} = event.target.files[0];
        if(id === "foto"){
            setFoto(value);                
       }
      }
      const handleInputDate = (e) => {       
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

        let data = {    
            firstName: firstName,
            lastName:lastName,
            email: email,
            password: password,
            confirmPassword: password,
            fecha: fecha,
            foto: foto
         }
         var finalFormEndpoint='localhost:3000/registro';
        fetch(finalFormEndpoint, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (response.status !== 200) {
                throw new Error(response.statusText);
              }
      
              return response.json();
            })
            .then(() => {
                console.log("We'll be in touch soon.");
                console.log('success');
            })
            .catch((err) => {
                console.log(err.toString());
                console.log('error');
         });
         console.log('data out');

         console.log(JSON.stringify(data));
     //   console.log(firstName,lastName,email,password,confirmPassword);

    }
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (tabIndex) => {
      setActiveTab(tabIndex);
    };

    

    return(
      <div >
          <div className="container">
      <div className="row mt-3">
        <div className="col">
          <ul className="nav nav-tabs">
            <li className="nav-item">
             

              <button
             
                onClick={() => handleTabClick(0)}
                class="btn btn-primary"
              >
               Crear Album
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button
              
                onClick={() => handleTabClick(1)}
                class="btn btn-primary"

              >
               Agregar cancion
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button
               
                class="btn btn-primary"
                onClick={() => handleTabClick(2)}
              >
               Borrar cancion
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button
               
                class="btn btn-primary"
                onClick={() => handleTabClick(3)}
              >
              Ver Albums   
              </button>
            </li>
           

          </ul>
          <div className="tab-content">
            <div className={`tab-pane ${activeTab === 0 ? 'active' : ''}`}>          
            <CrearAlbumForm/>    
            
            </div>
            <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
            <AgregarCancionAlbumForm/>            
            </div>
            <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`}>
            <BorrarcancionAlbumForm/>           
                
            </div>
            <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`}>
                        
            <DetalleAlbumForm/>           
          
            </div>
          

          </div>
        </div>
      </div>
    </div>
  
</div>

      
    )       
}

export default AlbumsTabForm
