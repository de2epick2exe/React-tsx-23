import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Avatar, Box, Button, Flex, Grid, GridItem, IconButton, Menu, MenuButton, MenuItem, MenuList,Text } from "@chakra-ui/react";
import { sendMessage } from "../store/reduses/WS_Slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";

function Feed() {
  const data = useSelector((state: RootState) => state.userReducer);
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
  const checkws = () => {
    console.log('checkws')
    dispatch(sendMessage({ event: "get_notify", id: data.id }))
  };

  const Feed_Component = ()=>{


    return messager.recomends.map((post, index)=>(
    <>
    <Box
        key={index}
        border={"2px solid black"}
        my="5"
        px="2"
        borderRadius="7px"
      >
        <Flex mt="1" justifyContent="space-between">
          <Flex>           
          <Avatar
              size="sm"
              name={post?.username}
              src={
                post?.avatar != null
                  ? `http://localhost:8080/img/${post?.avatar}`
                  : `http://localhost:8080/img/default.jpg`
              }
            />
            <Text ml="1">{post?.username}</Text>
          </Flex>          
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem
                  icon={<EditIcon />}                  
                >
                  Edit
                </MenuItem>
                <MenuItem icon={<DeleteIcon />} >Delete</MenuItem>
              </MenuList>
            </Menu>
        </Flex></Box>       
    </>
    ))}


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
              <Feed_Component/>
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

export default Feed;
