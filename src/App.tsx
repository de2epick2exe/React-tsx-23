import React, { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Box, Flex } from "@chakra-ui/react";

function App() {
  const data = useSelector((state: RootState) => state.userReducer);
  return (
    <>
      <div className="App page" >
        
        {
          data.is_auth ? 
          <>
          <Flex justifyContent={'space-between'}>
          <Box><p>user authed </p>
          <p >Home page user : {" " + data.username + " "} </p> 
        {" " + data.email + " "}
        {" " + data.username + " "}
        </Box><Box>
          <Box border='1px solid grey'>
             statistick
             </Box>
          <Box> some streams</Box></Box>
          </Flex>
          
          </>
          : 
          "user not auth"

         
        }
        
      </div>
    </>
  );
}

export default App;
