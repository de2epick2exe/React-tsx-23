import React from 'react';
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";


const Profile = () => {
    const data = useSelector((state: RootState) => state.userReducer);
    const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  
    return (
        <div>
            user profile: {data.username}<br/>
            role : "{data.role}"
        </div>
    );
};

export default Profile;