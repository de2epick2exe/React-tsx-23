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
  }}
 
  export const notify_user=async (id:number| null, message: string|null)=>{
    try {
      const responce = await api.post('/notify', {id, message})
   return responce.data
    } catch (error) {
      console.warn(error)
    }}

    export const notify_all=async (message: any |null)=>{
      try {
        const responce = await api.post('/notify_all', {message})
     return responce.data
      } catch (error) {
        console.warn(error)
      }}
  

export const save_file =async (img:any) => {
 try {
  const responce = await api.post('/save_file',{img}, {headers: {
    'Content-Type': 'multipart/form-data'
  }})
  return responce.data
 } catch (error) {
  console.warn(error)
 } 
}



