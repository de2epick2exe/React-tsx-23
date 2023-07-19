import React, { useEffect } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const data = useSelector((state: RootState) => state.userReducer);
  return (
    <>
      <div className="App page" >
        Home page
        {" " + data.email + " "}
        {" " + data.username + " "}
        {" " + data.token}
        {
          data.is_auth ? "user authed" : "user not auth"

          /*
      {isLoading && <h1>is loading...</h1>}
      {error && <h1>{error}</h1>}
      <h1>{count}</h1>
      <button onClick={()=>dispatch(increment(1))}>Increment</button>
      {JSON.stringify(users, null, 2)}
  */
        }
        {/*
    <PostContainer/>
    <div>---------------------------------------------------------------</div>
    <PostContainer2/>
    */}
      </div>
    </>
  );
}

export default App;
