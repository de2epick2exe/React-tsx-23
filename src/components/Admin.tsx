import React from 'react';
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
const Admin = () => {
    const dispatch: ThunkDispatch<any, any, any> = useDispatch();
    const data = useSelector((state: RootState) => state.userReducer);
    return (<>
        { data.role == "ADMIN" ?
        <div>

            admin panel
        </div>
        :
        <div>
            

        </div>}
        </>
    );
};

export default Admin;