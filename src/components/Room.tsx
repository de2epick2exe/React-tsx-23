import React from 'react';

const Room = (props: any) => {


    if(!props){
        return(
            <div
            style={{display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center",  
              width: '100%',
            height: "80%", marginLeft: '20vw'     }}
            >
            <p style={{backgroundColor:"red", borderRadius: '10px', padding:"3px", color: 'black'}}> choose someone who you want to sent message </p>
            
             
              
            </div>
          );
    }





    return (
        <div>
            main room
        </div>
    );
};

export default Room;