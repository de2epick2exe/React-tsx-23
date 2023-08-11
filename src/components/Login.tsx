import { Button, Input } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { loginUser, setToken } from '../store/reduses/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { Link, useNavigate } from "react-router-dom"; // Import useHistory hook
const Login = () => {
  const [usern_or_em, setUsern_or_Em] = useState('');
  const [password, setPassword] = useState('');
  const token = useSelector((state: RootState) => state.userReducer.token);
  const dispatch: ThunkDispatch<any, any, any> = useDispatch();
  const navigate = useNavigate()
  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(usern_or_em)) {
      console.log('Valid email');
      await dispatch(loginUser('', usern_or_em, password));
    } else {
      console.log('Valid username');
      await dispatch(loginUser(usern_or_em, '', password));
    }
    navigate('/');
  };

  return (
    <div className="page">
      <div>Login</div>
      <div>Username or Email</div>
      <Input value={usern_or_em} onChange={(e) => setUsern_or_Em(e.target.value)} />
      <div>Password</div>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      <div>
        <Button onClick={login}>Login</Button>
      </div>
      <div>
        <Button as={Link} to="/register" >Register</Button>
      </div>
    </div>
  );
};

export default Login;
