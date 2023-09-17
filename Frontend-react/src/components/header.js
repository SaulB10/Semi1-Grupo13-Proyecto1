import React from 'react';
import RegistrationForm from './registrationForm'
import PerfilForm from './perfil'
import LoginForm from './login'
import AdmonForm from './admon'
import PrincipalForm from './principal'


import 'bootstrap/dist/css/bootstrap.min.css';

import {
  
  Switch, 
  Route
} from "react-router-dom";
import {BrowserRouter as Router,  Link, Routes} from 'react-router-dom';

function Header() {

  var admonbarra="";
    const firstName = localStorage.getItem('firstName');
    //console.log('firstName DEL LADO ADMIN:',firstName);
    console.log(firstName);


    return(
      <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/Portal" className="nav-link">Principal</Link>
          </li>
          <li className="nav-item">
            <Link to="/Perfil" className="nav-link">Perfil</Link>
          </li>
          <li className="nav-item">
            <Link to="/Login" className="nav-link">Login</Link>
          </li>
          <li className="nav-item">
          <Link to="/Registration" className="nav-link">Registro</Link>
          </li>

         
        
       
       <li className="nav-item">
         <Link to="/Admon" className="nav-link">Admin</Link>
       </li>
      
          <li className="nav-item">
            <Link to="/Out" className="nav-link">Salir</Link>
          </li>
        </ul>
     
      </nav>

      <Routes>
          <Route path="/Registration" element={<Registration />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Portal" element={<Portalmetodo />} />
          <Route path="/Admon" element={<Admon />} />
          <Route path="/Out" element={<Salirmethodo />} />
        </Routes>
    </Router>


        
    )
  


}
function Salirmethodo() {
  sessionStorage.clear()
  localStorage.clear()
  console.log('saliendo...');
  const userId = localStorage.getItem('Iduser');
  console.log(userId);

  return <LoginForm/>;


}
function Registration() {

 return <RegistrationForm/>;


}
function  Portalmetodo () {
  
 
 const userId = localStorage.getItem('Iduser');
  console.log(userId)
  if(userId==null)  return <LoginForm/>;
else return <PrincipalForm/>;

}
function  Perfil () {
  const userId = localStorage.getItem('Iduser');
  console.log(userId)
  if(userId==null)  return <LoginForm/>;
else return <PerfilForm/>;


}
function  Login () {
        

  return <LoginForm/>;
  
  
  }

  function  Admon () {
    const userId = localStorage.getItem('Iduser');

   
    if(userId==null ||userId!=1)  return <LoginForm/>;
  else return <AdmonForm/>;
   
 
   
    
    }
  

export default Header;
