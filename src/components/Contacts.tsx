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
  Button,
} from "@chakra-ui/react";
import WS_Slice, { sendMessage } from "../store/reduses/WS_Slice";

const Contacts = () => {
  interface user_card {
    id: number;
    username: string;
    rooms_id: number;
  }
  const [friends, setFriends] = useState<user_card[]>([]);
  const [waiting_accept, setWaiting_accept] = useState<user_card[]>([]);
  const [recomended_users, setRecomended_users] = useState([]);
  const [isLoadedFriends, setIsLoadedFriends] = useState(false);
  const [isLoadedWaiting, setIsLoadedWaiting] = useState(false);
  const [isLoadedRecomended, setIsLoadedRecomended] = useState(false);

  const messager = useSelector((state: RootState) => state.messagerReducer);
  const socket = useSelector((state: RootState) => state.WS_Slice);
  const data = useSelector((state: RootState) => state.userReducer);

  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  useEffect(() => {
    /*
             const message = JSON.parse(event.data);
        console.log(message);
        console.log(message.data);
        switch (message.event) {
          case "get_friends":
            console.log("RETURNS friends lis");
            setFriends(message.data);
            setIsLoadedFriends(true);
            break;
          case "get_waiting_list":
            setWaiting_accept(message.data);
            setIsLoadedWaiting(true);
            break;
          case "accept_friend":
            const timed_wl = waiting_accept.filter(
              (value: any) => value.id !== message[0].data[0].accepted_id
            );
            setFriends([...friends, message[0].data]);
            setWaiting_accept(timed_wl);
            break;
          case "recomended_users":
            //@ts-ignore
            setRecomended_users(message.data);
            console.log(message.data);
            console.log(recomended_users);
            recomended_users.map((user) => {
              console.log(user);
              console.log(user);
            });
            setIsLoadedRecomended(true);

    */

    if (socket.connected) {
      get_friends();
      get_recomended();
      get_waiting_list();
    }
  }, [socket.connected]);

  const get_users_rooms_data = async () => {
    if (socket.connected) {
      const message = {
        rooms_for: data.id,
        event: "friends",
      };

      dispatch(sendMessage(message));
    }
  };

  const get_recomended = async () => {
    if (socket.connected) {
      dispatch(
        sendMessage({ event: "get_recomended_users", page: 1, limit: 10 })
      );
    }
    return;
    //get_recomended();
  };

  const add_friend = async (add_id: any) => {
    console.log(add_id, data.id);

    if (add_id !== data.id) {
      console.log("add frined");
      if (socket.connected) {
        const message = {
          id: add_id,
          add_id: data.id,
          event: "add_friend",
        };
        dispatch(sendMessage(message));
      }
    } else {
      return;
    }
  };

  const get_friends = async () => {
    if (socket.connected) {
      const message = {
        id: data.id,
        event: "get_friends",
      };
      dispatch(sendMessage(message));
    }
  };

  const get_waiting_list = async () => {
    if (socket.connected) {
      const message = {
        id: data.id,
        event: "get_waiting_list",
      };
      dispatch(sendMessage(message));
    }
  };

  const delete_friend = async (usr: any) => {
    if (!usr) {
      return alert(`no user id, ${usr}`);
    }
    if (socket.connected) {
      const message = {
        id: data.id,
        to_delete: usr,
        event: "delete_friend",
      };
      dispatch(sendMessage(message));
    }
  };

  const accept_friend = async (accepted_id: any) => {
    console.log(accepted_id, data.id);
    if (!accepted_id) {
      return alert("!accepted id");
    }

    if (accepted_id !== data.id) {
      console.log("add frined");
      if (socket.connected) {
        const message = {
          id: data.id,
          accept_id: accepted_id,
          event: "accept_friend",
        };
        dispatch(sendMessage(message));
      }
    } else {
      return;
    }
  };

  const reject_friend = async (reject_id: any) => {
    console.log(reject_id, data.id);
    if (!reject_id) {
      return alert("!accepted id");
    }

    if (reject_id !== data.id) {
      console.log("add frined");
      if (socket.connected) {
        const message = {
          id: data.id,
          reject_id: reject_id,
          event: "reject_request",
        };
        dispatch(sendMessage(message));
      }
    } else {
      return;
    }
  };

  const Users_Tabs = () => {
    const Friends_list = () => {
      if (data && Array.isArray(data.friends) && data.friends.length !== 0) {
        return (
          <Box>
            {data.friends.map((frd) => (
              <Box key={frd.id}>
                <span>{frd.username}</span>
                <Button onClick={() => delete_friend(frd.id)}>Delete</Button>
              </Box>
            ))}
          </Box>
        );
      } else {
        console.log(data.friends);
        return (
          <>
            {" "}
            <p>You hasn`t friends (</p>{" "}
          </>
        );
      }
    };

    const Waiting_list = () => {
      if (
        data &&
        Array.isArray(data.waiting_list) &&
        data.waiting_list.length !== 0
      ) {
        return (
          <>
            {data.waiting_list.map((usr) => (
              <Box key={usr.id}>
                <span>{usr.username}</span>
                <Button onClick={() => delete_friend(usr.id)}>Delete</Button>
              </Box>
            ))}
          </>
        );
      } else {
        return <> </>;
      }
    };

    const Recomends_list = () => {
      if (data.recomends_list) {
        console.log("1", data.recomends_list[0]);
      }

      if (data.recomends_list?.length !== 0) {
        return (
          <>
          <Flex flexDirection='column'>
            {
              // @ts-ignore
              data.recomends_list?.map((user) => (
                //@ts-ignore
                <span key={user?.id}>
                  <span>
                    {
                      //@ts-ignore
                      user?.username
                    }
                  </span>
                  {
                    //@ts-ignore
                    <Button onClick={() => add_friend(user?.id)}>
                      Add to friends
                    </Button>
                  }
                </span>
              ))
            }
            </Flex>
          </>
        );
      } else {
        return (
          <>
            {" "}
            <p>loading... </p>{" "}
          </>
        );
      }
    };

    return (
      <>
        <Tabs>
          <TabList>
            <Tab>Friends</Tab>
            <Tab>Waiting list</Tab>
            <Tab>Recomended list</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Friends_list />
            </TabPanel>
            <TabPanel>
              <Waiting_list />
            </TabPanel>
            <TabPanel>
              <Recomends_list />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
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
            <Users_Tabs />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Contacts;
