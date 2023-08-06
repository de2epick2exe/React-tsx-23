import React, { useState } from "react";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  ButtonGroup,  
    Image,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { logout } from "../store/reduses/UserSlice";

interface Props {
  children: React.ReactNode
}

const NavLink = (props: Props) => {
  const { children } = props
  
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}



const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const isAuth = useSelector((state: RootState) => state.userReducer.is_auth);
  const data = useSelector((state: RootState) => state.userReducer);
  const logout_user = async () => {
    dispatch(logout());
  };
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          
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

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              {isAuth ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{data.username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem as={Link} to="/profile">Profile</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={logout_user} >Logout</MenuItem>
                </MenuList>
              </Menu>) 
              : (<Button colorScheme="red" as={Link} to="/authorize">
              Login
            </Button>)}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export default Navbar;
