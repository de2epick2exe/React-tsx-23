import { User } from "../models/User"
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { fetchUsers } from "./ActionCreators";
interface UserState{
    users: User[];
    isLoading: boolean;
    error: string;
    count:number;
    
}
const initialState: UserState={
    users:[],
    isLoading: false,
    error:'',
    count: 0,
}
export const UserSlice= createSlice({
    name: 'user',
    initialState,
    reducers:{
        increment(state, action: PayloadAction<number>){
                state.count += action.payload;

        }},
    extraReducers: {
            [fetchUsers.fulfilled.type]:(state, action: PayloadAction<User[]>)=>{
                state.isLoading=false;
                state.error='';
                state.users = action.payload;
            },
            [fetchUsers.pending.type]:(state)=>{
                state.isLoading=true;
               
            },
            [fetchUsers.rejected.type]:(state, action: PayloadAction<string>)=>{
                state.isLoading=false;
                state.error= action.payload;
            },
        }

    }
)
export default UserSlice.reducer;