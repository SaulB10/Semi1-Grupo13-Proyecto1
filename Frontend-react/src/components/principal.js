import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Tabs ,CustomTabPanel} from "@mui/material";
import PlaylistForm from './playlist'
import PortalForm from './portal'
import BuscarForm from './buscar'
import FavoritosForm from './favoritos'
import HistorialTabForm from './historialtab'
import RadioForm from './radio'


// or

function PrincipalForm() {
    
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
                class="btn btn-success"
              >
               Inicio
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button
              
                onClick={() => handleTabClick(1)}
                class="btn btn-success"

              >
                Buscar
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button
               
                class="btn btn-success"
                onClick={() => handleTabClick(2)}
              >
               Playlist
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button
               
                class="btn btn-success"
                onClick={() => handleTabClick(3)}
              >
               Favoritos
              </button>
            </li>

            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button               
                class="btn btn-success"
                onClick={() => handleTabClick(4)}
              >
               Historico
              </button>
            </li>

            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>

              <button               
                class="btn btn-success"
                onClick={() => handleTabClick(5)}
              >
               Radio
              </button>
            </li>

          </ul>
          <div className="tab-content">
            <div className={`tab-pane ${activeTab === 0 ? 'active' : ''}`}>
            <PortalForm/>
            </div>
            <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
            <BuscarForm/>  
            </div>
            <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`}>
            <PlaylistForm/>
            </div>
            <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`}>
                          
              <FavoritosForm/>

            </div>
            <div className={`tab-pane ${activeTab === 4 ? 'active' : ''}`}>
            <HistorialTabForm/>
              
            </div>
            <div className={`tab-pane ${activeTab === 5 ? 'active' : ''}`}>
            
            <RadioForm/>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  
</div>

      
    )       
}

export default PrincipalForm
