import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { addMessage, setChannel, setMessages, setNotifies, setPosts, setRooms } from "./MessagerSlice";
import { setFriends } from "./UserSlice";

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
export const {
  setSocket,
  setConnected,

} = WS_Slice.actions;

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
              console.log("WS_slice chats recived message", message); 
              break;
            case "chats":
              console.log("WS_slice chats:", message[0]);
              dispatch(setRooms(message[0].rooms))
              
              break;
            case "rooms_messages":
              console.log("WS_slice chats rooms_messages");
              console.table(message[0]);
              //// ---------------------------------------------
              if ((message[0].messages = [])) {
              } else {
                dispatch(addMessage(message[0].messages));
              }
              break;
            case "connection_to_room":
              console.warn("WS_slice connected to room");
              console.table(message[0]);
              break;
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
              dispatch(setMessages(message.messages));
              break;
              case "delete_post":
              console.log('deleted post')
              break;  
            case "delete_file":
              console.log('deleted file')
              break;
              case "get_friends":
                console.log('friends received')
                console.log(message.data)
                dispatch(setFriends(message.data))
                break;
              case "get_waiting_list":
                
                break;
              case "accept_friend":
                
                break;
              case "recomended_users":
                
                break;
            default:
              console.log("unhandled event in wsStore:", message[0].event);
              break;
          }
        } catch (error) {
          console.error('ws slice error parsing event:', error)
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
      dispatch(setChannel(channel));
    } catch (error) {
      console.log("ws slice error", error);
    }
  };
};

export default WS_Slice.reducer;
