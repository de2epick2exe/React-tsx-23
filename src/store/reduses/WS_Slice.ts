import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
interface Channel{
    id:number;
    channel_name: string;
    status:boolean;    
    followers: number;
}
interface Notify{
    from: string
    message: string
    avatar: string
}

interface WS{
    socket: WebSocket | null;
    message: any;
    messages: [];
    notifies : Notify[]
    current_channel: Channel|null;
    connected:boolean;    
}

const initialState: WS = {
    socket: null,
    message: "",
    messages: [],
    notifies:[],
    current_channel: null,
    connected:false,
  };

export const WSSlice = createSlice({
    name: 'WS',
    initialState,
    reducers:{

    }
})