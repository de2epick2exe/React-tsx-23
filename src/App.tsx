import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Box, Button, Flex, Grid, GridItem,Text, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { sendMessage } from "./store/reduses/WS_Slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function App() {
  const data = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();
  useEffect(() => {
    if (data.is_auth) {
      navigate("/feed");
    }
  }, [data.is_auth, navigate]);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const messager = useSelector((state: RootState) => state.messagerReducer);

  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  useEffect(() => {
    try {
      console.log("WEBSOCKET MAIN STATE IS:", ws.connected);
      dispatch(sendMessage({ event: "get_notify", id: data.id }))
    } catch (error) {
      console.log("app tsx ws error");
    }
  }, [ws.connected]);
  return (
    <>
      <div className="App page">
        <Text></Text>
      </div>
    </>
  );
}

export default App;
