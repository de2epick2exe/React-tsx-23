import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Input,
  InputGroup,
  position,
  Box,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Room from "./Room";
import { addMessage } from "../store/reduses/MessagerSlice";

interface room_user {
  id: number;
  username: string;
  rooms_id: number;
}

const Messenger = () => {
  const socket = useRef<WebSocket | undefined>();
  const [messages, setMessages] = useState<any[]>([]);
  const [socket_msg, setSocket_msg] = useState("");
  const [rooms, setRooms] = useState<room_user[]>([]);
  const [room, setRoom] = useState<number | undefined>();
  const [selected_room, setSelected_room] = useState("");  
  const [message_State, setMesage_state] = useState(false)
  //add send message to room as func * 
  console.log(room);

  const data = useSelector((state: RootState) => state.userReducer);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3033");
    socket.current.onopen = () => {
      console.log(data.username, "connected to ws");
    };
    socket.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        console.log(message); // for in

        switch (message[0].event) {
          case "message":
           /// setMessages((prev) => [message, ...prev]);
          // if (message[0].id !== null){            
            dispatch(addMessage(message[0]));
            console.log('recived message________WS', message)//}
            break;
          
          case "chats":
            console.log("caca________WS");
            setRooms(message[0].rooms);
            console.table(rooms);
            break;
          case "rooms_messages":
            console.info("rmsgss________WS");
            console.table(message[0]);
          //// ---------------------------------------------
          if(message[0].messages = [])
          {}else{
            dispatch(addMessage(message[0].messages));
          }
            break;
          case "connection_to_room":
            console.warn("connected to room________WS");
            console.table(message[0]);            
            break;

          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.warn(event.data);
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

    /* add rooms call on init and cached it in store    */
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  
  const sendMessage = async (message:any) => {
    const msg = {
      id: Date.now(),
      user_id : data.id,
      username: data.username,
      room,
      message: message,
      event: "message",
    };
    if (socket.current) {
      socket.current.send(JSON.stringify(msg));
    }
    setSocket_msg(""); // Clear the input after sending the message
    
  };
  /// call users init data
  const get_users_rooms_data = async () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = {
        rooms_for: data.id,
        event: "geting_rooms",
      };
      socket.current.send(JSON.stringify(message));
    } else {
      // Wait for the connection to open and then send the message
      setTimeout(() => {
        get_users_rooms_data();
      }, 100); // You can adjust the timeout value if needed
    }
  };
  //console.log(socket.current);

  const get_room_messages = (id: number | undefined) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const connection_to_room = {
        room: id,
        event: "connection_to_room",
      };
      socket.current.send(JSON.stringify(connection_to_room));

      const message = {
        room_id: id,
        event: "rooms_messages",
      };
      socket.current.send(JSON.stringify(message));
    }
  };
  //get access to the ws from another file or write one big

  useEffect(() => {
    get_users_rooms_data();
  }, [socket.current]);

  const setRoomdata = (r: any) => {
    setRoom(r?.rooms_id);
    setSelected_room(r?.username);
    console.log(r);
  };

  return (
    <>
      <Grid
        className="page"
        templateAreas={`"all-chats chat"`} /* Updated grid template areas */
        gridTemplateRows={"1fr"} /* Adjusted row sizing */
        gridTemplateColumns={"150px 1fr"}
        gap="1"
        color="white"
        fontWeight="bold"
        style={{
          height: "100vh",
        }} /* Set the grid height to fill the viewport */
      >
        <GridItem pl="2" bg="red" area={"all-chats"}>
          All Chats
          {rooms.map((r) => (
            <span key={r.id}>
              <br />
              <Button
                bg="black"
                ml="-1"
                width="100%"
                variant="ghost"
                onClick={(e) => setRoomdata(r)}
              >
                {r.username}
              </Button>
            </span>
          ))}
        </GridItem>
        <GridItem pl="2" bg="black" area={"chat"} style={{ overflow: "auto" }}>
          <Room
            room_id={room}
            room_name={selected_room}
            onConnectToRoom={get_room_messages}
            onSendMessage={sendMessage}
          />
        </GridItem>
        
      </Grid>
    </>
  );
};

export default Messenger;
