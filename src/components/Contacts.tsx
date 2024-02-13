import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const Contacts = () => {
  const socket = useRef<WebSocket | undefined>();
  interface user_card {
    id: number;
    username: string;
    rooms_id: number;
  }
  const [friends, setFriends] = useState<user_card[]>([]);
  const [waiting_accept, setWaiting_accept] = useState<user_card[]>([]);

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
        console.log(message);
        switch (message.event) {
          case "get_friends":
            console.log("RETURNS friends lis");
            setFriends(message.data[0].friends_list);
            break;
          case "get_waiting_list":
            setWaiting_accept(message.data[0].waiting_accept);
            break;
          case "accept_friend":
            const timed_wl = waiting_accept.filter(
              (value: any) => value.id !== message[0].data[0].accepted_id
            );
            setFriends([...friends, message[0].data]);
            setWaiting_accept(timed_wl);
            break;

          default:
            console.log("unhandled event:", message);
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
    get_friends();
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

  const add_friend = async (add_id: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = {
        id: data.id,
        add_id: add_id,
        event: "add_friend",
      };
      socket.current.send(JSON.stringify(message));
    } else {
      setTimeout(() => {
        add_friend(add_id); //add fix*
      }, 100);
    }
  };

  const get_friends = async () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = {
        id: data.id,
        event: "get_friends",
      };
      socket.current.send(JSON.stringify(message));
    } else {
      setTimeout(() => {
        get_friends(); //add fix*
      }, 100);
    }
  };

  const get_waiting_list = async () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = {
        id: data.id,
        event: "get_waiting_list",
      };
      socket.current.send(JSON.stringify(message));
    } else {
      setTimeout(() => {
        get_friends(); //add fix*
      }, 100);
    }
  };

  const delete_friend = async (usr: any) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const message = {
        id: data.id,
        to_delete: usr,
        event: "delete_friend",
      };
      socket.current.send(JSON.stringify(message));
    } else {
      setTimeout(() => {
        get_friends(); //add fix*
      }, 100);
    }
  };

  return (
    <>
      <Flex
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <p>friends</p> <p>ctct rm</p>
        <Flex>
          <Box>
            <Tabs>
              <TabList>
                <Tab>Friends</Tab>
                <Tab>Waiting list</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                {friends.map((frd) => (
                    <Box key={frd.id}>{frd.username}</Box>
                  ))}
                </TabPanel>
                <TabPanel>
                  waiting users
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Contacts;
