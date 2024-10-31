import React, { useEffect } from 'react'
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Link, useParams } from "react-router-dom";
import { sendMessage } from '../store/reduses/WS_Slice';
export const Post_page = () => {
    const data = useSelector((state: RootState) => state.userReducer);
    const ws = useSelector((state: RootState) => state.WS_Slice);
    const messager_store = useSelector(
      (state: RootState) => state.messagerReducer
    );
    const dispatch: ThunkDispatch<any, any, any> = useDispatch();
    const { id } = useParams<{ id?: string }>();
    useEffect(()=>{
      dispatch(sendMessage({ event: "get_user_post", id: id }))
    },[ws.connected])
    
  return (
    <div>Post_page</div>
  )
}
