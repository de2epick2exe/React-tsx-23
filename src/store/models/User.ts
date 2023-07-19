export const SET_USER = 'SET_USER'

export interface User{
    id: number;
    name: string;
    email: string;
    pasword: string;
    token: string;
    is_auth: false;
    
}
