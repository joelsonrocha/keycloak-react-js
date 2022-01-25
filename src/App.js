import react, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import WelcomePage from "./pages/Homepage";
import SecuredPage from "./pages/Securedpage";
import PrivateRoute from './helpers/PrivateRoute';

const Content = () =>{
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  
  const refreshToken = () =>{
    keycloak.updateToken(5).then(function(refreshed) {
      if (refreshed) {
        console.log('refreshed', refreshed);
        //alert('Token was successfully refreshed');
      } else {
        console.log('Token is still valid', new Date());
        //alert('Token is still valid');
      }
    }).catch(function() {
      console.log('Failed to refresh the token, or the session has expired', new Date());
      //alert('Failed to refresh the token, or the session has expired');
    });
  }

  const updateToken = () =>{
    setToken(keycloak.token);
    setUser(keycloak.tokenParsed?.preferred_username);
  }

  useEffect(()=>{
    console.log(keycloak);
    //console.log(keycloak.tokenParsed);
    
    keycloak.onReady = function() { console.log('onReady'); }
    keycloak.onAuthSuccess = function() { updateToken(); }
    keycloak.onAuthRefreshSuccess = function() { updateToken(); }
    keycloak.onAuthError = function() { console.log('onAuthError'); }
    keycloak.onAuthRefreshError = function() { console.log('onAuthRefreshError'); }
    keycloak.onAuthLogout = function() { console.log('onAuthLogout'); }
    keycloak.onTokenExpired = function() {refreshToken();}
  },[]);

  return (
    <>
        <Nav />
        <div>{token}</div>
        <div>Username:   {user}</div>
        <BrowserRouter>
         <Routes>
           <Route exact path="/" element={<WelcomePage />} />
           <Route
             path="/secured"
             element={
               <PrivateRoute>
                 <SecuredPage />
               </PrivateRoute>
             }
           />
         </Routes>
       </BrowserRouter>
   </>
  )
}

function App() {
  
  return (
    <div>
      <ReactKeycloakProvider authClient={keycloak}>
        <Content/>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
