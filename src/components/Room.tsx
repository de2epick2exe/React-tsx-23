import { Center } from "@chakra-ui/react";
import React from "react";

const Room = (props: any) => {
  
  
  
/*
////// ---------------------------- connecting to socket room
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:3000`); // Replace with your WebSocket server URL
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      console.log("WebSocket connection established");

      // socket.send(JSON.stringify({action : "joinRoom", room: props.data?._id}))
    };
    socket.onmessage = (event) => {
      // Handle incoming messages
      const message = event;
      console.log(message.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        JSON.parse(message.data),
      ]);
      console.log(messages);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, [props]);

*/
  console.log(props)
  //// if no props
  if (Object.keys(props).length == 0) {
    return (
      <Center h={window.innerHeight / 1.13} >chs smn</Center>
    );
  }
/*

<div
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center",
          width: "100%",
          height: "80%",
          marginLeft: "20vw",
        }}
      >
        <p
          style={{
            backgroundColor: "red",
            borderRadius: "10px",
            padding: "3px",
            color: "black",
          }}
        >
          {" "}
          choose someone who you want to sent message{" "}
        </p>
      </div>


*/
  else{
    return <div>main room </div>;
  }

 
};

export default Room;
