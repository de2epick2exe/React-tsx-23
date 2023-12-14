import React, { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Avatar, Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { user_profile } from "../unite/User_Functions";

const Profile = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const [profile_data, Set_Profile_data] = useState<any>();
  const get_profile = async () => {
    if (id) {
      const res = await user_profile(parseFloat(id));
      console.log(res);
      Set_Profile_data(res);
    }
  };
  useEffect(() => {
    get_profile();
  }, []);

 


  return (
    <Box>
      {data.id === (id ? parseFloat(id) : null) ? (
        <Box>
          user profile: {data.username}
          <br />
          role : "{data.role}" {id}
        </Box>
      ) : (
        <Box>
            <Box border="2px solid red" width='13vw' padding='3'>
            <Center><Avatar size='2xl' name={profile_data?.username}/></Center><br/>
            <Flex flexDir='column' >
            <Text as='b'>{profile_data?.username}</Text>
            <Text as='kbd'>{profile_data?.role}</Text>
            
            <Button mt='2'>Write message</Button>
            <Button mt='2'>Add Friend</Button>
            </Flex>
            </Box>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
