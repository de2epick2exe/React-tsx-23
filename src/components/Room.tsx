import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { ArrowRightIcon } from "@chakra-ui/icons";
interface RoomProps {
  room_name: string | undefined;
  room_id: number | undefined;
  onConnectToRoom: (roomId: number | undefined) => void;
  onSendMessage: (message: any) => void;
}

const Room: React.FC<RoomProps> = ({
  room_id,
  onConnectToRoom,
  onSendMessage,
  room_name,
}) => {
  const [room_messages, setRoomMessages] = useState([]);
  const data = useSelector((state: RootState) => state.userReducer);
  const messager = useSelector((state: RootState) => state.messagerReducer);
  const [message, setMessage] = useState("");

  console.info("mesager", messager.messages);
  ////// ---------------------------- connecting to socket room
  useEffect(() => {
    if (room_id !== null || undefined) {
      console.log(room_id);
      onConnectToRoom(room_id);
    }
  }, [room_id]);
  /// Do not lost to change the ws userid in server

  console.log(room_name);

  const send = () => {
    if (!message.trim().length) {
      return;
    }
    onSendMessage(message);
    setMessage(""); // need to fix
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

  //// if no props
  if (room_id == undefined) {
    return <Center h={window.innerHeight / 1.13}>chs smn</Center>;
  } else {
    return (
      <>
      <Box  display='block' >
        <h1>{room_name}</h1>
        <div>main room </div>        
          <Flex flexDirection="column" >
            <Flex w='70%' overflowY='scroll' height='70vh' maxHeight='70vh' flexDirection="column" p="3">
              {messager.messages.map((msg) => (
                <span key={msg.id} >
                  {msg.user_id == data.id ? (
                    <Flex justify="flex-end" >
                    <p
                      style={{
                        backgroundColor: "#7f0000",
                        marginLeft: "10vw",
                        width: "140px",
                        borderRadius: "2px",
                        marginTop: "10px",
                      }}
                    >
                      {msg.username}:{msg.message}
                    </p></Flex>
                  ) : (
                    <Flex  ml='45%' >
                    <p
                      style={{
                        backgroundColor: "red",
                        width: "140px",
                        borderRadius: "2px",
                        marginTop: "10px",
                      }}
                    >
                      {msg.username}:{msg.message}
                    </p></Flex>
                  )}
                </span>
              ))}
              <AlwaysScrollToBottom />
              </Flex>
            
            <Flex w="40%" ml='30%' mt="5"  bottom='0' backgroundColor={"black"} >
              <InputGroup >
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
        
        </Box>
      </>
    );
  }
};

export default Room;
