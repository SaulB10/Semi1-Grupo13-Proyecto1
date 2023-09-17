

import React, { useState } from 'react';
import { Table, Button, Form, Image } from 'react-bootstrap';
import UserProfile from './UserProfile';
import  Postdata from './ApisGetPost'; // 
import Swal from 'sweetalert2'
import  { useEffect } from 'react';
import './config';

const AlbumTable = ({ albums, artistas,urlbucket }) => {

  const [editing, setEditing] = useState(false);
  const [editedAlbum, setEditedAlbum] = useState({});
  const [selectedArtist, setselectedArtist] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image as a File object
  const [Foto, setFoto] = useState("");

  const handleEdit = (album) => {
    setEditedAlbum({ ...album });
    setSelectedImage(null);
    setEditing(true);
  };
  const handleDelete = (Idalbum) => {
   
    const Password = localStorage.getItem('Password');

    let data = {    
      Idalbum:  Idalbum,
      password:Password
     }
    
     console.log('Introduzca o');
     console.log(JSON.stringify(data));


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
var postdataf= Postdata.sendDataToServer(data,"album/borraralbum")
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
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
  const handleDiscard = () => {
    setEditedAlbum({});
    setEditing(false);
  };
  
  const handleSubmit = async () => {
    try {

      var updatedAlbum = {
        Nombre: '',
        Descripcion: '',
        Foto: '',
        Artista: '',
        Idartista: '',
      };
    
      const getNombreById = (id) => {
        const artist = artistas.find((artist) => artist.Idartista === id);
        return artist ? artist.Nombre : null;
      };
    
      var Nombreobtained = getNombreById(editedAlbum.Idartista);
    
      
      updatedAlbum.Nombre = editedAlbum.Nombre || '';
      updatedAlbum.Descripcion = editedAlbum.Descripcion || '';
    
      updatedAlbum.Artista = Nombreobtained || '';

      updatedAlbum.Idartista = editedAlbum.Idartista || '';


      if (Foto.length>0) {
       
          updatedAlbum.Foto = Foto; // Store the base64 string
         
    
      } else {
        updatedAlbum.Foto = editedAlbum.Foto || '';
      
      }


      var fotofinal="";
      if( updatedAlbum.Foto){      
  
        fotofinal=updatedAlbum.Foto;
        fotofinal=fotofinal.replace('data:image/png;base64,', '')
        fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
        fotofinal=fotofinal.replace('data:image/gif;base64,', '')
  
      
  
     }
      let data = {    
        Idalbum:  editedAlbum.Idalbum,
        Nombre: editedAlbum.Nombre,
        Descripcion:editedAlbum.Descripcion,            
        foto: fotofinal,
        Idartista: editedAlbum.Idartista,
        Artista:Nombreobtained, 
       }

var postdataf= Postdata.sendDataToServer(data,"album/editaralbum")
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




    } catch (error) {
      console.error('Error occurred while editing and saving album', error);
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Foto</th>
          <th>Artista</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {albums.map((album) => (
          <tr key={album.Idalbum}>
            <td>
              {editing && editedAlbum.Idalbum === album.Idalbum ? (
                <Form.Control
                  type="text"
                  value={editedAlbum.Nombre}
                  onChange={(e) =>
                    setEditedAlbum({ ...editedAlbum, Nombre: e.target.value })
                  }
                />
              ) : (
                album.Nombre
              )}
            </td>
            <td>
              {editing && editedAlbum.Idalbum === album.Idalbum ? (
                <Form.Control
                  type="text"
                  value={editedAlbum.Descripcion}
                  onChange={(e) =>
                    setEditedAlbum({
                      ...editedAlbum,
                      Descripcion: e.target.value,
                    })
                  }
                />
              ) : (
                album.Descripcion
              )}
            </td>
            <td>
              {editing && editedAlbum.Idalbum === album.Idalbum ? (
              
                <input
                type="file"
                className="form-control-file"
                id="Foto"
                name="Foto"
                onChange={(e) => handlePhotoChange(e)} 
              />

              ) : (
                <Image src={urlbucket+"/"+album.Foto}  width={150} height={150} alt="Album Cover" thumbnail />

              )}
            </td>
            <td>
              {editing && editedAlbum.Idalbum === album.Idalbum ? (
                <Form.Control
                  as="select"
                  value={editedAlbum.Artista}
                  onChange={(e) =>
                    setEditedAlbum({ ...editedAlbum, Artista: e.target.value, Idartista: e.target.value})
                  }
                >
                  {artistas.map((artista) => (
                    <option key={artista.Idartista} value={artista.Idartista}>
                      {artista.Nombre}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                artistas.find((artista) => artista.Idartista === album.Idartista)?.Nombre

              )}
            </td>
            <td>
              {editing && editedAlbum.Idalbum === album.Idalbum ? (
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
                    onClick={() => handleEdit(album)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button variant="danger"  onClick={() => handleDelete(album.Idalbum)}
                  >Delete</Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};


const DetalleAlbumForm = () => {
 
  const [artistas, setArtistas] = useState([]);
  const [albums, setAlbums] = useState([]);
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
    })
    .catch((error) => {
      console.error('Error fetching artistas:', error);
    });

  fetch(urlconf+'/album/album')
    .then((response) => response.json())
    .then((data) => {

      setAlbums(data.albums);
      setIsLoading(false); // 
    })
    .catch((error) => {
      console.error('Error fetching albums:', error);
      setIsLoading(false); // 
    });
}, []); 

if (isLoading) {
  return <div>Loading data...</div>; // 
}



 /*
useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((data) => {

      const newDataObject = data.map((item) => ({
      
        Nombre: item.title,
        Idartista: item.id,
        Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg==",
         Fechanac: "2023-7-15" 

      }));


      setArtistas(newDataObject);
    })
    .catch((error) => {
      console.error('Error fetching artistas:', error);
    });

  fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((data) => {

      const newDataObject = data.map((item) => ({
        Idartista: item.id,
        Nombre: item.title,
        Idartista: item.userId,
        Descripcion:"album de prueba", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
        Artista: "Luis miguel"

      }));


      setAlbums(newDataObject);
      setIsLoading(false); // Mark data as loaded
    })
    .catch((error) => {
      console.error('Error fetching albums:', error);
      setIsLoading(false); // Mark data as loaded even on error
    });
}, []); // Empty dependency array to fetch data only once when the component mounts




 const   artistas = [
  { Idartista: "3", Nombre: "luis miguel", Foto: "xxx64base", Fechanac: "2023-7-15" },
  { Idartista: "4", Nombre: "Rocio durcal", Foto: "xxx64base", Fechanac: "2023-6-15" },
  { Idartista: "6", Nombre: "rocardo montaner", Foto: "xxx64base", Fechanac: "2023-7-15" }
];
   
const albums = [
    
{  Idalbum:"33",Nombre: "reggaeton 2033",Descripcion:"album de prueba", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",Artista: "Luis miguel",Idartista:"3"},
{  Idalbum:"34",Nombre: "para todos",Descripcion:"album de prueba 3", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg==",Artista: "Rocio durcal",Idartista:"4"},
{  Idalbum:"36",Nombre: "Confie en ti",Descripcion:"para todos ", Foto:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",Artista: "rocardo montaner",Idartista:"6"}

  ]*/
       
 var urlaws=global.config.i18n.awslocation

  
  
return (
<div>
 <AlbumTable albums={albums} artistas={artistas} urlbucket={urlaws} onSubmit={handleSubmit} />
</div>
);
};

export default DetalleAlbumForm;
