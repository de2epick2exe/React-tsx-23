import { combineReducers ,configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import userReducer from './reduses/UserSlice'
import messagerReducer from "./reduses/MessagerSlice";
import  WS_Slice from "./reduses/WS_Slice";
const rootReducer = combineReducers({
    messagerReducer,
    userReducer, 
    WS_Slice,     
})
export const setupstore = () =>{
    return configureStore({
        reducer: rootReducer        
        
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupstore>
export type AppDispatch = AppStore['dispatch'] 