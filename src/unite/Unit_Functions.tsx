import axios from "axios";
const api = axios.create({
    baseURL: 'http://localhost:3033/requests',
  });
export const getall = async (ofst:number, lmt:number)=>{
  
    const response = await api.get('/en/allw',{params:{offset: ofst, limit:lmt}})
    console.log(response.data)
    return response.data
}
export const insert = async(word:string, translate:string)=>{
  const response = await api.post('/en/insw',{word, translate})
  console.log(word, translate)
  return response.data
}
export const random_five = async ()=>{
  const response = await api.get('/en/rand')
  console.log(response.data)
  return response.data
}
export const search = async(id:string, word:string, translate:string)=>{
  console.log('id:',id,'word:',word, 'translate', translate)
  const response = await api.post('/en/search',{id, word, translate})
  console.log('find by id')
  return response.data
}