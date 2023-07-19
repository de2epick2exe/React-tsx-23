import React from "react";
import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { logout } from "../store/reduses/UserSlice";

const Navbar = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const isAuth = useSelector((state: RootState) => state.userReducer.is_auth);

  const logout_user = async () => {
    dispatch(logout());
  };

  return (
    <>
      <Box   display="flex"
  alignItems="center"
  justifyContent="space-between"
  top="0"
  overflow="hidden"
  position="fixed"
  width="100%"
  zIndex="999"
  bg='black'
  >
        <Box >
          <Button as={Link} colorScheme="red" to="/">
            Warp
          </Button>
        </Box>

        <Box>
          <Button colorScheme="red" as={Link} to="/game">
            English game
          </Button>
          <Button colorScheme="red" as={Link} to="/messager">
            Messeger
          </Button>
          <Button colorScheme="red" as={Link} to="/streams">
            Streams
          </Button>
        </Box>

        <Box>
          {isAuth ? (
            <Button colorScheme="red" onClick={logout_user}>
              Logout
            </Button>
          ) : (
            <Button colorScheme="red" as={Link} to="/authorize">
              Login
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
