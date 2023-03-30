import { combineReducers ,configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import userReducer from './reduses/UserSlice'
import { PostApi } from "./service/PostService";


const rootReducer = combineReducers({
    userReducer,
    [PostApi.reducerPath]:PostApi.reducer
})
export const setupstore = () =>{
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(PostApi.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupstore>
export type AppDispatch = AppStore['dispatch'] 