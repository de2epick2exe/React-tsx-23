import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
/* db`s tabs:
|users| <= | conversations| <= |rooms| <= |messages|
|id   |    |uid    room_id|    | id  |    | room_id|  
*/
interface MessagerState {    
    selected_room: any;
    rooms: any;
    room_error: string| null;
  }
  