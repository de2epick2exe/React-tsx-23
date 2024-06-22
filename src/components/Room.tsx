import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Text,
  Avatar,
  Drawer,
  useDisclosure,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Menu,
  MenuItem,
} from "@chakra-ui/react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import {
  ArrowRightIcon,
  PhoneIcon,
  SearchIcon,
  DragHandleIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { FaReplyAll } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { sendMessage } from "../store/reduses/WS_Slice";

interface RoomProps {
  room_name: string | undefined;
  room_id: number | undefined;
  room_type: string | undefined;
  onConnectToRoom: (
    roomId: number | undefined,
    roomt: string | undefined
  ) => void;
}

const Room: React.FC<RoomProps> = ({
  room_id,
  onConnectToRoom,
  room_name,
  room_type,
}) => {
  const [room_messages, setRoomMessages] = useState([]);
  const data = useSelector((state: RootState) => state.userReducer);
  const messager = useSelector((state: RootState) => state.messagerReducer);
  const [message, setMessage] = useState("");
  const [is_reply_on, setIsReplyOn] = useState(false);
  const [replying_message, setReplying_message] = useState()
  const [is_menu_on, setIsMenuOn] = useState(false)
  const [mouse_coord, setMouseCoords]= useState({x: 0, y:0})
  const [selectedMessage, setSelectedMesssage]= useState()
  const [isEditing, setIsEditing]= useState()
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  console.log("connected to room type:", room_type);
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const profileRef: RefObject<HTMLDivElement> = React.useRef(null);

  console.info("messager", messager.messages);
  ////// ---------------------------- connecting to socket room
  useEffect(() => {
    if (room_id !== null || undefined) {
      console.log(room_id);
      onConnectToRoom(room_id, room_type);
    }
  }, [room_id]);
  /// Do not lost to change the ws userid in server

  console.log(room_name);

  const send = () => {
    if (!message.trim().length) {
      return;
    }
    console.log(
      "room type is:",
      room_type == "private" || room_type == "chat",
      room_type
    );
    if (room_type == "private" || room_type == "chat") {
      setMessage(""); // need to fix
      const msg = {
        from_id: data.id,
        user_id: data.id,
        username: data.username,
        room: room_id,
        message: message,
        event: "message",
      };
      dispatch(sendMessage(msg)); // sends 2x times
    } else {
      setMessage(""); // need to fix
      const msg = {
        id: room_id,
        userid: data.id,
        username: data.username,
        room: room_id,
        content: message,
        event: "create_post",
      };
      dispatch(sendMessage(msg)); // sends 2x times
    }
  };

  const delete_message = ()=>{
    if (room_type == "private" || room_type == "chat") {
      setMessage(""); // need to fix
      const msg = {
        from_id: data.id,
        user_id: data.id,
        username: data.username,
        room: room_id,
        message: message,
        event: "delete_message",
      };
      dispatch(sendMessage(selectedMessage)); // sends 2x times
    } else {
      setMessage(""); // need to fix
      const msg = {
        id: room_id,
        userid: data.id,
        username: data.username,
        room: room_id,
        content: message,
        event: "delete_post",
      };
      dispatch(sendMessage(msg)); // sends 2x times
    }
  }



  const call_message_menu = (e: any, msg: any) => {
    e.preventDefault();
    setSelectedMesssage(msg)
    setMouseCoords({x: e.clientX, y: e.clientY})
    console.log("right click event, coords", {x: e.clientX, y: e.clientY});
    console.log('message for manipulating:', msg)
    setIsMenuOn(true)
  };
  const menuItemClick = (e: any)=>{
    switch (e) {
      case 'reply':
        call_messg_reply(selectedMessage)
        break;
        case 'delete':
        console.log('deleted message', selectedMessage)
        delete_message()
        break;
        case 'edit':
          console.log('editing message', selectedMessage)        
        break;
        case 'copy':
          if(selectedMessage !==undefined){
          navigator.clipboard.writeText(selectedMessage)
        }
          console.log('copied message', selectedMessage)        
        break;
    
      default:
        break;
    }
    setIsMenuOn(false)
  }

  const call_messg_reply = (msg:any) => {
    console.log("selected message to reply");
    setReplying_message(msg)
    setIsReplyOn(true);
  };
  const edit_message = ()=>{
    if(selectedMessage !== undefined){
    setIsEditing(true)
    setMessage(selectedMessage.content)
  }
  }

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (elementRef.current) {
        elementRef.current.scrollIntoView();
      }
    });
    return <div ref={elementRef} />;
  };

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

  const MessagesComponent = () => {
    
    console.log("MessagesComponent:", room_id);
    if (room_id && messager.messages[room_id] !== undefined) {
      if (room_type == "channel") {
        //@ts-ignore
        messager.messages[room_id][0]?.map((msg) => {
          //@ts-ignore
          console.log(messager.messages[room_id][0]);
          //@ts-ignore
          console.log(msg.content);
        });
        return (
          <>
            {/* @ts-ignore*/}
            {messager.messages[room_id][0]?.map((msg) => (
              <span key={msg.id} onDoubleClick={()=>call_messg_reply(msg)}
              onContextMenu={(e)=>call_message_menu(e, msg) } >
                <Flex justify="flex-end">
                  <p
                    className="bubble right"
                    style={{
                      backgroundColor: "red",
                      marginLeft: "10vw",

                      borderRadius: "2px",
                      marginTop: "10px",
                    }}
                  >
                    {/* @ts-ignore */}
                    <Avatar name={room_name} /> {room_name}: {msg.content}
                  </p>
                </Flex>
              </span>
            ))}{" "}
          </>
        );
      } else {
        console.log("chat messages arr");
        //@ts-ignore
        messager.messages[room_id][0]?.map((msg) => console.log(msg[0]));
        return (
          //@ts-ignore
          <>{messager.messages[room_id][0]?.map((msg) => (
              <span
                key={msg.id}
                onDoubleClick={()=>call_messg_reply(msg)}
                onContextMenu={(e)=>call_message_menu(e, msg)}
              >
                {msg.from_id == data.id ? (
                  <Flex justify="flex-end">
                    <p
                      className="bubble right"
                      style={{
                        backgroundColor: "red",
                        marginLeft: "10vw",

                        borderRadius: "2px",
                        marginTop: "10px",
                      }}
                    >
                      <Avatar name={data.username ?? undefined} />{" "}
                      {data.username}: {msg.content}
                    </p>
                  </Flex>
                ) : (
                  <Flex ml="45%">
                    <p
                      className="bubble left"
                      style={{
                        backgroundColor: "#7f0000",

                        borderRadius: "2px",
                        marginTop: "10px",
                      }}
                    >
                      <Avatar name={room_name} /> {room_name}: {msg.content}
                    </p>
                  </Flex>
                )}
              </span>
            ))}{" "}
          </>
        );
      }
    }
    return <></>;
  };

  //// if no props
  if (room_id == undefined) {
    return <Center h={window.innerHeight / 1.13}>chs smn</Center>;
  } else {
    return (
      <>
        <ScrollbarStyles />
        <Box onClick={()=>setIsMenuOn(false)}>
          {is_menu_on? 
          (<Flex flexDirection={'column'}  position={'absolute'} zIndex='9999' width="150px" style={{top: mouse_coord.y, left: mouse_coord.x, backgroundColor: 'rgb(60, 0, 0)'}}>
            <Flex cursor="pointer" _hover={{ bg: 'FireBrick', color: 'white' }} flexDirection={'row'} onClick={()=>menuItemClick('reply')}><FaReplyAll height={'15'} /><p >Reply</p></Flex>
            <Flex cursor="pointer" _hover={{ bg: 'FireBrick', color: 'white' }} flexDirection={'row'} onClick={()=>menuItemClick('edit')}><p >Edit</p></Flex>
            <Flex cursor="pointer" _hover={{ bg: 'FireBrick', color: 'white' }} flexDirection={'row'} onClick={()=>menuItemClick('copy')}><p>Copy</p></Flex>
            <Flex cursor="pointer" _hover={{ bg: 'FireBrick', color: 'white' }} flexDirection={'row'} onClick={()=>menuItemClick('delete')}><p>Delete</p></Flex>

          </Flex>)
          :
            (<span/>)
          }
          <Box
            height="7vh"
            bg="darkred"
            cursor="pointer"
            position='relative'
            onClick={onProfileOpen}
            ref={profileRef}
          >
            <Flex justifyContent="space-between" padding="2">
              <Flex>
                <Avatar name={room_name} />
                <Box ml="2">
                  <Text>{room_name}</Text>
                  <Text fontSize="xs">last seen recently</Text>
                </Box>
              </Flex>
              <Flex>
                <Button ml="2" borderRadius="20">
                  <PhoneIcon />
                </Button>
                <Button ml="2" borderRadius="20">
                  <SearchIcon />
                </Button>
                <Button ml="2" borderRadius="20">
                  <DragHandleIcon />
                </Button>
              </Flex>
            </Flex>
          </Box>

          <Flex flexDirection="column">
            <Flex
              w="70%"
              overflowY="scroll"
              height="70vh"
              maxHeight="70vh"
              flexDirection="column"
            >
              <MessagesComponent />
              <AlwaysScrollToBottom />
            </Flex>

            <Flex
              w="40%"
              ml="30%"
              mt="5"
              backgroundColor={"black"}
              flexDirection="column"
            >
              <Box visibility={is_reply_on? 'visible' : 'hidden'}>
                <Flex flexDirection='row' justifyContent='space-between'>
                <FaReplyAll />                
                <p>{//@ts-ignore
                      replying_message?.content }</p>
    
                <CloseIcon onClick={()=>setIsReplyOn(false)} />
                </Flex>
              </Box>
              <InputGroup>
                <Textarea
                  resize="none"
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  value={message}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      send();
                    }
                  }}
                />

                <InputRightElement>
                  <Button
                    onClick={(e) => send()}
                    disabled={message.trim().length <= 0}
                  >
                    <ArrowRightIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Flex>
          <Drawer
            isOpen={isProfileOpen}
            placement="right"
            onClose={onProfileClose}
            finalFocusRef={profileRef}
          >
            {" "}
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>User Info</DrawerHeader>

              <DrawerBody w={"100%"}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                  <Avatar size={"2xl"} name={room_name} />
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      navigate(`/profile/${room_id}`);
                    }}
                  >
                    {room_name}
                  </Box>
                  <Box>Last seen ...</Box>
                  <Box> number</Box>
                  <Flex w={"100%"} justifyContent={"space-between"}>
                    <Box> Notifications </Box>
                    <Switch />
                  </Flex>
                </Flex>

                <Tabs>
                  <TabList>
                    <Tab>Media</Tab>
                    <Tab>Files</Tab>
                    <Tab>Links</Tab>
                    <Tab>Music</Tab>
                    <Tab>Voise</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>1</TabPanel>
                    <TabPanel>2</TabPanel>
                    <TabPanel>3</TabPanel>
                    <TabPanel>4</TabPanel>
                    <TabPanel>5</TabPanel>
                  </TabPanels>
                </Tabs>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </>
    );
  }
};

export default Room;
