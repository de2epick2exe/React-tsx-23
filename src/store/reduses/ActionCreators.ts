import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { AppDispatch } from "../store"
import { UserSlice } from "./UserSlice"


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';


export const loginSuccess = (token : string) =>{
    return {
        type: LOGIN_SUCCESS,
        payload: token
    }
}
export const login_Failure=(err:any)=>{
    return{
        type: LOGIN_FAILURE,
        payload: err
    }
}
export const logout = ()=>{
    return{
        payload : LOGOUT
    }
}







/*
export const fetchUsers= () =>async(dispatch: AppDispatch)=>{
    try {
        dispatch(UserSlice.actions.usersFetching())
       const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users")
       dispatch(UserSlice.actions.usersFetchingSucccess(response.data))
    } catch (e : any) {
        dispatch(UserSlice.actions.usersFetchingError(e.message))
    }
}
export const fetchUsers = createAsyncThunk(
    'user/fetchAll',
    async(_, thunkAPI)=>{
        try {
        const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
        return response.data            
        } catch (error) {
            return thunkAPI.rejectWithValue('cant loading users')
        }

    }
)
    */
