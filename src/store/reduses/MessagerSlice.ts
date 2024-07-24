import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
/* db`s tabs:
|users| <= | conversations| <= |rooms| <= |messages|
|id   |    |uid    room_id|    | id  |    | room_id|  

interface MessagerState {    
    selected_room: any;
    rooms: any;
    room_error: string| null;
  }
*/
interface Room {
  id: number;
  username: string;
  type: string;
  rooms_id: number;
}
interface Channel {
  id: number;
  channel_name: string;
  status: boolean;
  followers: number;
  admins: [];

}
interface Notify {
  from: string;
  message: string;
  avatar: string;
}

interface Post {
  title: string;
  content: string;
  media: any;
  emotes: [];
}
interface Message {
  from_id: number;
  to_id: number;
  user_id: number;
  date: Date;
  content: any;
  emotes: [];
}
interface Rooms_msgs {
  [roomid: number]: Message[];
}
/*
messages: {
  room_id : [messages array], 
  room_id2: [messages array],  
}
 
*/
interface MessagerState {
  messages: Rooms_msgs;
  message: any;
  notifies: Notify[];
  posts: Post[];
  current_channel: Channel | null;
  current_room: Room | null;
  rooms: Room[];
  searched_channel: Channel[];
}
const initialState: MessagerState = {
  messages: {},
  message: "",
  notifies: [],
  posts: [],
  current_channel: null,
  current_room: null,
  rooms: [],
  searched_channel:[]
};

const messagerSlice = createSlice({
  name: "messager",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Rooms_msgs>) => {
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      if (!(roomID[0] in state.messages)) {
        state.messages[parseInt(roomID[0], 10)] = [];
      }
      //@ts-ignore
      state.messages[parseInt(roomID[0], 10)][0].push(msg[0]);
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
    setMessages: (state, action: PayloadAction<Rooms_msgs>) => {
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      console.log(
        "MessagerSlice SetMessages func data:",
        action.payload,
        msg,
        roomID
      );
      if (!(roomID[0] in state.messages)) {
        state.messages[parseInt(roomID[0], 10)] = [];
      }
      state.messages[parseInt(roomID[0], 10)].push(msg[0]); // check if ?? works
      console.log("Finaly MessagerSlice messages: ", state.messages);
    },
    setNotifies: (state, action: PayloadAction<Notify[] | null>) => {
      state.notifies = action.payload!;
    },
    setPosts: (state, action: PayloadAction<Post[] | null>) => {
      state.posts = action.payload!;
    },    
    setRooms: (state, action: PayloadAction<Room[] | null>) => {
      state.rooms = action.payload!;
    },
    setCurrentRoom: (state, action: PayloadAction<Room | null>) => {
      state.current_room = action.payload;
    },
    setCurrentChannel: (state, action: PayloadAction<Channel | null>) => {
      state.current_channel = action.payload;
    },
    setSearchedChannel:(state, action: PayloadAction<Channel[] >) => {
      console.log('ws searched func data:', action.payload)
      state.searched_channel = []
      //@ts-ignore
      if(action.payload[0].channel_name == ''){
      console.log('not found chan: ', action.payload[0].channel_name == '')
        return
      }

      state.searched_channel = action.payload;
      console.log('founded chan is: ', state.searched_channel )
    },
    updateMessage:(state, action:PayloadAction<Rooms_msgs>)=>{
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      //@ts-ignore
      const messageIndex = state.messages[roomID][0].findIndex(message => message.message_id === message_id);
    
    if (messageIndex !== -1) {
      //@ts-ignore      
      state.messages[roomID][0].roomMessages[messageIndex].content = msg;
    }
    },
    ///deleters
    deleteMessage:(state, action: PayloadAction<Rooms_msgs>) => {
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      if (!(roomID[0] in state.messages)) {
        state.messages[parseInt(roomID[0], 10)] = [];
      }
      //@ts-ignore
      state.messages[parseInt(roomID[0], 10)][0].filter(message => message.message_id !== action.payload.message_id);
      console.log('after deleting message: ',state.message)
    },
    deletePost:(state, action: PayloadAction<Rooms_msgs>) => {
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      if (!(roomID[0] in state.messages)) {
        state.messages[parseInt(roomID[0], 10)] = [];
      }
      //@ts-ignore
      state.posts[parseInt(roomID[0], 10)][0].filter(message => message.id !== action.payload.id);
      console.log('after deleting post: ',state.message)

    },
  },
}); 
export const {
  addMessage,
  setMessage,
  setMessages,  
  setNotifies,
  setPosts,
  setRooms,
  setCurrentRoom,
  setCurrentChannel,
  setSearchedChannel,
  deleteMessage, 
  deletePost,
  updateMessage
} = messagerSlice.actions;

export default messagerSlice.reducer;
