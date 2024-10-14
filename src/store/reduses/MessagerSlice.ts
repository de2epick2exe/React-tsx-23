import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Comments } from "../models/Messager";
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
interface User_post{ 
  id: number;
  user_id: number;
  username: string;
  avatar:string,
  date: Date;
  post: any;
  emotes: [];
}

interface Self_post{  
  id:number;
  user_id: number;
  date: Date;
  content: any;
  emotes: [];
}
interface Channel {
  id: number;
  channel_name: string;
  status: boolean;
  followers: number;
  admins: [];
  is_follow: boolean;
}
interface Notify {
  from: string;
  message: string;
  avatar: string;
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
  current_channel: Channel | null;
  current_room: Room | null;
  rooms: Room[];
  searched_channel: Channel[];
  user_posts: User_post[],
  self_posts: Self_post[],
  recomends: User_post[],
  comments:Comments
}
const initialState: MessagerState = {
  messages: {},
  message: "",
  notifies: [],  
  current_channel: null,
  current_room: null,
  rooms: [],
  searched_channel:[],
  user_posts:[],
  self_posts:[],
  recomends: [],
  comments:[]
};

const messagerSlice = createSlice({
  name: "messager",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Rooms_msgs>) => {
      console.log('ws adding message :', typeof action.payload)
      try {        
        //@ts-ignore 
        const roomID = Object.keys(action.payload);
        const msg = Object.values(action.payload);
        console.log("ws adding message/'s: ",roomID, msg )
  
        if (!(roomID[0] in state.messages)) {
          state.messages[parseInt(roomID[0], 10)] = [];
        }
        //@ts-ignore
        roomID.forEach((room, index) => {
          const parsedRoomID = parseInt(room, 10);
          if(!parsedRoomID){
            return
          }
          if (!(parsedRoomID in state.messages)) {
            state.messages[parsedRoomID] = [];
          }
          //@ts-ignore
          state.messages[parsedRoomID].push([msg[index]]);
          console.log("add: ", parsedRoomID, ':', msg[index])
        });
              
      } catch (error) {
        console.error('Messager slice add message error: ', error)
      }
      
    },
    addSelf_post: (state, action: PayloadAction<Self_post>) => {
      state.self_posts.push(action.payload)
    },
    addUser_post: (state, action: PayloadAction<User_post>) => {
      console.log('user_post WS FUNC', action.payload)
      state.user_posts.push(action.payload)
    },
    ///-------------------setters-----------------------------------
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
      state.messages[parseInt(roomID[0], 10)].unshift(msg[0]); // check if ?? works
     
     
      console.log("Finaly MessagerSlice messages: ", JSON.stringify(state.messages));
    },
    setNotifies: (state, action: PayloadAction<Notify[] | null>) => {
      state.notifies = action.payload!;
    },
    set_UserPosts: (state, action: PayloadAction<User_post[] | null>) => {
      state.user_posts = action.payload!;
    },
    set_SelfPosts: (state, action: PayloadAction<Self_post[] | null>) => {
      state.self_posts = action.payload!;
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
    setRecomendsPosts:(state, action: PayloadAction<User_post[] >) => {
      console.log('ws RecomendsPosts func data:', action.payload)
      state.searched_channel = []
      //@ts-ignore
      if(action.payload[0] == []){      
        return
      }
      state.recomends = action.payload;
      console.log('recomends posts is: ', state.searched_channel )
    },
    setComments:(state, action:PayloadAction<Rooms_msgs>)=>{
      const indexes = Object.keys(action.payload);
      const comments = Object.values(action.payload);
      //@ts-ignore
      const messageIndex = state.comments[indexes][0].findIndex(message => message.message_id === message_id);
    
    if (messageIndex !== -1) {
      //@ts-ignore      
      state.messages[parseInt(indexes[0], 10)].shift(comments[0]);     
    }
    },
    ///------------------------------modifiers-----------------------------------------
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
    updateUser_post:(state, action:PayloadAction<User_post>)=>{//Self_post
      const index = action.payload.id
      //@ts-ignore
      const messageIndex = state.user_posts[index][0].findIndex(post => post.id === id);
    
    if (messageIndex !== -1) {
      //@ts-ignore      
      state.user_posts[index][0].content = action.payload.post;
    }
    },
    updateSelf_post:(state, action:PayloadAction<Self_post>)=>{
      const index = action.payload.id
      //@ts-ignore
      const messageIndex = state.self_posts[index][0].findIndex(post => post.id === id);
    
    if (messageIndex !== -1) {
      //@ts-ignore      
      state.self_posts[index][0].content = action.payload.post;
    }
    
    },
    ///-----------------------------deleters-----------------------------------------
    deleteMessage:(state, action: PayloadAction<Rooms_msgs>) => {
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      if (!(roomID[0] in state.messages)) {
        state.messages[parseInt(roomID[0], 10)] = [];
      }
      //@ts-ignore
      state.posts[parseInt(roomID[0], 10)][0] = state.messages[parseInt(roomID[0], 10)][0].filter(message => message.message_id !== action.payload.message_id);
      console.log('after deleting message: ',state.message)
    },
    deletePost:(state, action: PayloadAction<Rooms_msgs>) => {
      const roomID = Object.keys(action.payload);
      const msg = Object.values(action.payload);
      if (!(roomID[0] in state.messages)) {
        state.messages[parseInt(roomID[0], 10)] = [];
      }
      //@ts-ignore
      state.posts[parseInt(roomID[0], 10)][0] = state.posts[parseInt(roomID[0], 10)][0].filter(message => message.id !== action.payload.id);
      console.log('after deleting post: ',state.message)

    },
    delete_SelfPost:(state, action: PayloadAction<Self_post>) => {
      const post_id = action.payload.id;      
      /*
      if (!(msg_id in state.self_posts)) {
        state.messages[parseInt(msg_id, 10)] = [];
      }*/

      //@ts-ignore
      state.self_posts = state.self_posts.filter(post => post.id !== post_id);
      console.log('after deleting post: ',state.self_posts)

    },
    delete_UserPost:(state, action: PayloadAction<User_post>) => {
      console.log(action.payload, '< value to delete')
      const post_id = action.payload.id;      
      /*
      if (!(msg_id in state.self_posts)) {        
        state.user_posts = [];
      }*/
      //@ts-ignore
      state.user_posts = state.user_posts.filter(post => post.id !== post_id);
      console.log('after deleting post: ',state.user_posts)

    },
  },
}); 
export const {
  addMessage,
  addSelf_post,
  addUser_post,
  setMessage,
  setMessages,  
  setNotifies,  
  setRooms,
  set_UserPosts,
  set_SelfPosts,
  setCurrentRoom,
  setCurrentChannel,
  setSearchedChannel,
  deleteMessage, 
  deletePost,
  delete_SelfPost,
  delete_UserPost,
  updateMessage,
  updateSelf_post,
  updateUser_post,
  setComments,
} = messagerSlice.actions;

export default messagerSlice.reducer;
