import { Button, Center, InputGroup, InputRightElement, Textarea } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {ArrowRightIcon}from '@chakra-ui/icons'
interface RoomProps { 
  room_name: string | undefined
 room_id: number|undefined
 onConnectToRoom: (roomId:number|undefined)=> void;
 onSendMessage:(message: any)=>void;
}


const Room:React.FC<RoomProps> = ({room_id, onConnectToRoom,onSendMessage, room_name}) => {
  const [room_messages, setRoomMessages]= useState([])
  const data = useSelector((state: RootState) => state.userReducer);
  const messager = useSelector((state: RootState) => state.messagerReducer);
  const [message, setMessage]= useState('')
  console.log(message)
console.info("mesager",messager.messages)
////// ---------------------------- connecting to socket room
  useEffect(() => {
    if (room_id !== null || undefined){
      console.log(room_id)
    onConnectToRoom(room_id)
  }  

  }, [room_id]);
/// Do not lost to change the ws userid in server

  console.log(room_name)
  //// if no props
  if (room_id == undefined) {
    return (
      <Center h={window.innerHeight / 1.13} >chs smn</Center>
    );
  }

  else{
    return (<>
    <h1>{room_name}</h1>
  <p></p>
    <div>main room </div>
    {messager.messages.forEach(message=>{
      <span key={message.id}>
        {message.username}{message.message}
      </span>

    })}
    <InputGroup>
    <Textarea onInput={(e)=>setMessage(e.currentTarget.value)}/>
         
    <InputRightElement>
    <Button onClick={(e)=>onSendMessage(message)}>
      <ArrowRightIcon  />
    </Button>
    </InputRightElement>
    </InputGroup>
    </>
    )
  }

 
};

export default Room;
