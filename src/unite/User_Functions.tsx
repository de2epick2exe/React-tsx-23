import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3033/requests',
  });

export const auth_login = async(username : string, email : string, password: string)=>{
      
    const response = await api.post('user/login', {username, email, password} )
    return response.data
  }
export const register = async(username:string, email:string, password:string )=>{

  const response = await api.post('user/registration', {username, email, password})
  return response.data
}

export const get_all_users = async (username: string, token: string)=>{
  const response = await api.post('user/geta', {username, token})
  return response.data
}
