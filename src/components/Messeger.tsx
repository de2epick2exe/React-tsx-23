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
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Room from "./Room";

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

  const data = useSelector((state: RootState) => state.userReducer);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3033");
    socket.current.onopen = () => {
      console.log(data.username, "connected to ws");
    };
    socket.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(message[0].id); // for in
        console.log(message); // for in

        switch (message[0].event) {
          case "message":
            setMessages((prev) => [message, ...prev]);
            break;
          case "chats":
            console.log("caca");
            setRooms(message[0].rooms);            
            console.table(rooms);
            break;
          case "rooms_messages":
            console.log("rmsgss");
            break;

          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.warn(event.data)
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

  const username = data.username;
  const sendMessage = async () => {
    const message = {
      username,
      message: socket_msg,
      event: "message",
    };
    if (socket.current) {
      socket.current.send(JSON.stringify(message));
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

 const get_room_messages=(id: number) =>{
  if (socket.current && socket.current.readyState === WebSocket.OPEN) {
    const message = {
      room_id: id,
      event: "rooms_messages",
    };
    socket.current.send(JSON.stringify(message));
  }

 }








  useEffect(() => {
    get_users_rooms_data();
  }, [socket.current]);

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
              <Button bg="black" 
              ml='-1'
               width='100%'
                variant='ghost'
                onClick={e => get_room_messages(r.id)}>
                {r.username}
                </Button>
            </span>
          ))}
        </GridItem>
        <GridItem pl="2" bg="black" area={"chat"} style={{ overflow: "auto" }}>
          <Room/>
          {/* Added overflow and position styles 
          <div style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
            {messages
              .slice()
              .reverse()
              .map((mess, index) => (
                <div key={index}>
                  <div>
                    {mess.username}: {mess.message}
                  </div>
                </div>
              ))}
            <InputGroup pos="fixed" bottom="0" width="85%" bg="black">
              <Input
                value={socket_msg}
                onChange={(e) => setSocket_msg(e.target.value)}
              />
              <Button onClick={sendMessage} colorScheme="red">
                send
              </Button>
            </InputGroup>
          </div>*/}
        </GridItem>
      </Grid>
    </>
  );
};

export default Messenger;
