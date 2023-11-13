import { Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface RoomProps {
 current_socket: React.MutableRefObject<WebSocket | undefined>;
 room_id: number|undefined
 onConnectToRoom: (roomId:number|undefined)=> void;
}


const Room:React.FC<RoomProps> = ({current_socket, room_id, onConnectToRoom}) => {
  const [room_messages, setRoomMessages]= useState([])
  const socket = current_socket
////// ---------------------------- connecting to socket room
  useEffect(() => {
    if (room_id !== null || undefined){
      console.log(room_id)
    onConnectToRoom(room_id)
  }
    const get_messages = ()=>{

    }
if (socket && socket.current){
  socket.current.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(message[0].id); // for in
      console.log(message); // for in

      switch (message[0].event) {
        case "message":
          
          break;
        case "chats":
          console.log("caca");          
          break;
        case "rooms_messages":
          console.log("rmSSSSSSSSSSSSS");
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.warn(event.data)
    }
  }}
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socket && socket.current) {
        socket.current.close();
      }}
  }, [room_id]);


  console.log(room_id)
  //// if no props
  if (room_id == 0) {
    return (
      <Center h={window.innerHeight / 1.13} >chs smn</Center>
    );
  }

  else{
    return <div>main room </div>;
  }

 
};

export default Room;
