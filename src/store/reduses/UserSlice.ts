import { createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { auth_login } from "../../unite/User_Functions";

interface UserState {
  username: string | null;
  email: string | null;
  token: string | null;
  is_auth: boolean;
  role:string | null; 
}
  
const loadUserState = (): UserState | undefined => {
  try {
    const serializedState = localStorage.getItem("user");
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
  role: ""
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

export const { setToken, setUsername, setEmail, setIsAuth, setRole, logout } =
  UserSlice.actions;

export const loginUser =
  (username: string, email: string, password: string) =>
  async (dispatch: ThunkDispatch<UserState, any, any>) => {
    try {
      const data = await auth_login(username, email, password);

      dispatch(setToken(data.token));
      dispatch(setEmail(data.log_email));
      dispatch(setUsername(data.log_user));
      dispatch(setRole(data.role))
      dispatch(setIsAuth(true));
      console.log("user logged in", data.token);
    } catch (err) {
      console.log(err);
    }
  };

export default UserSlice.reducer;
