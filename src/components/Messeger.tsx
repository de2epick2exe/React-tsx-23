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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Room from "./Room";
import { RiImageAddLine } from "react-icons/ri";
import {
  addMessage,
  setCurrentRoom,
  setMessages,
} from "../store/reduses/MessagerSlice";
import { sendMessage } from "../store/reduses/WS_Slice";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import {
  AiFillNotification,
  AiOutlineTeam,
  AiOutlineUser,
} from "react-icons/ai";
import { SlArrowLeftCircle, SlArrowRightCircle } from "react-icons/sl";

interface room_user {
  id: number;
  username: string;
  rooms_id: number;
}

const Messenger = () => {
  const socket = useRef<WebSocket | undefined>();
  //const [messages, setMessages] = useState<any[]>([]);
  const [socket_msg, setSocket_msg] = useState("");
  const [rooms, setRooms] = useState<room_user[]>([]);
  const [room, setRoomState] = useState<number | undefined>();
  const [selected_room, setSelected_room] = useState("");
  const [message_State, setMesage_state] = useState(false);

  const data = useSelector((state: RootState) => state.userReducer);
  const messager = useSelector((state: RootState) => state.messagerReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRooms(messager.rooms);
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messager.messages]);

  /// call users init data
  const get_users_rooms_data = async () => {
    const message = {
      rooms_for: data.id,
      event: "geting_rooms",
    };

    dispatch(sendMessage(message));
  };

  const get_room_messages = (id: number | undefined) => {
    const connection_to_room = {
      room: id,
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

  const setRoomdata = (r: any) => {
    setRoomState(r?.rooms_id);
    setSelected_room(r?.username);
    dispatch(setCurrentRoom(r));
    console.log(r);
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
    const [channelName, setChannelName] = useState('');
    const[ channelDesc, setChannelDesc] = useState('')
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

    const createChannel=() =>{
      console.log('created channel', channelName, channelDesc)
    }


    if (turnOnNChn) {
      return (
        <>
          <Flex direction="row" alignItems="center">
            
            <IconButton
              onClick={() => {
                turnNChn()
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
                <Input onChange={(e)=>{setChannelName(e.target.value)}} />
              </Box>
              <Box my="2">
                <Input onChange={(e)=>{setChannelDesc(e.target.value)}} />
              </Box>
              <IconButton  variant="outline" borderColor='transparent'
                  colorScheme="teal"
                  aria-label="Call Sage"
                  fontSize="20px" w='4' onClick={createChannel}                  
                  icon={<SlArrowRightCircle/>} />
            </Flex>
          </Box>
        </>
      );
    }
    if (turnOnNG) {
      console.log("data friends list:", data.friends);
      return (
        <>
          <Flex direction="row" alignItems="center">
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
            {data.friends?.map((frd) => (
              <Box key={frd?.id}>
                <span>{frd?.username}</span>
                <Checkbox />
              </Box>
            ))}
          </Flex>
          <Box>
            <Input />
          </Box>
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
    return (
      <>
        <GridItem>folders</GridItem>
        All Chats
        {messager.rooms?.map((r) => (
          <span key={r.id}>
            <br />
            <Button
              bg="black"
              ml="-1"
              width="100% "
              variant="ghost"
              onClick={(e) => setRoomdata(r)}
            >
              {r.username}
            </Button>
          </span>
        ))}
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
            room_id={room}
            room_name={selected_room}
            onConnectToRoom={get_room_messages}
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default Messenger;
