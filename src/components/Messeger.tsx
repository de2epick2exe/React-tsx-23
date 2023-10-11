import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Input,
  InputGroup,
  position,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Messenger = () => {
  const socket = useRef<WebSocket | undefined>();
  const [messages, setMessages] = useState<any[]>([]);
  const [socket_msg, setSocket_msg] = useState("");
  const [rooms, setRooms] = useState<any[]>([])







  
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
        setMessages((prev) => [message, ...prev]);
      } catch (error) {
        console.error("Error parsing JSON:", error);
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
    const message = {
      rooms_for: data.id,      
      event: "message",
    };
    if (socket.current) {
      socket.current.send(JSON.stringify(message));
    }    
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
        </GridItem>
        <GridItem pl="2" bg="black" area={"chat"} style={{ overflow: "auto" }}>
          {/* Added overflow and position styles */}
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
          </div>
        </GridItem>
      </Grid>
    </>
  );
};

export default Messenger;
