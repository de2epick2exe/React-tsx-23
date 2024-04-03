import { combineReducers ,configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import userReducer from './reduses/UserSlice'
import { PostApi } from "./service/PostService";
import messagerReducer from "./reduses/MessagerSlice";
import  WS_Slice from "./reduses/WS_Slice";
const rootReducer = combineReducers({
    messagerReducer,
    userReducer,
    WS_Slice,
    [PostApi.reducerPath]:PostApi.reducer
})
export const setupstore = () =>{
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(PostApi.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupstore>
export type AppDispatch = AppStore['dispatch'] 