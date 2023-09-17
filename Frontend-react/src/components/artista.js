import React, {useState,setState} from 'react';
import './style.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import DetalleArtistaForm from './detalleArtista'
import  CrearArtistaForm from './crearArtista'; // 



function ArtistaForm() {
    
    const [Nombre, setNombre] = useState("");
    const [Fecha, setFecha] = useState("");
    const [Foto, setFoto] = useState("");

    const [edit_check_date, set_edit_check_date] = useState(new Date());


    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "Nombre"){
          setNombre(value);
       
        }
             
        };

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
 

    

    const handleSubmit  = () => {


      



        let data = {    
          Nombre: Nombre,         
          Fecha: Fecha,
          Foto: Foto

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
                class="btn btn-info"
              >
               Artista
              </button>
            </li>
            <li className="nav-item">
            <button  class="btn btn-muted  ">  </button>
              <button
              
                onClick={() => handleTabClick(1)}
                class="btn btn-info  "

              >
                Detalle
              </button>
            </li>
           
          </ul>
          <div className="tab-content">
          <div className={`tab-pane ${activeTab === 0 ? 'active' : ''}`}>          
            <CrearArtistaForm/>    
            
           

            </div>
            <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
            <DetalleArtistaForm/>    

            </div>
          
          </div>
        </div>
      </div>
    </div>
        </div>
    )       
}

export default  ArtistaForm

