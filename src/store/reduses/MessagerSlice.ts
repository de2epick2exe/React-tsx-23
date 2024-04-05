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

interface Post {
  title: string;
  content: string;
  media: any;
  emotes: [];
}
interface Message {
  id: number;
  user_id: number;
  username: string;
  message: any;
  emotes: [];
}
interface MessagerState {
  messages: Message[];
  message: any;
  notifies: Notify[];
  posts: Post[];
  current_channel: Channel | null;
}
const initialState: MessagerState = {
  messages: [],
  message: "",
  notifies: [],
  posts: [],
  current_channel: null,
};
const messagerSlice = createSlice({
  name: "messager",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
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
  },
});
export const {
  addMessage,
  setMessage,
  setMessages,
  setChannel,
  setNotifies,
  setPosts,
} = messagerSlice.actions;

export default messagerSlice.reducer;
