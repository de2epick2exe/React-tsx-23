import React, { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const data = useSelector((state: RootState) => state.userReducer);
  return (
    <>
      <div className="App page" >
        
        {
          data.is_auth ? <><p>user authed </p>
          <p >Home page user : {" " + data.username + " "} </p> 
        {" " + data.email + " "}
        {" " + data.username + " "}
        
          
          
          </>
          : 
          "user not auth"

         
        }
        
      </div>
    </>
  );
}

export default App;
