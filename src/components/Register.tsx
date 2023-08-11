import { Button, Input } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { loginUser, register_user, setToken } from '../store/reduses/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { Link, useNavigate } from "react-router-dom"; // Import useHistory hook
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const token = useSelector((state: RootState) => state.userReducer.token);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const navigate = useNavigate()
  const register = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();  
    
    try {
        await dispatch(register_user(username, email, password))
        navigate('/');
    } catch (e) {
        console.log(e)
    } 
     
  };

  return (
    <div className="page">
      <div>Login</div>
      <div>Username </div>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      <div>Email</div>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <div>Password</div>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      <div>
        <Button onClick={register}>Register</Button>
      </div>
      <div>
        <Button as={Link} to="/login">Login</Button>
      </div>
    </div>
  );
};

export default Register;
