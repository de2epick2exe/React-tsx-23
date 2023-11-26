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
      const [cards, setCards] = useState<user_card[]>([]);
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

    return (
        <>
            ctct rm
        </>
    );
};

export default Contacts;