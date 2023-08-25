import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { auth_login, register } from "../../unite/User_Functions";

interface UserState {
  username: string | null;
  email: string | null;
  token: string | null;
  is_auth: boolean;
  role:string | null; 
  /// find securiry ways to load default img
  photo: string;
  error: string| null;
}
  
const loadUserState = (): UserState | undefined => {
  try {
    const serializedState = localStorage.getItem("user");
    setError(null)
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const initialState: UserState = loadUserState() || {
  username: "",
  email: "",
  token: null,
  is_auth: false,
  role: "",
  photo: "http://localhost:8080/imgs/default.jpg",
  error: null
};

const saveUserState = (state: UserState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("user", serializedState);
  } catch (err) {
    // Handle errors while saving state
  }
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      saveUserState(state); // Save state to localStorage
    },
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
      saveUserState(state); // Save state to localStorage
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
      saveUserState(state); // Save state to localStorage
    },

    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.is_auth = action.payload;
      saveUserState(state); // Save state to localStorage
    },
    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
      saveUserState(state); // Save state to localStorage
    },
    setPhoto: (state, action: PayloadAction<string>) => {
      state.photo = action.payload;
      saveUserState(state); // Save state to localStorage
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      saveUserState(state); // Save state to localStorage
    },
    logout: (state) => {
      state.token = null;
      state.is_auth = false;
      state.email = null;
      state.username = null;
      state.role = null;
      saveUserState(state); // Save state to localStorage
    },
  },
});

export const { setToken, setUsername, setEmail, setIsAuth, setRole,setPhoto, setError, logout } =
  UserSlice.actions;

export const loginUser =
  (username: string, email: string, password: string) =>
  async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      const data = await auth_login(username, email, password);
      if (data?.error_user || data?.error_password){        
        dispatch(setError(data.error_user||data.error_password));
        console.log('US data login erorr:',data) 
              
      }
      else{
      dispatch(setToken(data.token));
      dispatch(setEmail(data.log_email));
      dispatch(setUsername(data.log_user));
      dispatch(setRole(data.role))
      dispatch(setIsAuth(true));
      dispatch(setError(null));

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
      const data = await register(username, email, password);
      
      if (data?.error){        
        dispatch(setError(data.error));
        console.log('US data register erorr:',data.error) 
              
      }else{
      dispatch(setToken(data.token));
      dispatch(setEmail(data.email));
      dispatch(setUsername(data.username));
      dispatch(setRole(data.user_role))
      dispatch(setIsAuth(true));
      dispatch(setError(null))
      console.log("user logged in", data.token);
    
    }

    } catch (err) {
      console.log(err);
    }
  };

export default UserSlice.reducer;
