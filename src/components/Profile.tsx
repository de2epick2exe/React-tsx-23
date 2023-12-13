import React from 'react';
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';


const Profile = () => {
    const data = useSelector((state: RootState) => state.userReducer);
    const dispatch: ThunkDispatch<any, any, any> = useDispatch();
    const {id}= useParams()
    return (
        <Box>
            user profile: {data.username}<br/>
            role : "{data.role}" {id}
        </Box>
    );
};

export default Profile;