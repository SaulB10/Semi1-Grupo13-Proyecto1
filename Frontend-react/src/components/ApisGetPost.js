
import React, { Component } from 'react';
import Swal from 'sweetalert2'
import './config';

class Postdata extends Component {
  static sendDataToServer(data,name) {

    var urlconf=global.config.i18n.apiget

    const apiUrl = urlconf+'/'+name;
    console.error('There was 1');


    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        Swal.fire({
          icon: 'success',
          title: 'Hecho',
          text: 'accion ejecutada correctamente'
        })

        return response.json();
      })
      .then((responseData) => {
        
        console.log('POST response:', responseData);
      })
      .catch((error) => {
      
        console.error('There was a problem with the POST request:', error);
      });
  }


  static sendDataToServerForm(data,name) {
  
    var urlconf=global.config.i18n.apiget

    const apiUrl = urlconf+'/'+name;
    console.error('There was 1');

   
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        Swal.fire({
          icon: 'success',
          title: 'Hecho',
          text: 'accion ejecutada correctamente'
        })

        return response.json();
      })
      .then((responseData) => {
        
        console.log('POST response:', responseData);
      })
      .catch((error) => {
     
        console.error('There was a problem with the POST request:', error);
      });
  }

  static sendDataToServerPlay(data,name) {
    
    var urlconf=global.config.i18n.apiget

    const apiUrl = urlconf+'/'+name;
    console.error('There was 1');

   
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

      

        return response.json();
      })
      .then((responseData) => {
       
        console.log('POST response:', responseData);
      })
      .catch((error) => {
        
        console.error('There was a problem with the POST request:', error);
      });
  }

  render() {
    return (
      <div>
        {}
      </div>
    );
  }
}

export default Postdata;



