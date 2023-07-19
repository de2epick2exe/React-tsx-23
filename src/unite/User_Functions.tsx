import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3033/requests',
  });

export const auth_login = async(username : string, email : string, password: string)=>{
      
    const response = await api.post('user/login', {username, email, password} )
    const token = response.data
    return token
  }
