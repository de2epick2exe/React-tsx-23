import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3033/requests/room',
  });
export const get_notify=async (id:number| null)=>{
  try {
    const responce = await api.post('/get_notify', {id})
 return responce.data
  } catch (error) {
    console.warn(error)
  }
 
}