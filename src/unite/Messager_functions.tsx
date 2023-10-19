import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3033/requests',
  });
export const get_notify=async (id:number)=>{
 const responce = await api.post('user/login', {id})
 return responce.data
}