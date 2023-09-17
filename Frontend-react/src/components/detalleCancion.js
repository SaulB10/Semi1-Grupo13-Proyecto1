

import React, { useState } from 'react';
import { Table, Button, Form, Image } from 'react-bootstrap';
import UserProfile from './UserProfile';
import  Postdata from './ApisGetPost'; // 
import Swal from 'sweetalert2'
import './config';
import  {  useEffect } from 'react';

const AlbumTable = ({ canciones, artistas,urlbucket }) => {
  const [editing, setEditing] = useState(false);
  const [editedAlbum, setEditedAlbum] = useState({});
  const [selectedArtist, setselectedArtist] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image as a File object
  const [Foto, setFoto] = useState("");
  const [file, setFile] = useState();

  const handleEdit = (album) => {
    setEditedAlbum({ ...album });
    setSelectedImage(null);
    setEditing(true);
  };
  const handleDelete = (Idcancion) => {
    console.log('Idcancion a borrar es : ', Idcancion);
  

     let data = {    
      Idcancion:  Idcancion
     
      }
    
      

     const Password = localStorage.getItem('Password');




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

var postdataf= Postdata.sendDataToServer(data,"song/borrarcancion")
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

  const handleArchivomp3b = (event) => {
    const file = event.target.files[0];

    setEditedAlbum({ ...editedAlbum, Archivo: file})


  };

  const  handleArchivomp3= (event) => {   
 
    const file2 = event.target.files[0];
              
      setEditedAlbum({ ...editedAlbum, Archivo: file2})
      setFile(file2);

}

  const  handlePhotoChange= (event) => {   
    const file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {            
      setEditedAlbum({ ...editedAlbum, Foto: reader.result})

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
        duracion: '',
        Foto: '',
        Artista: '',
        track: '',
        Idartista: '',
      };
    
      const getNombreById = (id) => {
        const artist = artistas.find((artist) => artist.Idartista === id);
        return artist ? artist.Nombre : null;
      };
    
      const Nombreobtained = getNombreById(editedAlbum.Idartista);
    
  
      updatedAlbum.Nombre = editedAlbum.Nombre || '';
      updatedAlbum.duracion = editedAlbum.duracion || '';
    
      updatedAlbum.Artista = Nombreobtained || '';
      updatedAlbum.Foto = editedAlbum.Foto || '';
      updatedAlbum.Archivo = editedAlbum.Archivo || '';

      updatedAlbum.Idartista = editedAlbum.Idartista || '';

      

      const formData = new FormData();
      var fotofinal="";
      if( updatedAlbum.Foto){      
  
        fotofinal=updatedAlbum.Foto;
        fotofinal=fotofinal.replace('data:image/png;base64,', '')
        fotofinal=fotofinal.replace('data:image/jpeg;base64,', '')
        fotofinal=fotofinal.replace('data:image/gif;base64,', '')
  
      
  
     }
      formData.append('Nombre', updatedAlbum.Nombre);
      formData.append('duracion', updatedAlbum.duracion );
      formData.append('Foto', fotofinal);  
      formData.append('artista', updatedAlbum.Artista);
    formData.append('track', updatedAlbum.Archivo);    

      formData.append('Idartista', updatedAlbum.Idartista);
      formData.append('Idcancion', editedAlbum.Idcancion);
      
      for (const value of formData.values()) {
        console.log(value);
      }
      var urlconf=global.config.i18n.apiget

      fetch(urlconf+'/song/editarcancion', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json()) //
        .then((data) => {
          console.log('Form Submitted:', data);
          Swal.fire({
            icon: 'success',
            title: 'Hecho',
            text: 'accion ejecutada correctamente'
          })
        })
        .catch((error) => {
          console.error('Error occurred while submitting the form:', error);
        });




    } catch (error) {
      console.error('Error occurred while editing and saving album', error);
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Duracion</th>
          <th>Foto</th>
          <th>Artista</th>
          <th>Archivo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {canciones.map((album) => (
          <tr key={album.Idcancion}>
            <td>
              {editing && editedAlbum.Idcancion === album.Idcancion ? (
                <Form.Control
                  type="text"
                  value={editedAlbum.Nombre}
                  onChange={(e) =>
                    setEditedAlbum({ ...editedAlbum, Nombre: e.target.value })
                  }
                />
              ) : (
                album.Name
              )}
            </td>
            <td>
              {editing && editedAlbum.Idcancion === album.Idcancion ? (
                <Form.Control
                  type="text"
                  value={editedAlbum.duracion}
                  onChange={(e) =>
                    setEditedAlbum({
                      ...editedAlbum,
                      duracion: e.target.value,
                    })
                  }
                />
              ) : (
                album.duracion
              )}
            </td>
            <td>
              {editing && editedAlbum.Idcancion === album.Idcancion ? (
              
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
              {editing && editedAlbum.Idcancion === album.Idcancion ? (
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
              {editing && editedAlbum.Idcancion === album.Idcancion ? (
              
                <input
                type="file"
                className="form-control-file"
                id="Archivo"
                name="Archivo"
                onChange={(e) => handleArchivomp3(e)} 
              />

              ) : (
                album.Url

              )}
            </td>

            
            <td>
              {editing && editedAlbum.Idcancion === album.Idcancion ? (
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
                  <Button variant="danger"  onClick={() => handleDelete(album.Idcancion)}
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

/*
const DetalleCancionForm = () => {
 
       
  const handleSubmit = (e) => {
  // e.preventDefault();

 };
 const   artistas = [
  { Idartista: "18", Nombre: "thalia", Foto: "xxx64base", Fechanac: "2023-7-15" },
  { Idartista: "14", Nombre: "madonna", Foto: "xxx64base", Fechanac: "2023-6-15" },
  { Idartista: "13", Nombre: "FEY", Foto: "xxx64base", Fechanac: "2023-7-15" },
  { Idartista: "11", Nombre: "Bronco", Foto: "xxx64base", Fechanac: "2023-7-15" }

];
const canciones = [
 
  {  Idcancion: "1", Nombre: "Is me again", duracion: "3:33" , Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg=="   ,Artist: "thalia", Idartista: "18", Album: "Full" , Url: "song3.mp3"},
 { Idcancion: "2", Nombre: "sunshine", duracion: "3:55", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg=="   , Artist: "madonna", Idartista: "14" , Album: "my life2", Url: "song7.mp3"},
  { Idcancion: "3", Nombre: "paro", duracion: "4:11", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=", Artist: "thalia", Idartista: "18" , Album: "my life3", Url: "song9.mp3"},
  { Idcancion: "4", Nombre: "sunshine4", duracion: "8:56", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=", Artist: "FEY", Idartista: "13" , Album: "", Url: "song2.mp3"},
 { Idcancion: "5", Nombre: "te ame", duracion: "8:11", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg=="   , Artist: "thalia", Idartista: "18" , Album: "my life8", Url: "song11.mp3"},
  { Idcancion: "27", Nombre: "ella baila sola", duracion: "6:09", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAIAAACA18GRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADbUlEQVQ4y62UXUhTYRjHvZYuyyIhCfTCFIpFFyGtTIsCQ0dlJCSKF6J2MdAuvGgVZh8EEpYfBSKSzWqEhSFo0UbZprMvGahlWvjVXImaiaa50+/dM85m2l2H/8b7PM///3+f87znnAjt/10R/M7c6q5+P1nc4g0HmYWFxY+Dw2kZp7YbUgCL8xZLj6d/TTImQa9dFWOrQb72Zs3e/em48A/E8V/kkNeJjiWQ2DQrtVizS9rBIiu7UOwStiWQoSQcyKIKeWVcbNe9pFBea629dkyMcBGIl9glZ93QJea3v1hjorxkHymYmgeaG3K1Nwfm7TsfXE8pK06jKb0v3a6pJA4aZH17TEJeNEzN2VqkeYzaoEkbzQPz7kxPewYy2sRXwB4k2QwyEhnLCi+gOsKov0Cb7PQvTCuM3dV8JQok+wsIf8/0k4egMh4jEn2+wXmxslypYSs6gj086q1ueOxw9fqXl5Td91LAgpAkJQjQICNBiDw4L8rM0lF/mH2Why7NzM5RJgN4mpRmugywIJQ8gAYZCUIld/WGvFRTHiObT/imCNkKND91K69neYAFoeQhQFMte4wIQ16t9YM80FqXQe/rQoFDNC9st6fPlQMt5yQglDwEvS+EyDEJ9sXRKK9BkwyFPTv6vNzRt9NHMVqsvcO/P9lISJKSakpGyYl3GZAH+9K8rVpbPM8UpwMJ8CZCXfo6/nmPCQtpigUhSUoQhKkOFCFyb2uYV5+ZmqUoj3fQVlf5ofIqcO7e92nz1qnYeMCCUPIQoEFWdn3mMC+82+LnugspHE8/yCHSMLDbHWhsR0z3dhgAC0KSUoUGGQlC5TXZqbz8P0f8LUkLzlQK1tL8Q3FRbGi7b0UGmLdyrKtkIRlKEKBBVgNxpiLHJEI+Y8r74aYfA09eu92Fhg25G6MEOUmJf0EvQYOMBKGSy7dQXV8cmnU99r7xIVoojYnWNYBwdQYaZCQIlVz34mjUA1mzbuJ5Pu8H0xV9ffQWJsXIAQtCyUOABhkJQiUP9RU4AX+jQezY0Nlmc2Vm60a6Hcm+V48giJGScHT69z500WpVjFYRSedTPVY+9qPvXo401MlzwIKQJCV1axWRihy4u7W8AnZqK3g4Nhp89rMoGTBgQRheDTdayyvwiKjZVcX4L68TWThUknaYEbSV1x823KaRn2bO1wAAAABJRU5ErkJggg=="   , Artist: "Bronco", Idartista: "11" , Album: "Ops" , Url: "song11.mp3"},
  { Idcancion: "34", Nombre: "te parti", duracion: "7:23", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=", Artist: "Bronco", Idartista: "11" , Album: "", Url: "song2.mp3"},
 { Idcancion: "35", Nombre: "puerta negra", duracion: "00:78", Foto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=", Artist: "Bronco", Idartista: "11" , Album: "" , Url: "song11.mp3"}
 
     ]
     
  
return (
<div>
 <AlbumTable canciones={canciones} artistas={artistas} onSubmit={handleSubmit} />
</div>
);
};*/
const DetalleCancionForm = () => {
 
       
  const [artistas, setArtistas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // To track whether data is loading
  const [canciones, setCanciones] = useState([]);

  
  
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

  useEffect(() => {
    fetch(urlconf+'/song/canciones')
      .then((response) => response.json())
      .then((data) => {
  
        setCanciones(data.canciones);
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
 <AlbumTable canciones={canciones} artistas={artistas}   urlbucket={urlaws}  />
</div>
);

}
export default DetalleCancionForm;
