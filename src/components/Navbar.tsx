import React, { useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { logout } from "../store/reduses/UserSlice";

const Navbar = () => {
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const isAuth = useSelector((state: RootState) => state.userReducer.is_auth);
  const data = useSelector((state: RootState) => state.userReducer);
  const logout_user = async () => {
    dispatch(logout());
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        overflow="hidden"
        position="sticky"
        top="0"
        width="100%"
        zIndex="2" // Increase the zIndex to ensure it's displayed above other elements
        bg="black"
      >
        <Box>
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
            <div
              style={{
                display: "flex",
                marginTop: 10,
                marginBottom: 4,
                marginRight: 20,
              }}
            >
              <Menu >
                <MenuButton aria-label="Options" zIndex="5">
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginTop: -5,
                    }}
                    cursor="pointer"
                    />
                </MenuButton>

                <MenuList >
                  <MenuItem as='a' href="/profile">Profile</MenuItem>
                  <MenuItem>New Window</MenuItem>
                  <MenuItem>Open Closed Tab</MenuItem>
                  <MenuItem>Open File...</MenuItem>
                </MenuList>
              </Menu>
              <Button colorScheme="red" onClick={logout_user}>
                Logout
              </Button>
            </div>
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
