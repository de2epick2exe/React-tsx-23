import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { auth_login, register, set_online } from "../../unite/User_Functions";
import { Friend, UserState } from "../models/User";


const update_online = async (id: number) => {
  await set_online(id);
  setInterval(async () => {
    console.log("is online:", id);
    await set_online(id);
  }, 30000);
};
const loadIsOnline = (): UserState | undefined => {
  try {
    const serialState = localStorage.getItem("user");
    if (serialState !== null) {
      const userData = JSON.parse(serialState);
      if (userData.is_auth && userData.id) {
        console.log(userData);
        update_online(userData.id);
      }
      return;
    }
    return;
  } catch (err) {
    console.log(err);
  }
};
const loadUserState = (): UserState | undefined => {
  try {
    const serializedState = localStorage.getItem("user");
    if (serializedState === null) {
      return undefined;
    }

    loadIsOnline();
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const initialState: UserState = loadUserState() || {
  id: null,
  username: "",
  email: "",
  token: null,
  is_auth: false,
  role: "",
  photo: "http://localhost:8080/img/default.jpg",
  error: null,
  friends: [],
  waiting_list: [],
  recomends_list:[],
};

const saveUserState = (state: UserState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("user", serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number | null>) => {
      state.id = action.payload;
      saveUserState(state); // Save state to localStorage*
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      saveUserState(state);
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
      saveUserState(state);
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
      saveUserState(state);
    },

    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.is_auth = action.payload;
      saveUserState(state);
    },
    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
      saveUserState(state);
    },
    setPhoto: (state, action: PayloadAction<string>) => {
      state.photo = action.payload;
      saveUserState(state);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      saveUserState(state);
    },
    setFriends: (state, action: PayloadAction<Friend[] | null>) => {
      console.log("friends USERSLICE: ", action.payload);
      
      action.payload?.map((user) => {
        console.log("friends list user: ", user);
        if(!state.friends.some(u=> u.id === user.id)){
          console.log("friends list push: ", user);
          state.friends.push(user);
        }        
      });
      console.log("friends FIN STATE: ", state.friends[0]);
      saveUserState(state);
    },
    setWaitingList: (state, action: PayloadAction<Friend[] | null>) => {
      console.log("waiting accept USERSLICE: ", action.payload);
      if (action.payload?.length !== 0){
      action.payload?.map((user) => {
        if(!state.waiting_list.some(u=> u.id === user.id)){
         console.log('waitng list push:', user)
        state.waiting_list.push(user); 
        }        
      });
    
      saveUserState(state);
    }
    },
    setRecomends_Users: (state, action: PayloadAction<Friend[] | null>) => {
      console.log("recomends USERSLICE: ", action.payload);
      console.log(state.recomends_list)
      if (action.payload?.length !== 0){
        //@ts-ignore
        action.payload.map((user) => {
          if(!state.recomends_list.some(u=> u.id === user.id)){
          console.log('recomends list push:', user)
          state.recomends_list.push(user);
          }
          
        });
      }
      saveUserState(state);
      
    },
    logout: (state) => {
      state.token = null;
      state.is_auth = false;
      state.email = null;
      state.username = null;
      state.role = null;
      state.waiting_list=[];
      state.friends=[];
      state.recomends_list=[];
      saveUserState(state);
    },
  },
});

export const {
  setId,
  setToken,
  setUsername,
  setEmail,
  setIsAuth,
  setRole,
  setPhoto,
  setError,
  setFriends,
  setWaitingList,
  setRecomends_Users,
  logout,
} = UserSlice.actions;

export const loginUser =
  (username: string, email: string, password: string) =>
  async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      dispatch(setError(null));
      const data = await auth_login(username, email, password);
      if (data?.error_user || data?.error_password) {
        dispatch(setError(data.error_user || data.error_password));
        console.log("US data login erorr:", data);
      } else {
        dispatch(setId(data.id));
        dispatch(setToken(data.token));
        dispatch(setEmail(data.log_email));
        dispatch(setUsername(data.log_user));
        dispatch(setRole(data.role));
        dispatch(setIsAuth(true));
        dispatch(setError(null));
        dispatch(setPhoto(`http://localhost:8080/img/${data.avatar}`));
        update_online(data.id);

        console.log("user logged in:", data.token);
      }
    } catch (err) {
      console.log("user slice uncaugh login error:", err);
    }
  };

export const register_user =
  (username: string, email: string, password: string) =>
  async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      dispatch(setError(null));
      const data = await register(username, email, password);
      if (data?.error) {
        dispatch(setError(data.error));
        console.log("US data register erorr:", data.error);
      } else {
        dispatch(setId(data.id));
        dispatch(setToken(data.token));
        dispatch(setEmail(data.email));
        dispatch(setUsername(data.username));
        dispatch(setRole(data.user_role));
        dispatch(setIsAuth(true));
        dispatch(setError(null));
        update_online(data.id);
        console.log("user logged in", data.token);
      }
    } catch (err) {
      console.log(err);
    }
  };

export const update_avatar =
  (url: string) => async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      dispatch(setPhoto(url));
      console.log("photo successfuly changed");
    } catch (error) {
      console.log("userSlice error");
    }
  };

export default UserSlice.reducer;
