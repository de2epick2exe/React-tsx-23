import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { sendMessage } from "./store/reduses/WS_Slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

function App() {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  useEffect(() => {
    try {
      console.log("WEBSOCKET MAIN STATE IS:", ws.connected);
      dispatch(sendMessage({ event: "get_notify", id: data.id }))
    } catch (error) {
      console.log("app tsx ws error");
    }
  }, [ws.connected]);
  const checkws = () => {
    console.log('checkws')
    dispatch(sendMessage({ event: "get_notify", id: data.id }))
  };
  return (
    <>
      <div className="App page">
        {data.is_auth ? (
          <>
            <Grid templateColumns="repeat(3, 1fr)" gap='1' h='92vh'>
              <GridItem>
              <Box>
                <p>user authed </p>
                <p>Home page user : {" " + data.username + " "} </p>
                {" " + data.email + " "}
                {" " + data.username + " "}
                <Button onClick={checkws}>check</Button>
              </Box>
              </GridItem>
              <GridItem borderX='2px solid red'>
                Feed
              </GridItem>
              <GridItem>
              <Box>
                <Box border="1px solid grey">statistick</Box>
                <Box> some streams</Box>
              </Box>
              </GridItem>
              </Grid>
          </>
        ) : (
          "user not auth"
        )}
      </div>
    </>
  );
}

export default App;
