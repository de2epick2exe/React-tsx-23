import React, { useEffect, useRef, useState } from "react";
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
  const [is_friend_status, set_Is_friend_status]=useState<any>()
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
  const socket = useRef<WebSocket | undefined>();
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3033");
    socket.current.onopen = () => {
      console.log(data.username, "connected to ws");         
      

    };    
    socket.current.onmessage = (msg) => {
      try {
        const message = JSON.parse(msg.data);            
        console.log(message); // for in    
        switch (message.event) {                           
          case "check_state":
            //check if user in hidden list
            console.log('RETURNS friends lis')                                      
          break;
          case "check_user_status":
              console.log("user status",message.data[0].matched_column );          
              set_Is_friend_status(message.data[0].matched_column)
          break;      
          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.warn(msg.data);
        console.log(msg.data);

      }
    };
    socket.current.onclose = () => {
      console.log("connection closed");
    };
    socket.current.onerror = () => {
      console.log("SOCKET error");
    };
    
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };  
   }, []);

    const delete_friend = async()=>{
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        const message = {
          id: data.id,
          to_delete: profile_data?.id,
          event: "delete_friend",
        };
        socket.current.send(JSON.stringify(message));
      } else {
        // Wait for the connection to open and then send the message
        setTimeout(() => {
          delete_friend();
        }, 100); // You can adjust the timeout value if needed
      }
    }
    
    const add_friend = async()=>{
      //add check if user authed
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        const message = {
          id: data.id,
          add_id: profile_data?.id,
          event: "add_friend",
        };
        socket.current.send(JSON.stringify(message));
      }
    }
   
    useEffect(()=>{
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        if(data.is_auth && id){
          socket.current.send((JSON.stringify({event: 'check_status', id: data.id, cid:parseFloat(id)  })))
      }    
    }
    
    },[profile_data])

    useEffect(()=>{
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
      console.log(is_friend_status)
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
      console.log('USER STATUS IS')
     
    },[is_friend_status])
    const Friend_button = ()=>{

      if(is_friend_status == 'friends_list'){
        return null
      }
      if(is_friend_status == 'waiting_accept' ||'hidden_not_accepted'){
        
        return (<Button mt='2' onClick={add_friend}>Add Friend</Button>)
      }
      else{
        return(<Button mt='2' onClick={add_friend}>Add Friend</Button>)
      }

      return null
      /*
      matched_column
      { matched_column: 'friends_list' }
      */

    }



  return (
    <Box>
      {data.id === (id ? parseFloat(id) : null) ? (
        <Box>
          <Box m='5' border="2px solid red" width='13vw' padding='3'>
          
          <Center>
           <Avatar size='2xl' name={data.username?? undefined} src={data.photo}/>
           </Center>
         
          <Flex flexDir='column' >
          <Text as='b'>{data.username}</Text>
            <Text as='kbd'>{data.role}</Text>
            </Flex >
          </Box>
        </Box>
      ) : (
        <Box>
            <Box m='5'  border="2px solid red" width='13vw' padding='3'>
            <Center><Avatar size='2xl' name={profile_data?.username} src={profile_data?.avatar != null? `http://localhost:8080/img/${profile_data?.avatar}`: `http://localhost:8080/img/default.jpg`}/></Center><br/>
            <Flex flexDir='column' >
            <Text as='b'>{profile_data?.username}</Text>
            <Text as='kbd'>{profile_data?.role}</Text>
            
            <Button mt='2'>Write message</Button>
           <Friend_button/>
            </Flex>
            </Box>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
