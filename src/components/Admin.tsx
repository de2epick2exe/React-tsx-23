import React, { useEffect, useState } from 'react';
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

import { get_all_users } from '../unite/User_Functions';

interface User{
    id : number,
    email: string,
    username: string,
    role: string
}


const Admin = () => {
    
    const data = useSelector((state: RootState) => state.userReducer);
    const [users, setUsers] = useState<User[]>([])

    
    const  get_users = async() =>{ 
        const response = await get_all_users(data.username, data.token)
        setUsers(response)
    }
    useEffect(()=>{
       get_users()
       
    },[])        
    
    
    return (<>
        { data.role == "ADMIN" ?
        <> 
        <div>admin panel</div>
        <div>users</div>
        {users.map(user =>(
            <span key={user.id}><div>{user.id}|{user.username} | {user.email}| {user.role}</div></span>
        ))}
        
        </>
        :
        <div>          

        </div>}
        </>
    );
};

export default Admin;