import {
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
        <h1>{room_name}</h1>
        <div>main room </div>
        <Flex justify="center" w="100%" h="100vh" align="center">
          <Flex w={["100%", "100%", "40%"]} h="90%" flexDir="column">
            <div>
              <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
              {messager.messages.map((msg) => (
                <span key={msg.id} >
                  {msg.user_id == data.id ? (
                    <Flex w="100%" justify="flex-end" >
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
                    <p
                      style={{
                        backgroundColor: "red",
                        width: "140px",
                        borderRadius: "2px",
                        marginTop: "10px",
                      }}
                    >
                      {msg.username}:{msg.message}
                    </p>
                  )}
                </span>
              ))}
              <AlwaysScrollToBottom />
              </Flex>
            </div>
            <Flex w="100%" mt="5">
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
        </Flex>
      </>
    );
  }
};

export default Room;
