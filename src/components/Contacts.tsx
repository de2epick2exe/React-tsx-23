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
      console.log('waitnig list is: ', /*(data.waiting_list[1] !==undefined),*/ data.waiting_list )
                  
      if (        
        Array.isArray(data.waiting_list) &&
        data.waiting_list.length !== 0
      ) {
        return (
          <>
            {data.waiting_list.map((usr) => (
              <Box key={usr?.id}>
                <span>{usr?.username}</span>
                <Button onClick={()=> accept_friend(usr.id) }>Accept</Button>
                <Button onClick={() => delete_friend(usr.id)}>Reject</Button>
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
          <Flex flexDirection='column' >
            
            {
              // @ts-ignore
              data.recomends_list?.map((user) => (
                //@ts-ignore
                <span key={user?.id}>
                  <Flex justifyContent='space-between' w='full'>
                  <p>
                    {
                      //@ts-ignore
                      user?.username
                    }
                  </p>
                  {
                    //@ts-ignore
                    <Button onClick={() => add_friend(user?.id)}>
                      Add to friends
                    </Button>
                  }
                  </Flex>
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
