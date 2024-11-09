import React, { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Link, useParams } from "react-router-dom";
import { sendMessage } from "../store/reduses/WS_Slice";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
export const Post_page = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const messager_store = useSelector(
    (state: RootState) => state.messagerReducer
  );
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const { id } = useParams<{ id?: string }>();
  const [comment, setComment] = useState("")


  useEffect(() => {
    dispatch(sendMessage({ event: "get_user_post", id: id }));
  }, [ws.connected]);

  const send_comment = () => {
    dispatch(sendMessage({
      event: "comment",
      date: new Date(),
      comment: comment,
      post_id: id
    }))

  };

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap="1" h="92vh">
        <GridItem></GridItem>
        <Grid borderX={"1px solid red "}>
          <Flex bg={"black"} mx={"5"} flexDir={"column"}>
            <Flex my={"2"}>
              <Avatar
                mx={"5"}
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
                <Text ml="1">{messager_store.current_userPost?.post}</Text>
              </Flex>
            </Flex>
            <Box border={"1px solid red"} />
            <Box>
              {messager_store.current_userPost.comments.map((post) => (
                <span key={post.id}>
                  <Text>{post.comment}</Text>
                </span>
              ))}
            </Box>
          </Flex>
        </Grid>
        <Grid></Grid>
      </Grid>
    </>
  );
};
