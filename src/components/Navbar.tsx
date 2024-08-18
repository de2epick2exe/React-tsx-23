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
import { MoonIcon, SunIcon,BellIcon, ChatIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { logout } from "../store/reduses/UserSlice";
import { get_notify } from "../unite/Messager_functions";
import { connectToWebSocket, sendMessage } from "../store/reduses/WS_Slice";

interface Props {
  children: React.ReactNode
}
interface Notification{
  id:number;
  notification:string;
  created_at:any;
  status:boolean;
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
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {isOpen:isNotifyOpen,onOpen:onNotifyOpen, onClose:isNotifyClose}= useDisclosure()
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const isAuth = useSelector((state: RootState) => state.userReducer.is_auth);
  const isAdmin = useSelector((state: RootState) => state.userReducer.role) == 'ADMIN';
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state:RootState )=> state.WS_Slice)
  const [arr_notify, setArr_notify]= useState<Notification[]>([])
  const logout_user = async () => {
    dispatch(logout());    
    window.location.reload();
  };
  
  const call_notify =async()=>{
    const res = await get_notify(data.id)
    setArr_notify(res)
  }
  React.useEffect(() => {
    dispatch(connectToWebSocket());
    ///dispatch(sendMessage({event: 'get_notify', id: data.id}))
    call_notify()   
 }, []);

console.log(arr_notify)

React.useEffect(() => {  
  //dispatch(sendMessage({event: 'get_notify', id: data.id}))    
  console.log('connected to ws', ws.connected)
}, [ws.connected]);


if(!ws.connected){
  setTimeout(()=>{
    dispatch(connectToWebSocket());
  }, 3000)
}

/// global bug when click on somewhich button, calls notify






  return (
    <>
      <Box  className="animate__animated animate__backInDown animate__faster" bg={useColorModeValue('red.800', 'gray.900')}  px={4}>
        <Flex  h={16} alignItems={'center'} justifyContent={'space-between'} >
          
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
           <ChatIcon/> Messeger
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
                <>                
                <Menu >
                <MenuButton 
                  as={Button}                 
                  cursor={'pointer'}
                  minW={0}>                  
                  <BellIcon/>
                </MenuButton>
                <MenuList zIndex={"docker"} alignItems={'center'}>
                  {arr_notify.map(element => (
                    <span key={element.id}>
                    <MenuItem zIndex="1000" >{element.notification}<br/>{element.created_at}
                    <MenuDivider />
                    </MenuItem>
                    
                    </span>
                  ))}                  
                   
                  
                </MenuList>
              </Menu>





              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    name={data.username ?? undefined}
                    size={'sm'}
                    src={data.photo}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                    name={data.username ?? undefined}
                      size={'2xl'}
                      src={data.photo}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{data.username}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem as={Link} to={`/profile/${data.id}`}>Profile</MenuItem>
                  {isAdmin&&
                  <MenuItem  onClick={()=>{ navigate('/admin')}}>Admin Panel</MenuItem>
                  }
                  <MenuItem as={Link} to="/contacts">Contacts</MenuItem>
                  <MenuItem as={Link} to="/settings">Account Settings</MenuItem>
                  <MenuItem onClick={logout_user} >Logout</MenuItem>
                </MenuList>
              </Menu>
              
              </>) 
              : (<Button colorScheme="red" as={Link} to="/login">
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
