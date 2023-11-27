import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
const Contacts = () => {
    const socket = useRef<WebSocket | undefined>();
    interface user_card {
        id: number;
        username: string;
        rooms_id: number;
      }
      const [friends, setFriends] = useState<user_card[]>([]);
      const data = useSelector((state: RootState) => state.userReducer);
      const dispatch: ThunkDispatch<any, any, any> = useDispatch();
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
              case "contacts_list":
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
       }, []);


       const get_users_rooms_data = async () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
          const message = {
            rooms_for: data.id,
            event: "friends",
          };
          socket.current.send(JSON.stringify(message));
        } else {
          // Wait for the connection to open and then send the message
          setTimeout(() => {
            get_users_rooms_data();
          }, 100); // You can adjust the timeout value if needed
        }
      };




    return (
        <>
            <p>friends</p> <p>ctct rm</p>
        </>
    );
};

export default Contacts;