import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Box, Flex } from "@chakra-ui/react";
import { sendMessage } from "./store/reduses/WS_Slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

function App() {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  useEffect(
    ()=>{
      try {
        console.log('WEBSOCKET MAIN STATE IS:',ws.connected)
        sendMessage({event: 'get_notify', id: data.id})

      } catch (error) {
        console.log('app tsx ws error')
      }
      
  }, [ws.connected])
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
