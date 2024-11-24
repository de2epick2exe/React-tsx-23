export const SET_USER = 'SET_USER'

export interface Friend {
    id: number;
    username: string;
    rooms_id: number;
  }
export interface UserState {
    id: number | null;
    username: string | null;
    email: string | null;
    token: string | null;
    is_auth: boolean;
    role: string | null;
    /// find securiry ways to load default img
    photo: string;
    error: string | null;
    friends: Friend[];
    waiting_list: Friend[];
    recomends_list: Friend[];
  }