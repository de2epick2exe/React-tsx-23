import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { auth_login, register, set_online } from "../../unite/User_Functions";
interface Friend {
  id: number;
  username: string;
  rooms_id: number;
}
interface UserState {
  id: number|null;
  username: string | null;
  email: string | null;
  token: string | null;
  is_auth: boolean;
  role:string | null; 
  /// find securiry ways to load default img
  photo: string;
  error: string| null;
  friends:Friend[]
  waiting_list:Friend[]
  recomends_list:Friend[]
}

const update_online =async (id: number) =>{
  await set_online(id)
  setInterval(async ()=>{
    console.log('is online:', id)
    await set_online(id)
  }, 30000)
}
const loadIsOnline =  (): UserState | undefined => {  
  try {
    const serialState = localStorage.getItem("user");    
    if (serialState !== null){
       const userData = JSON.parse(serialState);
      if (userData.is_auth && userData.id) {
        console.log(userData)
      update_online(userData.id)       
      }    
      return 
    }
    return
  } catch (err) {
    console.log(err)
  }
};
const loadUserState =  (): UserState | undefined => {  
  try {
    const serializedState = localStorage.getItem("user");    
    if (serializedState === null) {
      return undefined;
    }
    
    loadIsOnline()
    return JSON.parse(serializedState) ;
  } catch (err) {
    return undefined;
  }
};



const initialState: UserState = loadUserState()  || {
  id: null,
  username: "",
  email: "",
  token: null,
  is_auth: false,
  role: "",
  photo: "http://localhost:8080/img/default.jpg",
  error: null,
  friends:[],
  waiting_list:[],
  recomends_list:[]
};









const saveUserState = (state: UserState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("user", serializedState);
  } catch (err) {
    console.log(err)
  }
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId:(state, action: PayloadAction< number | null>)=>{
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
    setFriends:(state, action: PayloadAction<Friend[] | null>) => {
      state.friends = action.payload!
      saveUserState(state); 
    },
    setWaitingList:(state, action: PayloadAction<Friend[] | null>) => {
      state.waiting_list = action.payload!
      saveUserState(state); 
    },
    setRecomends:(state, action: PayloadAction<Friend[] | null>) => {
      state.recomends_list = action.payload!
      saveUserState(state); 
    },
    logout: (state) => {
      state.token = null;
      state.is_auth = false;
      state.email = null;
      state.username = null;
      state.role = null;
      saveUserState(state); 
    },
  },
});




export const { setId,setToken, setUsername, setEmail, setIsAuth, 
  setRole,setPhoto, setError,setFriends, logout } =
  UserSlice.actions;

export const loginUser =
  (username: string, email: string, password: string) =>
  async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      dispatch(setError(null))
      const data = await auth_login(username, email, password);
      if (data?.error_user || data?.error_password){        
        dispatch(setError(data.error_user||data.error_password));
        console.log('US data login erorr:',data) 
              
      }
      else{
      dispatch(setId(data.id));
      dispatch(setToken(data.token));
      dispatch(setEmail(data.log_email));
      dispatch(setUsername(data.log_user));
      dispatch(setRole(data.role))
      dispatch(setIsAuth(true));
      dispatch(setError(null));
      dispatch(setPhoto(`http://localhost:8080/img/${data.avatar}`))
      update_online(data.id)
      

      console.log("user logged in:", data.token);        
      }
    } catch (err) {
      console.log( 'user slice uncaugh login error:', err);
    }
  };

  export const register_user =
  (username: string, email: string, password: string) =>
  async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      dispatch(setError(null))
      const data = await register(username, email, password);      
      if (data?.error){        
        dispatch(setError(data.error));
        console.log('US data register erorr:',data.error)               
      }else{
      dispatch(setId(data.id));
      dispatch(setToken(data.token));
      dispatch(setEmail(data.email));
      dispatch(setUsername(data.username));
      dispatch(setRole(data.user_role))
      dispatch(setIsAuth(true));
      dispatch(setError(null))
      update_online(data.id)
      console.log("user logged in", data.token);    
    }
    } catch (err) {
      console.log(err);
    }
  };

export const update_avatar= (url: string)=>
  async (dispatch: ThunkDispatch<UserState, any, any>)=>{
    try {
      dispatch(setPhoto(url))
      console.log('photo successfuly changed')
    } catch (error) {
      console.log('userSlice error')
    }
  }



export default UserSlice.reducer;
