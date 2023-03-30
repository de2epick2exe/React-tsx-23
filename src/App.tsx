import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from './store/hooks/redux';
import { UserSlice } from './store/reduses/UserSlice';
import { fetchUsers } from './store/reduses/ActionCreators';
import PostContainer from './components/PostContainer';
import PostContainer2 from './components/PostContainer2';
import Navbar from './components/Navbar';
import Eng_Ua from './components/Eng_Ua';


function App() {
 /*const {count} = useAppSelector(state => state.userReducer)
 const {increment} = UserSlice.actions
 const dispatch = useAppDispatch()
  const {users, isLoading, error}= useAppSelector(state=> state.userReducer)
  useEffect(()=>{
    dispatch(fetchUsers())
  }, [])*/
  return (<>
    
    <div className="App">
      
      ENGLISH GAME

      {/*
      {isLoading && <h1>is loading...</h1>}
      {error && <h1>{error}</h1>}
      <h1>{count}</h1>
      <button onClick={()=>dispatch(increment(1))}>Increment</button>
      {JSON.stringify(users, null, 2)}
  */}{/*
    <PostContainer/>
    <div>---------------------------------------------------------------</div>
    <PostContainer2/>
    */}
    </div>
  
    <Eng_Ua/>
    </>
  );
}

export default App;
