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
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
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
import { Message } from "../store/models/Messager";

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
  const [replying_message, setReplying_message] = useState();
  const [is_menu_on, setIsMenuOn] = useState(false);
  const [mouse_coord, setMouseCoords] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMesssage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected_id, setSelected_id] = useState<number[]>([]);
  const [user_for_event, setUser_for_event] = useState<number>();
  const [scrolling_selectingON, setScrolling_selectingON] = useState(false);  
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
    let msg_event;
    console.log(
      "room type is:",
      room_type == "private" || room_type == "chat",
      room_type
    );
    if (room_type == "private" || room_type == "chat") {
      if (isEditing) {
        msg_event = "update_message";
        setMessage(""); // need to fix
        const msg = {
          //@ts-ignore
          message_id: selectedMessage.message_id,
          room: room_id,
          content: message,
          date: new Date(),
          event: msg_event,
        };
        dispatch(sendMessage(msg));
        return;
      } else {
        msg_event = "message";
      }
    } else {
      if (isEditing) {
        msg_event = "update_post";
        setMessage(""); // need to fix
        const msg = {
          //@ts-ignore
          message_id: selectedMessage.message_id,
          room: room_id,
          content: message,
          date: new Date(),
          event: msg_event,
        };
        dispatch(sendMessage(msg));
        return;
      } else {
        msg_event = "create_post";
      }
    }
    if(is_reply_on){      
        setMessage(""); // need to fix
        const msg = {
          //@ts-ignore
          message_id: selectedMessage.message_id,
          from_id: data.id,
          //@ts-ignore
          to_id: selectedMessage.user_id,
          room: room_id,
          content: message,
          date: new Date(),
          event: "message",
        };
        dispatch(sendMessage(msg));
    }
    if(room_type == 'chat'){
      setMessage(""); // need to fix
      const msg = {
        from_id: data.id,
        user_id: data.id,
        username: data.username,
        room: room_id,
        message: message,
        date: new Date(),
        event: msg_event,
      };
      dispatch(sendMessage(msg)); // sends 2x times
    }
    setMessage(""); // need to fix
    const msg = {
      from_id: data.id,      
      user_id: data.id,
      username: data.username,
      room: room_id,
      message: message,
      date: new Date(),
      event: msg_event,
    };
    dispatch(sendMessage(msg)); // sends 2x times
  };

  const delete_message = () => {
    let msg_event;
    if (room_type == "private" || room_type == "chat") {
      //@ts-ignore
      if (selectedMessage.from_id !== data.id) {
        return;
      }
      msg_event = "delete_message";
    } else {
      msg_event = "delete_post";
    }
    setMessage(""); // need to fix
    const msg = {
      //@ts-ignore
      ...selectedMessage,
      event: msg_event,
    };
    dispatch(sendMessage(msg)); // sends 2x times
  };
  const user_event = (event: string) => {        
    if(event == 'add'){
    const msg = {
      user: user_for_event,
      room_id: room_id, 
      type: "add",   
      event: "updateChat_users",
    };
    dispatch(sendMessage(msg)); // sends 2x times
    }
    else{
      const msg = {
        user: user_for_event,
        room_id: room_id,
        type: "delete",    
        event: "updateChat_users",
      };
      dispatch(sendMessage(msg)); // sends 2x times
    }
  };
  

  const call_message_menu = (e: any, msg: any) => {
    e.preventDefault();
    setSelectedMesssage(msg);
    setMouseCoords({ x: e.clientX, y: e.clientY });
    console.log("right click event, coords", { x: e.clientX, y: e.clientY });
    console.log("message for manipulating:", msg);
    setIsMenuOn(true);
  };

  const menuItemClick = (e: any) => {
    switch (e) {
      case "reply":
        call_messg_reply(selectedMessage);
        break;
      case "delete":
        console.log("deleted message", selectedMessage);
        delete_message();
        break;
      case "edit":
        console.log("editing message", selectedMessage);
        edit_message();
        break;
      case "copy":
        if (selectedMessage) {
          navigator.clipboard.writeText(selectedMessage);
        }
        console.log("copied message", selectedMessage);
        break;

      default:
        break;
    }
    setIsMenuOn(false);
  };
  const mouse_check = (e: any, set: any) => {
    console.log("clicked left click: ", e.button === 0);
    if (e.button === 0) {
      if (set) {
        selecting();
        if (selectedMessage) {
          //@ts-ignore
          //  add_selected_id(selectedMessage?.message_id)
        }
      } else {
        setScrolling_selectingON(false);
      }
    }
    return;
  };

  const call_messg_reply = (msg: any) => {
    console.log("selected message to reply");
    setReplying_message(msg);
    setIsReplyOn(true);
  };
  const edit_message = () => {
    if (selectedMessage) {
      setIsEditing(true);
      //@ts-ignore
      setMessage(selectedMessage?.content);
    }
  };

  const selecting = () => {
    setScrolling_selectingON(true);
    setIsSelecting(true);
  };
  const stop_selecting = () => {
    setScrolling_selectingON(false);
    setIsSelecting(false);
    setSelected_id([]);
  };
  const add_selected_id = (msg_id: any) => {
    if (isSelecting) {
      if (scrolling_selectingON) {
        //@ts-ignore
        if (!selected_id.includes(msg_id)) {
          setSelected_id([...selected_id, msg_id]);
        } else {
          setSelected_id((prev_ids) => prev_ids.filter((id) => id !== msg_id));
        }
      }
      if (selected_id.length >= 2) {
        console.log("selected numbers of ids is:", selected_id.length);
      }
    }
  };

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

  const Messaging_area = useMemo(() => {
    const Selecting_navigate = () => {
      if (selected_id.length >= 1 && isSelecting) {
        return (
          <>
            <Flex>
              <CloseIcon
                mr="2"
                onClick={() => {
                  stop_selecting();
                }}
              />
              <p>{selected_id.length} messages</p>
            </Flex>
          </>
        );
      }
      return <></>;
    };

    console.log(
      "user is admin ?",
      //@ts-ignore
      messager.current_channel?.admins.includes(data.id.toString()),
      data.id,
      messager.current_channel?.admins
    );

    if (room_type == "channel") {
      //@ts-ignore
      if (!messager.current_channel?.admins.includes(data.id.toString())) {
        return <></>;
      }
    }
    const set_message = (e: any) => {
      const msg = e.target.value;
      setMessage(msg);
    };
    return (
      <>
        <Selecting_navigate />
        <InputGroup>
          <Textarea
            resize="none"
            onChange={(e) => set_message(e)}
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
      </>
    );
  }, [selected_id, isSelecting, message, send, stop_selecting]);

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
              <span
                key={msg.id}
                onDoubleClick={() => call_messg_reply(msg)}
                onContextMenu={(e) => call_message_menu(e, msg)}
                onMouseDown={(e) => {
                  mouse_check(e, true);
                }}
                onMouseUp={(e) => {
                  mouse_check(e, false);
                }}
                onMouseMove={() => {
                  add_selected_id(msg.message_id);
                }} // @ts-ignore
                style={{
                  backgroundColor: selected_id.includes(msg.message_id)
                    ? "LightCoral"
                    : "black",
                }}
              >
                <Flex justify="flex-start">
                  <p
                    className="bubble left"
                    style={{
                      backgroundColor: "brown",
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
        console.log('is in admins: ', messager.current_channel?.admins.some(id=> id == data.id))
        return (
          <>
            {/* @ts-ignore*/}
            {messager.messages[room_id][0]?.map((msg) => (
              <span
                key={msg.id}
                onDoubleClick={() => call_messg_reply(msg)}
                onContextMenu={(e) => call_message_menu(e, msg)}
                //@ts-ignore
                onMouseDown={(e) => {
                  mouse_check(e, true);
                }}
                onMouseUp={(e) => {
                  mouse_check(e, false);
                }}
                onMouseMove={() => {
                  add_selected_id(msg.message_id);
                }} // @ts-ignore
                style={{
                  backgroundColor: selected_id.includes(msg.message_id)
                    ? "LightCoral"
                    : "black",
                }}
              >
                {msg.from_id == data.id  ? (
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

  const Follow_Component = () => {
    const follow_switch = () => {      
      const msg = {
        event: "follow_onChannel",
        room_id: messager.current_channel?.room_id,
        channel_id: messager.current_channel?.id,
        user_id: data.id,
      };
      dispatch(sendMessage(msg));
    };

    if (room_type == "channel") {
      if (messager.current_channel?.is_follow) {
        return (
          <>
            <Button onClick={follow_switch}>UnFollow</Button>
          </>
        );
      }
      //@ts-ignore
      if (messager.current_channel?.admins.includes(data.id.toString())) {
        return <></>;
      }

      return (
        <>
          <Button onClick={follow_switch}>Follow</Button>
        </>
      );
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
        <Box onClick={() => setIsMenuOn(false)}>
          {is_menu_on ? (
            <Flex
              flexDirection={"column"}
              position={"absolute"}
              zIndex="9999"
              width="150px"
              style={{
                top: mouse_coord.y,
                left: mouse_coord.x,
                backgroundColor: "rgb(60, 0, 0)",
              }}
            >
              <Flex
                cursor="pointer"
                _hover={{ bg: "FireBrick", color: "white" }}
                flexDirection={"row"}
                onClick={() => menuItemClick("reply")}
              >
                <FaReplyAll height={"15"} />
                <p>Reply</p>
              </Flex>
              {
                //@ts-ignore
                selectedMessage.from_id == data.id ? (
                  <Flex
                    cursor="pointer"
                    _hover={{ bg: "FireBrick", color: "white" }}
                    flexDirection={"row"}
                    onClick={() => menuItemClick("edit")}
                  >
                    <p>Edit</p>
                  </Flex>
                ) : (
                  ""
                )
              }
              <Flex
                cursor="pointer"
                _hover={{ bg: "FireBrick", color: "white" }}
                flexDirection={"row"}
                onClick={() => menuItemClick("copy")}
              >
                <p>Copy</p>
              </Flex>

              <Flex
                cursor="pointer"
                _hover={{ bg: "FireBrick", color: "white" }}
                flexDirection={"row"}
                onClick={() => menuItemClick("delete")}
              >
                <p>Delete</p>
              </Flex>
            </Flex>
          ) : (
            <span />
          )}
          {/*----------------- TOP--------------------------- */}
          <Box
            height="7vh"
            bg="darkred"
            cursor="pointer"
            position="relative"
            onClick={onProfileOpen}
            ref={profileRef}
            zIndex="base"
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

          {/*----------------- BODY--------------------------- */}

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
              <Box visibility={is_reply_on ? "visible" : "hidden"}>
                <Flex flexDirection="row" justifyContent="space-between">
                  <FaReplyAll />
                  <p>
                    {
                      //@ts-ignore
                      replying_message?.content
                    }
                  </p>

                  <CloseIcon onClick={() => setIsReplyOn(false)} />
                </Flex>
              </Box>
              {Messaging_area}
              <Follow_Component />
            </Flex>
          </Flex>

          {/*----------------- SIDE DRAWER--------------------------- */}
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
