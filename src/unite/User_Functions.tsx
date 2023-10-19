import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3033/requests',
  });

export const auth_login = async(username : string, email : string, password: string)=>{
      try{
    const response = await api.post('user/login', {username, email, password} )
    return response.data}
    catch(error){
      if (axios.isAxiosError(error)){
        console.log(error.response?.data)
        return error.response?.data
      }
    }
  }
export const register = async(username:string, email:string, password:string )=>{
 try {
  const response = await api.post('user/registration', {username, email, password})
  return response.data
 } catch (error) {
  if(axios.isAxiosError(error)){
    return error.response?.data
  }

 }
  
}
export const set_online =async (id:number| null) => {
  try {
    const response = await api.post('user/setonline', {id})
    return
   } catch (error) {
    if(axios.isAxiosError(error)){
      return error.response?.data
    }
  
   }  
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
export const get_last_online = async (token:string| null) => {
  const response = await api.post('user/lo', {token})
  return response.data
}
export const get_last_registered =async (token:string|null) => {
  const response = await api.post('user/lr', {token})
  return response.data
}
export const ban_user =async (id:number) => {
  const response = await api.post('user/ban', {id})
  return response.data  
}
export const unBan_user =async (id:number) => {
  const response = await api.post('user/unban', {id})
  return response.data  
}

