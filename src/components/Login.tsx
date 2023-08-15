import { Button, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
    navigate("/");
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
                <Input
                  value={usern_or_em}
                  onChange={(e) => setUsern_or_Em(e.target.value)}
                />
              </Box>

              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Password
                </Heading>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>

              <Box>
                <Button onClick={login}>Login</Button>

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
