import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { User } from "../models/User"
import { AppDispatch } from "../store"
import { UserSlice } from "./UserSlice"


/*
export const fetchUsers= () =>async(dispatch: AppDispatch)=>{
    try {
        dispatch(UserSlice.actions.usersFetching())
       const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users")
       dispatch(UserSlice.actions.usersFetchingSucccess(response.data))
    } catch (e : any) {
        dispatch(UserSlice.actions.usersFetchingError(e.message))
    }
}*/
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