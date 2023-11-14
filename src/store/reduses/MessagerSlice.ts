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
  interface Message{
    id: number;
    username:string;
    message:any;
  }
  interface MessagerState{
    messages: Message[];
  }
  const initialState: MessagerState={
    messages: [],
  }
  const messagerSlice = createSlice({
    name: 'messager',
    initialState,
    reducers:{
      addMessage: (state, action: PayloadAction<Message>)=>{
        state.messages.unshift(action.payload)
      }
    }
    

  })
  export const {addMessage}= messagerSlice.actions;
  export default messagerSlice.reducer