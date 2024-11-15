import React, { useEffect } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { sendMessage } from "../store/reduses/WS_Slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function Feed() {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const messager = useSelector((state: RootState) => state.messagerReducer);
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  useEffect(() => {
    try {
      console.log("WEBSOCKET MAIN STATE IS:", ws.connected);
      dispatch(sendMessage({ event: "get_notify", id: data.id }));
      dispatch(sendMessage({ event: "get_recomends", offset: 1, lim: 5 }));
    } catch (error) {
      console.log("app tsx ws error");
    }
  }, [ws.connected]);
  const checkws = () => {
    console.log("checkws");
    dispatch(sendMessage({ event: "get_notify", id: data.id }));
  };

  const Feed_Component = () => {
    return (
      <>
        {messager.recomends.map((post, index) => (
          <Box key={index} border={"2px solid black"} my="5" borderRadius="7px">
            <Flex
              p={"1"}
              justifyContent="space-between"
              onClick={() => navigate(`/post/${post.id}`)}
              cursor={"pointer"}
              
            >
              <Flex p={"1"}>
                <Avatar
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.user_id}`);
                  }}
                  cursor={"pointer"}
                  size="sm"
                  name={post?.username}
                  src={
                    post?.avatar != null
                      ? `http://localhost:8080/img/${post?.avatar}`
                      : `http://localhost:8080/img/default.jpg`
                  }
                />
                <Flex flexDir={"column"}>
                  <Text
                    ml="1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${post.user_id}`);
                    }}
                    cursor={"pointer"}                    
                    _hover={{ textDecoration: "underline" }}
                    display={"block"}
                  >
                    {post?.username}
                  </Text>
                  <Text ml="1">{post?.post}</Text>
                </Flex>
              </Flex>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
                <MenuList>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<EditIcon />}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    icon={<DeleteIcon />}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Box>
              {post.comments?.map((comment) => (
                <>comment</>
              ))}
            </Box>
          </Box>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="App page">
        {data.is_auth ? (
          <>
            <Grid templateColumns="repeat(3, 1fr)" gap="1" h="92vh">
              <GridItem>
                <Box>
                  <p>user authed </p>
                  <p>Home page user : {" " + data.username + " "} </p>
                  {" " + data.email + " "}
                  {" " + data.username + " "}
                  <Button onClick={checkws}>check</Button>
                </Box>
              </GridItem>
              <GridItem borderX="2px solid red">
                <Feed_Component />
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
