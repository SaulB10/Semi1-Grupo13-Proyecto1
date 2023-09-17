import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Table, Button, Form, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import  Postdata from './ApisGetPost'; // 
import  { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2'
import './config';
import  {  useEffect } from 'react';

const ArtistTable = ({ artistas,urlbucket}) => {
  const [editing, setEditing] = useState(false);
  const [editedAlbum, setEditedAlbum] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image as a File object
  const [Foto, setFoto] = useState("");
  const [edit_check_date, set_edit_check_date] = useState(new Date());

  const handleEdit = (album) => {
    setEditedAlbum({ ...album });
    setSelectedImage(null);
    setEditing(true);
  };
  const handleDiscard = () => {
    setEditedAlbum({});
    setEditing(false);
  };
  const handleDelete = (Idalbum) => {

    handleDeleteClick(Idalbum)


  };

  
  const handleSubmit = async () => {
    try {
    
      let phototake = null;
  
      if (Foto.length>0) {
       
        editedAlbum.Foto = Foto; // 
         
    
      } 
      var fotofinal="";
      if( editedAlbum.Foto){      
  
        fotofinal=editedAlbum.Foto;
        fotofinal=fotofinal.replace('data:image/png;base64,', '')
        fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
        fotofinal=fotofinal.replace('data:image/gif;base64,', '')
  
      
  
     }
      const data = {
        idArtista: editedAlbum.Idartista,
        Nombre: editedAlbum.Nombre,
        foto: fotofinal,
        FechaNacimiento: editedAlbum.Fecha // Format date as yyyy-MM-dd
      };
  
      console.log(JSON.stringify(data));

      const postdataf = Postdata.sendDataToServer(data, 'artist/edit');
      if (postdataf) {
        postdataf
          .then((response) => {

            console.log('Response from class B:', response);
          })
          .catch((error) => {
          
            console.error('There was a problem with the POST request:', error);
          });
      }


    } catch (error) {
      console.error('Error occurred while editing and saving album', error);
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
    setEditedAlbum({
      ...editedAlbum,
      Fecha: f,
    })


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

  const handleDeleteClick = (id) => {
  
    console.log('editedAlbum.Idartista: ', id);

     const Password = localStorage.getItem('Password');

     let data = {    
      idArtista: id  ,
      password:Password  
     }

     Swal.fire({
      title: 'Introduzca el password de su usuario',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        if(login==Password){
          Swal.fire({
            icon: 'success',
            title: 'Hecho',
            text: 'Cambio hecho correctamente'
          })

var postdataf= Postdata.sendDataToServer(data,"artist/delete")
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


        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
     
    })





  };

  return (
    <div>
      <h2>Artistas disponibles</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de Nacimiento</th>
            <th>Foto</th>
            <th>Editar</th>
           
          </tr>
        </thead>
        <tbody>
          {artistas.map((artist) => (
            <tr key={artist.Idartista}>
              <td>
                {artist.Idartista === editedAlbum.Idartista ? (
                  <input
                    type="text"
                    value={editedAlbum.Nombre}
                    onChange={(e) =>
                      setEditedAlbum({
                        ...editedAlbum,
                        Nombre: e.target.value,
                      })
                    }
                  />
                ) : (
                  artist.Nombre
                )}
              </td>
              <td>
                {artist.Idartista === editedAlbum.Idartista ? (
                  <DatePicker
                  selected={edit_check_date}
                 
                    onChange={(date) => handleInputDate(date)}
                    dateFormat="yyyy-MM-dd"
                  />
                ) : (
                  artist.Fechanac
                )}
              </td>
              <td>
                {artist.Idartista ===  editedAlbum.Idartista ? (
    


<input
type="file"
className="form-control-file"
id="Foto"
name="Foto"
onChange={(e) => handlePhotoChange(e)} 
/>




                ) : (

                  <Image src={urlbucket+"/"+artist.Foto}  width={150} height={150} alt="Album Cover" thumbnail />

               
                )}
              </td>
              <td>
                {artist.Idartista ===  editedAlbum.Idartista ? (
                   <>
                   <Button
                     variant="success"
                     onClick={handleSubmit}
                     className="mr-2"
                   >
                     Save
                   </Button>
                   <Button variant="secondary" onClick={handleDiscard}>
                     Discard
                   </Button>
                 </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(artist)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button variant="danger"  onClick={() => handleDelete(artist.Idartista)}
                    >Delete</Button>
                  </>
                )}
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/*
const DetalleArtistaForm = () => {

  const   artistas = [
            
  {  Idartista:"3",Nombre: "juan gabriel",    "Foto":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",Fechanac: "2023-7-15"},
  {  Idartista:"4",Nombre: "Rocio durcal ","Foto":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",Fechanac: "2023-6-14"}
    ]
  

return (
  <div>
   <ArtistTable artistas={artistas}  />
  </div>
  );
};
*/ 
const DetalleArtistaForm = () => {

  const [artistas, setArtistas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  
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
var urlaws=global.config.i18n.awslocation

  return (
    <div>
     <ArtistTable artistas={artistas} urlbucket={urlaws} />
    </div>
    );
  };

 


export default DetalleArtistaForm;