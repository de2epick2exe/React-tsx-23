import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";



const Profile = () => {
    const data = useSelector((state: RootState) => state.userReducer);
    return (
        <div>
            user profile
        </div>
    );
};

export default Profile;