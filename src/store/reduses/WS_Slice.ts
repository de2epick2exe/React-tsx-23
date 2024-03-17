import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
interface Channel{
    id:number;
    channel_name: string;
    status:boolean;    
    followers: number;
}
interface Notify{
    
}

interface WS{
    socket: WebSocket | null;
    message: any;
    messages: [];
    current_channel: Channel|null;
    connected:boolean;    
}