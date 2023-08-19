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

export const get_all_users = async (username: string | null, token: string | null)=>{
  const response = await api.post('user/geta', {username, token})
  return response.data
}

export const get_users_count =async (token : string | null) => {
  const response = await api.post('user/gettotal',{token})
  return response.data  
}
export const get_users_per_day =async (token : string | null) => {
  const response = await api.post('user/getperday',{token})
  return response.data  
}