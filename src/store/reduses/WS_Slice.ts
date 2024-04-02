import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
interface Channel {
  id: number;
  channel_name: string;
  status: boolean;
  followers: number;
}
interface Notify {
  from: string;
  message: string;
  avatar: string;
}
interface Message {
  title: string;
  text: string | boolean;
  media: string | boolean;
  emotes: [];
}
interface Post {
  title: string;
  content: string;
  media: any;
  emotes: [];
}
interface WS {
  socket: WebSocket | null;
  message: any;
  messages: Message[];
  notifies: Notify[];
  posts: Post[];
  current_channel: Channel | null;
  connected: boolean;
}

const initialState: WS = {
  socket: null,
  message: "",
  messages: [],
  notifies: [],
  posts: [],
  current_channel: null,
  connected: false,
};

export const WS_Slice = createSlice({
  name: "WS",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<WebSocket | null>) => {
      state.socket = action.payload;
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[] | null>) => {
      state.messages = action.payload!; // check if ?? works
    },
    setNotifies: (state, action: PayloadAction<Notify[] | null>) => {
      state.notifies = action.payload!;
    },
    setPosts: (state, action: PayloadAction<Post[] | null>) => {
      state.posts = action.payload!;
    },
    setChannel: (state, action: PayloadAction<Channel | null>) => {
      state.current_channel = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});
export const {
  setSocket,
  setMessage,
  setMessages,
  setChannel,
  setConnected,
  setNotifies,
  setPosts,
} = WS_Slice.actions;

export const connectToWebSocket = () => {
  return (dispatch: ThunkDispatch<WS, any, any>) => {
    try {
      const socket = new WebSocket("ws://localhost:3033"); 
    
    socket.onopen = () => {
      dispatch(setConnected(true))
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.event) {
        case "notify":
          dispatch(setNotifies(message.notify || message.notifies));
          break;
        case "get_posts":
          dispatch(setPosts(message.posts));
          break;
        case "notifies":
          dispatch(setNotifies(message.notifies));
          break;
        case "rooms_messages":
          dispatch(setMessages(message.messages))
         break;
        default:
          break;
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      dispatch(setConnected(false));
    };

    dispatch(setSocket(socket));
    } catch (error) {
      console.log('websocket connection error:', error )
    }
    
  };
};

export const sendMessage = (message: any) => {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => RootState) => {
    try{
    const { socket } = getState().WS_Slice;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not open.");
    }}
    catch(erorr){
      console.log('ws slice redux error:', erorr)
    }
  };
};

export const set_current_channel=(channel: any)=>{
  return (dispatch: ThunkDispatch<WS, any, any>) => {
  try {
    console.log('connected to ws by redux')
    dispatch(setChannel(channel))
  } catch (error) {
    console.log('ws slice error', error)
  }
}}


export default WS_Slice.reducer;
