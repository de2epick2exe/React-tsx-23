import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";
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
interface Message{
    title: string;
    text: string | boolean;
    media: string | boolean;
    emotes: []
}
interface WS{
    socket: WebSocket | null;
    message: any;
    messages: Message[];
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

export const WS_Slice = createSlice({
    name: 'WS',
    initialState,
    reducers:{
        setSocket:(state, action: PayloadAction< WebSocket | null>)=>{
            state.socket = action.payload;            
          },
          setMessage: (state, action: PayloadAction<string | null>) => {
            state.message = action.payload;
          },
          setMessages: (state, action: PayloadAction<Message[] | null>) => {
            state.messages = action.payload!;  // check if ?? works          
          },
          setNotifies:(state, action: PayloadAction<Notify[] | null>) => {
            state.notifies = action.payload!
          },
          setChannel: (state, action: PayloadAction<Channel | null>) => {
            state.current_channel = action.payload;            
          },
          setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;            
          }
    }
})
export const { setSocket, setMessage, setMessages, setChannel,setConnected, setNotifies} =
  WS_Slice.actions;

  export const connectToWebSocket = () => {
    return (dispatch: any) => {
        const socket = new WebSocket("ws://localhost:8080"); // Adjust URL accordingly

        socket.onopen = () => {
            dispatch(setConnected(true));
        };

        socket.onmessage = (event) => {
            const message= JSON.parse(event.data);
             switch (message.event) {
              case 'Notify':
                dispatch(setNotifies(message.notify))
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
    };
};  

export const sendMessage = (message: any) => {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => RootState) => {
      const { socket } = getState().WS_Slice;
      if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(message));
      } else {
          console.error("WebSocket connection is not open.");
      }
  };
};

export default WS_Slice.reducer;