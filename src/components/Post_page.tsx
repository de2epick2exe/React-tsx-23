import React, { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Link, useParams } from "react-router-dom";
import { sendMessage } from "../store/reduses/WS_Slice";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ArrowRightIcon } from "@chakra-ui/icons";
export const Post_page = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const messager_store = useSelector(
    (state: RootState) => state.messagerReducer
  );
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(sendMessage({ event: "get_user_post", id: id }));
  }, [ws.connected]);

  const send_comment = () => {
    dispatch(
      sendMessage({
        event: "create_comment",
        date: new Date(),
        type: "profile",
        comment: comment,
        post_id: id,
      })
    );
    setComment("");
  };

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap="1" h="92vh">
        <GridItem></GridItem>
        <Grid borderX={"1px solid red "}>
          <Flex bg={"black"} mx={"5"} flexDir={"column"}>
            <Flex my={"2"}>
              <Avatar
                mx={"2"}
                size="sm"
                name={messager_store.current_userPost?.username}
                src={
                  messager_store.current_userPost?.avatar != null
                    ? `http://localhost:8080/img/${messager_store.current_userPost?.avatar}`
                    : `http://localhost:8080/img/default.jpg`
                }
              />
              <Flex flexDir={"column"}>
                <Text ml="1">{messager_store.current_userPost?.username}</Text>
              </Flex>
            </Flex>
            <Box my={"2"}>
              <Text ml="1">{messager_store.current_userPost?.post}</Text>
            </Box>

            <Box border={"1px solid red"} />
            <Box>
              {messager_store.current_userPost.comments.flat().map((post) => (
                <Text key={post.id}>{post.comment}</Text>
              ))}
            </Box>
            <Box mt={"2"}>
              <InputGroup mb="2">
                <Textarea
                  resize="none"
                  minH="4"
                  maxH="10"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <InputRightElement>
                  <Button>
                    <ArrowRightIcon onClick={send_comment} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </Flex>
        </Grid>
        <Grid></Grid>
      </Grid>
    </>
  );
};
