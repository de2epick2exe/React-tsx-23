import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import { Post } from '../models/Post'
export const PostApi = createApi({
    reducerPath: 'PostAPI',
    baseQuery: fetchBaseQuery({baseUrl:'https://jsonplaceholder.typicode.com/'}),
    endpoints:(build)=>({
        fetchAllPosts:build.query<Post[], number>({
            query: (limit: number = 5)=>({
                url: '/posts',
                params:{
                    _limit: limit
                }
            })
        })
    })
})