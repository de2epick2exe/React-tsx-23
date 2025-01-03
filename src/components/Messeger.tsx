import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  GridItem,
  Button,
  Input,
  InputGroup,
  position,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  Portal,
  PopoverBody,
  Text,
  Flex,
  IconButton,
  Checkbox,
  InputLeftElement,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Room from "./Room";
import { RiImageAddLine } from "react-icons/ri";
import {
  addMessage,
  setCurrentChannel,
  setCurrentChat,
  setCurrentRoom,
  setMessages,
} from "../store/reduses/MessagerSlice";
import { sendMessage } from "../store/reduses/WS_Slice";
import { EditIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  AiFillNotification,
  AiOutlineTeam,
  AiOutlineUser,
} from "react-icons/ai";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";
import { Friend } from "../store/models/User";

interface room_user {
  id: number;
  username: string;
  room_id: number;
}

const Messenger = () => {
  const socket = useRef<WebSocket | undefined>();
  //const [messages, setMessages] = useState<any[]>([]);
  const [socket_msg, setSocket_msg] = useState("");
  const [rooms, setRooms] = useState<room_user[]>([]);
  const [room, setRoomState] = useState<number | undefined>();
  const [selected_room, setSelected_room] = useState("");
  const [searched_channel, setSearched_channel] = useState("");
  const [message_State, setMesage_state] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selected_friends, setSelected_friends] = useState<number[]>([]);
  const data = useSelector((state: RootState) => state.userReducer);
  const messager = useSelector((state: RootState) => state.messagerReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRooms(messager.rooms);
    get_self_posts();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messager.messages]);

  const get_self_posts = () => {
    const msg = {
      id: data.id,
      event: "get_self_posts",
    };

    dispatch(sendMessage(msg));
  };

  /// call users init data
  const get_users_rooms_data = async () => {
    const rooms_for = {
      rooms_for: data.id,
      event: "geting_rooms",
    };
    dispatch(sendMessage(rooms_for));
  };

  useEffect(() => {
    const latest_messages = {
      id: data.id,
      event: "get_latest_messaging",
    };
    dispatch(sendMessage(latest_messages));
  }, [messager.rooms]);

  const get_room_messages = (
    id: number | undefined,
    roomt: string | undefined
  ) => {
    const connection_to_room = {
      room: id,
      type: roomt,
      event: "connection_to_room",
    };

    dispatch(sendMessage(connection_to_room));

    const message = {
      room_id: id,
      event: "rooms_messages",
    };

    dispatch(sendMessage(message));
  };

  useEffect(() => {
    get_users_rooms_data();
  }, [ws.connected]);

  const search_channel = (title: any) => {
    console.log("searched data lenght", title.length, title.length == 0);
    if (title.length == 0) {
      setIsSearching(false);
      setSearched_channel("");
      return;
    }
    setIsSearching(true);
    setSearched_channel(title);
    const msg = {
      title: title,
      user_id: data.id,
      event: "search_channel",
    };
    dispatch(sendMessage(msg));
  };

  const setRoomdata = (r: any) => {
    setRoomState(undefined);
    setRoomState(r?.room_id);
    setSelected_room(r?.username);
    dispatch(setCurrentRoom(r));
    console.log("setting current room : ", r, r.type == "channel");
    if (r.type == "channel") {
      dispatch(setCurrentChannel(r));
    }
    if (r.type == "chat") {
      dispatch(setCurrentChat(r));
    }
  };
  /// need to fix bottom white line
  const ScrollbarStyles = () => {
    return (
      <style>
        {`
          /* width */
          ::-webkit-scrollbar {
            width: 5px;
          }
  
          /* Track */
          ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px transparent; 
            border-radius: 10px;
          }
  
          /* Handle */
          ::-webkit-scrollbar-thumb {
            background: red; 
            border-radius: 10px;
          }
  
          /* Handle on hover */
          ::-webkit-scrollbar-thumb:hover {
            background: transparent; 
          }
        `}
      </style>
    );
  };
  const [turnOnNChn, setTurnOnNChn] = useState(false);
  const [turnOnNG, setTurnOnNG] = useState(false);
  const [turnOnNP, setTurnOnNP] = useState(false);
  const [turnOnMain, setTurnOnmain] = useState(true);
  const turnNChn = () => {
    setTurnOnNChn(!turnOnNChn);
    setTurnOnNG(false);
    setTurnOnNP(false);
    setTurnOnmain(!turnOnMain);
  };
  const turnNg = () => {
    const message = {
      id: data.id,
      event: "get_friends",
    };
    dispatch(sendMessage(message));

    setTurnOnNG(!turnOnNG);
    setTurnOnNChn(false);
    setTurnOnNP(false);
    setTurnOnmain(!turnOnMain);
  };
  const turnNP = () => {
    setTurnOnNP(!turnOnNP);
    setTurnOnNChn(false);
    setTurnOnNG(false);
    setTurnOnmain(!turnOnMain);
  };
  const Chats = () => {
    const [channelName, setChannelName] = useState("");
    const [channelDesc, setChannelDesc] = useState("");
    const chanAvatar = useRef<HTMLInputElement>(null);
    const setFile = () => {
      try {
        if (chanAvatar.current !== null) {
          chanAvatar?.current.click();
        }
      } catch (err) {
        console.log("file error", err);
      }
    };

    const createChannel = () => {
      

      const message_data = {
        event: "create_channel",
        body: {
          id: data.id,
          title: channelName,
          desc: channelDesc,
          //avatar: chanAvatar
        },
      };
      dispatch(sendMessage(message_data));
      console.log("created channel", channelName, channelDesc);
    };

    const createChat = () => {
      const message_data = {
          event: "create_chat",       
          user_id: data.id,
          friends_list: selected_friends,       
      };
      dispatch(sendMessage(message_data));
      console.log("created chat", channelName, channelDesc);
    };

    if (turnOnNChn) {
      return (
        <>
          <Flex direction="row" alignItems="center">
            <IconButton
              onClick={() => {
                turnNChn();
              }}
              aria-label="Back"
              isRound={true}
              p="0"
              icon={<SlArrowLeftCircle />}
            />

            <GridItem>Create new Channel</GridItem>
          </Flex>
          <Box>
            <Input type="file" ref={chanAvatar} display="none" />
            <Flex direction="column">
              <Flex
                my="4"
                flexDir="row"
                justifyContent="center"
                w="100%"
                alignItems="center"
              >
                <IconButton
                  variant="outline"
                  colorScheme="teal"
                  aria-label="Call Sage"
                  fontSize="20px"
                  onClick={setFile}
                  icon={<RiImageAddLine />}
                />
              </Flex>
              <Box my="2">
                <Input
                  onChange={(e) => {
                    setChannelName(e.target.value);
                  }}
                />
              </Box>
              <Box my="2">
                <Input
                  onChange={(e) => {
                    setChannelDesc(e.target.value);
                  }}
                />
              </Box>
              <IconButton
                variant="outline"
                borderColor="transparent"
                colorScheme="teal"
                aria-label="Call Sage"
                fontSize="20px"
                w="4"
                onClick={createChannel}
                icon={<SlArrowRightCircle />}
              />
            </Flex>
          </Box>
        </>
      );
    }
    if (turnOnNG) {
      console.log("data friends list:", data.friends);
      
      return (
        <>
          <Flex direction="column">
            <Flex>
              <Input type="file" display="none" />
              <IconButton
                onClick={() => {
                  turnNg();
                }}
                variant="outline"
                colorScheme="teal"
                textColor="black"
                aria-label=""
                fontSize="20px"
                mr="2"
                icon={<SlArrowLeftCircle />}
              />

              <GridItem>Add user</GridItem>
            </Flex>
            <Box mt='2'>
              <Input />
            </Box>
            <Flex direction="column" minH="10vh">
              <Flex direction="column" mt="2">
                {data.friends?.map((frd: Friend) => (
                  <Flex key={frd?.id} cursor='pointer'onClick={() => setSelected_friends((prev) => prev.includes(frd.id) ? prev.filter((id) => id !== frd.id) : [...selected_friends, frd.id])}>
                    <Checkbox isChecked={selected_friends.some((id) => id === frd.id)} />
                    <Flex alignItems="center">
                      <Avatar mx="2" size="md" name={frd.username} />
                      <Box
                        onClick={() =>
                          setSelected_friends([...selected_friends, frd?.id])
                        }
                      >
                        {frd?.username}
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
              <Button mt="3" onClick={() => createChat()}>
                Create chat
              </Button>
            </Flex>
          </Flex>
        </>
      );
    }
    if (turnOnNP) {
      return (
        <>
          <Flex direction="row" alignItems="center">
            <IconButton
              onClick={() => {
                turnNP();
              }}
              variant="outline"
              colorScheme="teal"
              textColor="black"
              aria-label=""
              fontSize="20px"
              mr="2"
              icon={<SlArrowLeftCircle />}
            />
            <Input />
          </Flex>
          {data.friends?.map((frd) => (
            <Box key={frd?.id}>
              <span>{frd?.username}</span>
            </Box>
          ))}
        </>
      );
    }

    const Latest_message: React.FC<{ room_id: number; room_name: string }> = ({
      room_id,
      room_name,
    }) => {
      console.log("latest message id:", room_id, "room name:", room_name);
      console.log("latest message is:", messager.messages);
      // @ts-ignore
      if (room_id && messager.messages && messager.messages[room_id]) {
        // @ts-ignore
        if (messager.messages[room_id] !== undefined) {
          let last_msg;
          try {
            // @ts-ignore
            last_msg = messager.messages[room_id][0]?.[messager.messages[room_id][0]?.length - 1].content;
          } catch (error) {
            last_msg = "";
          }
          console.log("last msg:", last_msg);
          return (
            <Box>
              {room_name}: {last_msg}
            </Box>
          );
        }
      }
      return <> </>;
    };

    if (isSearching) {
      console.log("searched next: ", messager.searched_channel);
      const SearchResults = () => {
        messager.searched_channel?.map((channel) =>
          console.log("ws searched ent: ", channel)
        );
        if (messager.searched_channel.length <= 0) {
          return <>notFound :^</>;
        }
        return (
          <>
            <Flex flexDirection="column">
              {" "}
              {messager.searched_channel?.map((channel) => (
                <Box
                  key={channel?.id}
                  bg="black"
                  ml="-1"
                  width="100% "
                  my="2"
                  py="3"
                  onClick={(e) => setRoomdata(channel)}
                  _hover={{ bg: "#CD5C5C" }}
                >
                  <span>{channel?.channel_name}</span>
                </Box>
              ))}
            </Flex>
          </>
        );
      };

      return (
        <>
          <Flex flexDirection="row">
            {data.friends?.map((frd) => (
              <Box key={frd?.id}>
                <span>{frd?.username}</span>
              </Box>
            ))}
          </Flex>
          <Divider my="2" />
          <Flex direction="column">
            <SearchResults />
          </Flex>
        </>
      );
    }
    //@ts-ignore
    ///console.log(messager.messages[1][0]?.[messager.messages[1][0]?.length - 1]);

    return (
      <>
        <Flex flexDirection="column">
          All Chats
          {messager.rooms?.map((r) => (
            <span key={r.id}>
              <Box
                bg="black"
                ml="-1"
                width="100% "
                my="2"
                py="3"
                onClick={(e) => setRoomdata(r)}
                _hover={{ bg: "#CD5C5C" }}
              >
                <Flex flexDirection="column">
                  <Box>{r.username}</Box>
                  <Latest_message room_name={r.username} room_id={r.room_id} />
                </Flex>
              </Box>
            </span>
          ))}
        </Flex>
      </>
    );
  };

  return (
    <>
      <Grid
        className="page"
        templateAreas={`"all-chats chat"`} /* Updated grid template areas */
        gridTemplateRows={"1fr"} /* Adjusted row sizing */
        gridTemplateColumns={"230px 1fr"}
        color="white"
        fontWeight="bold"
        boxSizing="border-box"
        style={{
          overflowY: "hidden",
          height: "calc(93vh)",
          margin: "0",
        }}
      >
        <GridItem pl="2" bg="#980000" area={"all-chats"} position="relative">
          <Flex flexDirection="row">
            <p>folders</p>
            <InputGroup px="2">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                pl="5"
                m="0"
                value={searched_channel}
                onChange={(e) => search_channel(e.target.value)}
              />
            </InputGroup>
          </Flex>
          <Chats />
          <Box>
            <Popover>
              <PopoverTrigger>
                <EditIcon
                  w="12"
                  h="12"
                  cursor="pointer"
                  borderRadius="full"
                  p="2"
                  position="absolute"
                  bg="blackAlpha.900"
                  bottom="2"
                  right="2"
                  textColor="white"
                />
              </PopoverTrigger>
              <Portal>
                <PopoverContent w="6vw">
                  <PopoverBody display="flex" flexDirection="column" p="0">
                    <Button
                      borderRadius="none"
                      p="0"
                      m="0"
                      display="flex"
                      justifyContent="start"
                      onClick={() => {
                        turnNChn();
                      }}
                    >
                      <AiFillNotification fontSize="md" />
                      <Text fontSize="xs">New channel</Text>
                    </Button>
                    <Button
                      borderRadius="none"
                      p="0"
                      m="0"
                      display="flex"
                      justifyContent="start"
                      onClick={() => {
                        turnNg();
                      }}
                    >
                      <AiOutlineTeam fontSize="md" />{" "}
                      <Text fontSize="xs">New group</Text>
                    </Button>
                    <Button
                      borderRadius="none"
                      p="0"
                      m="0"
                      display="flex"
                      justifyContent="start"
                      onClick={() => {
                        turnNP();
                      }}
                    >
                      {" "}
                      <AiOutlineUser fontSize="md" />
                      <Text fontSize="xs">New private</Text>{" "}
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
        </GridItem>

        <GridItem bg="black" area={"chat"}>
          <Room
            room_id={messager?.current_room?.room_id}
            room_name={messager?.current_room?.username}
            room_type={messager?.current_room?.type}
            onConnectToRoom={get_room_messages}
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default Messenger;
