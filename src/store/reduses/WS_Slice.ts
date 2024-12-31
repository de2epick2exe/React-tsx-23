import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  addMessage,
  setMessages,
  setNotifies,
  setRooms,
  deleteMessage,
  deletePost,
  updateMessage,
  setSearchedChannel,
  setCurrentChannel,
  set_SelfPosts,
  set_UserPosts,
  addSelf_post,
  addUser_post,
  delete_UserPost,
  delete_SelfPost,
  updateSelf_post,
  updateUser_post,
  addComment,
  updateUser_comment,
  delete_userComment,
  setRecomendsPosts,
  setCurrentPost,
  add_Room,
  delete_chatUser,
  addChat_user,
} from "./MessagerSlice";
import { setFriends, setRecomends_Users, setWaitingList } from "./UserSlice";

interface WS {
  socket: WebSocket | null;
  connected: boolean;
}

const initialState: WS = {
  socket: null,
  connected: false,
};

export const WS_Slice = createSlice({
  name: "WS",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<WebSocket | null>) => {
      state.socket = action.payload;
    },

    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});
export const { setSocket, setConnected } = WS_Slice.actions;

export const connectToWebSocket = () => {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const socket = new WebSocket("ws://localhost:3033");

      socket.onopen = () => {
        dispatch(setConnected(true));
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          switch (message[0].event) {
            case "message":
              dispatch(addMessage(message[0]));
              console.log("WS_slice chats recived message", message[0]);
              break;
            case "chats":
              console.log("WS_slice chats:", message[0]);
              dispatch(setRooms(message[0].rooms));

              break;

            case "rooms_messages":
              console.log("WS_slice chats rooms_messages:");
              console.log(message[0]);
              console.log("room type: ", message[0].type);
              //// ---------------------------------------------
              /// TODO check if message == [] nothing to do
              dispatch(setMessages(message[0]));
              break;
            case "connection_to_room":
              console.warn("WS_slice connected to room");
              console.table(message[0]);
              break;
            case "notify":
              dispatch(setNotifies(message.notify || message.notifies));
              break;
            case "notifies":
              dispatch(setNotifies(message.notifies));
              break;
            case "add_chat_user":
              dispatch(addChat_user(message[0]));
              break;
            case "get_friends":
              console.log("friends received");
              console.log(message[0].data[0]);
              dispatch(setFriends(message[0].data));
              break;
            case "get_waiting_list":
              console.log("friends received");
              console.log(message[0].data[0]);
              dispatch(setWaitingList(message[0].data));
              break;
            case "get_latest_messaging":
              console.log("latest messaging content received");
              console.log(message[0]);
              //@ts-ignore
              dispatch(addMessage(message[0]));
              break;
            case "self_post":
              console.log("self_posts_closed");
              console.log(message[0]);
              //@ts-ignore
              dispatch(addSelf_post(message[0]));
              break;
            case "user_post":
              console.log("user_post");
              console.log(message[0]);
              //@ts-ignore
              dispatch(addUser_post(message[0].post[0]));
              break;
            case "self_closed_posts":
              console.log("self_posts_closed");
              console.log(message[0]);
              //@ts-ignore
              dispatch(set_SelfPosts(message[0]));
              break;
            case "profile_posts":
              console.log("self_posts_open", message[0]);
              console.log(message[0]);
              //@ts-ignore
              dispatch(set_UserPosts(message[0].data));
              break;
            case "profile_post":
              console.log("set profile post", message[0]);
              console.log(message[0]);
              //@ts-ignore
              dispatch(setCurrentPost(message[0].data[0]));
              console.log("set profile post 2", message[0].data[0]);
              break;
            case "recomends_posts":
              console.log("recomends posts: ", message[0]);
              console.log(message[0].data);
              //@ts-ignore
              dispatch(setRecomendsPosts(message[0].data));
              break;
            case "create_comment":
              dispatch(addComment(message[0].comment[0]));
              break;
            case "crete_chat":
              dispatch(add_Room(message[0]));
              break;
            case "recomended_users":
              console.log("recomends received");
              console.log(message[0].data);
              dispatch(setRecomends_Users(message[0].data));
              break;
            case "accept_friend":
              dispatch(setRecomends_Users(message[0].rooms));
              break;
            case "update_post":
              dispatch(updateMessage(message[0].message));
              break;
            case "update_self_post":
              dispatch(updateSelf_post(message[0].message));
              break;
            case "update_user_post":
              dispatch(updateUser_post(message[0].message));
              break;
            case "update_user_comment":
              dispatch(updateUser_comment(message[0].message));
              break;
            case "searched_channel":
              console.log("searched channel is:", message[0]);
              if (message[0].status == 404) {
                //@ts-ignore
                dispatch(setSearchedChannel([{ channel_name: "" }]));
                break;
              }
              dispatch(setSearchedChannel(message[0].data));
              break;
            ///
            /// delete events
            ///
            case "delete_message":
              console.log("deleted message event");
              dispatch(deleteMessage(message[0].message));
              break;
            case "delete_post":
              console.log("deleted post event");
              dispatch(deletePost(message[0].post));
              break;
            case "delete_user_post":
              console.log("deleted post event");
              dispatch(delete_UserPost(message[0].post));
              break;
            case "delete_user_post":
              console.log("deleted post event");
              dispatch(delete_chatUser(message[0]));
              break;
            case "delete_self_post":
              console.log("deleted post event");
              dispatch(delete_SelfPost(message[0].post));
              break;
            case "delete_comment":
              console.log("deleted post event");
              dispatch(delete_userComment(message[0].post));
              break;
            case "delete_file":
              console.log("deleted file");
              break;
            default:
              console.log("unhandled event in wsStore:", message[0].event);
              break;
          }
        } catch (error) {
          console.error("WS Slice error parsing event:", error);
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
      console.log("websocket connection error:", error);
    }
  };
};

export const sendMessage = (message: any) => {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => RootState) => {
    try {
      const { socket } = getState().WS_Slice;
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("sended message:", JSON.stringify(message));
        socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket connection is not open.");
      }
    } catch (erorr) {
      console.log("ws slice redux error:", erorr);
    }
  };
};

export const set_current_channel = (channel: any) => {
  return (dispatch: ThunkDispatch<WS, any, any>) => {
    try {
      console.log("connected to ws by redux");
      dispatch(setCurrentChannel(channel));
    } catch (error) {
      console.log("ws slice error", error);
    }
  };
};

export default WS_Slice.reducer;
