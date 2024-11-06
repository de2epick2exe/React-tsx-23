import React, { useEffect } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Link, useParams } from "react-router-dom";
import { sendMessage } from "../store/reduses/WS_Slice";
import { Avatar, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
export const Post_page = () => {
  const data = useSelector((state: RootState) => state.userReducer);
  const ws = useSelector((state: RootState) => state.WS_Slice);
  const messager_store = useSelector(
    (state: RootState) => state.messagerReducer
  );
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const { id } = useParams<{ id?: string }>();
  useEffect(() => {
    dispatch(sendMessage({ event: "get_user_post", id: id }));
  }, [ws.connected]);

  return (
    <>
      <Grid>
        <GridItem></GridItem>
        <GridItem>
          <Flex>
            <Avatar
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
        </GridItem>
        <GridItem></GridItem>
      </Grid>
    </>
  );
};
