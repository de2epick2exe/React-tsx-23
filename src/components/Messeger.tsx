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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import Room from "./Room";
import {
  addMessage,
  setCurrentRoom,
  setMessages,
} from "../store/reduses/MessagerSlice";
import { sendMessage } from "../store/reduses/WS_Slice";
import { EditIcon, CloseIcon } from "@chakra-ui/icons";
import { AiFillNotification, AiOutlineTeam, AiOutlineUser } from "react-icons/ai";

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
  }, [messager.rooms]);

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

  return (
    <>
      <Grid
        className="page"
        templateAreas={`"all-chats chat"`} /* Updated grid template areas */
        gridTemplateRows={"1fr"} /* Adjusted row sizing */
        gridTemplateColumns={"150px 1fr"}
        color="white"
        fontWeight="bold"
        boxSizing="border-box"
        style={{
          overflowY: "hidden",
          height: "calc(93vh)",
          margin: "0",
        }}
      >
        
        <GridItem pl="2" bg="red" area={"all-chats"} position="relative">
        <GridItem >
          folders
        </GridItem>
          All Chats
          {rooms?.map((r) => (
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
              <Portal >
                <PopoverContent w='6vw' >   
                  <PopoverBody display='flex'  flexDirection='column' p='0' >
                    <Button borderRadius='none' p='0' m='0' display='flex' justifyContent='start'><AiFillNotification fontSize='md'  /><Text fontSize='xs'>New channel</Text></Button>
                    <Button borderRadius='none' p='0' m='0' display='flex' justifyContent='start'><AiOutlineTeam fontSize='md' /> <Text fontSize='xs' >New group</Text></Button>
                    <Button borderRadius='none' p='0' m='0' display='flex' justifyContent='start'> <AiOutlineUser fontSize='md'  /><Text fontSize='xs' >New private</Text> </Button>

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
