import { Button, FormControl, FormErrorMessage, FormHelperText, Input } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { loginUser, setToken } from "../store/reduses/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Link, useNavigate } from "react-router-dom"; // Import useHistory hook
import {
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

const Login = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  console.log(data.error?.error_password)

  
  const [usern_or_em, setUsern_or_Em] = useState("");
  const [password, setPassword] = useState("");
  const token = useSelector((state: RootState) => state.userReducer.token);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const navigate = useNavigate();
  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (emailRegex.test(usern_or_em)) {
        console.log("Valid email");
        await dispatch(loginUser("", usern_or_em, password));
      } else {
        console.log("Valid username");
        await dispatch(loginUser(usern_or_em, "", password));
      }
    /// navigate("/");
   };
   const isError = usern_or_em === '' || password === ''


  const InputRef = useRef(null);
  const passwordInputRef = useRef(null);
  
  const handleClick = (e: any, ref: any) => {
    ///ref.current.focus();
    if(e.key == 'Enter'){
      if (ref.current){
        ref.current.focus()
      }
    console.log('click')
      
    }
  };
  return (
    <>
      <Center marginTop={window.innerHeight / 7}>
        <Card maxW="sm" backgroundColor={"red.800"}>
          <CardHeader>
            <Heading size="md">Login</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Username or Email
                </Heading>
                <FormControl>
                <Input
                  value={usern_or_em}
                  onChange={(e) => setUsern_or_Em(e.target.value)}
                  onKeyDown={(e)=> handleClick(e, passwordInputRef)}
                  ref={InputRef}
                />
                
                </FormControl>

              </Box>

              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Password
                </Heading>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                  ref={passwordInputRef}
                />
              </Box>

              <Box>
                <Button onClick={login} >Login</Button>

                <Button marginLeft={"10"} as={Link} to="/register">
                  To Register
                </Button>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </Center>
    </>
  );
};

export default Login;
