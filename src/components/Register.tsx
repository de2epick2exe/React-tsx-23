import { Box, Button, Center, Flex, Heading, Input, Stack, StackDivider } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { loginUser, register_user, setToken } from '../store/reduses/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { Link, useNavigate } from "react-router-dom"; // Import useHistory hook
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const token = useSelector((state: RootState) => state.userReducer.token);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const navigate = useNavigate()
  const register = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();  
    
    try {
        await dispatch(register_user(username, email, password))
        navigate('/');
    } catch (e) {
        console.log(e)
    } 
     
  };

  return (
    <Center marginTop={window.innerHeight / 7}>
    <Card maxW='sm'  backgroundColor={'red.800'}>
      <CardHeader  backgroundColor={'white'}><Heading size='md'>Login</Heading></CardHeader>
      <CardBody>
      <Stack divider={<StackDivider />} spacing='4'>
      <Box>
      <Heading size='xs' textTransform='uppercase'>
      Username
      </Heading>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </Box>
      <Box>
      <Heading size='xs' textTransform='uppercase'>
      Email
      </Heading>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      
      </Box>
      <Box>
      <Heading size='xs' textTransform='uppercase'>
      Password
      </Heading>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      
      </Box>

      <Box>
      <Button onClick={register}>Register</Button>
      <Button marginLeft={'10'} as={Link} to="/login"> To Login</Button>
      </Box>
       </Stack>
      </CardBody>
    </Card>
    </Center>
  );
};

export default Register;
