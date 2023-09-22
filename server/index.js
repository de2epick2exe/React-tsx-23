const express = require("express");
require("dotenv").config({ path: "./.env.server" });
const routes = require("./routes/main_router");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const WebSocket = require("ws");
const Redis = require ('ioredis');
 
const port = process.env.PORT;
const server = express();
function logResponse(req, res, next) {
  const originalJson = res.json;
  res.json = function () {
    console.log("Response:", arguments[0]);
    originalJson.apply(res, arguments);
  };
  next();
} 
  
server.use(logResponse);
server.use(morgan("dev"));
server.use(cors({ origin: "http://localhost:3000" }));
server.use(express.json());
server.use("/requests", routes);

const httpServer = http.createServer(server);
const wss = new WebSocket.Server({ noServer: true });
 
wss.on("connection", (ws) => {
  console.log('user connected')
  ws.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Received message:", parsedMessage);
      ws.send("Server received your message.");
      switch (parsedMessage.event) {
        case 'message':
          brodcastMessage(parsedMessage);
          break;
        case "connection":
          brodcastMessage(parsedMessage);
          break;
        default:
          console.log("Unknown event:", parsedMessage.event);
      }
    } catch  {
       
      // Error is caught and ignored, allowing the code to continue execution
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

const brodcastMessage = (message)=>{
  wss.clients.forEach(client=>{
    client.send(JSON.stringify(message))
  })
}
 /*
 const setted_rooms = [];
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Handle incoming messages from WebSocket setted_rooms if needed
  ws.on("message",  (message) => { 
    const { room } = JSON.parse(message);
    ///broadcast(message, room)
    const data = message;
    console.log(setted_rooms)
    if (room) {
      const existingRoom = setted_rooms.find((room_d) => room_d.id === room);

      if (existingRoom) {
        // If the room exists, add the client to the existing room
        existingRoom.clients.add(ws);
        console.log(`Client joined existing room: ${room}`);
      } else {
        // If the room doesn't exist, create a new room and add the client to it
        const newRoom = {
          id: room,
          clients: new Set(),
        };
        newRoom.clients.add(ws);
        setted_rooms.push(newRoom);
        
        console.log(`Client created and joined new room: ${room}`);
      }
 ////-------------------------------------------------------------------------------
      for (const room_d of setted_rooms) {        
        if (room_d.clients.has(ws)) {
          console.log('ws find room')
          room_d.clients.forEach((client) => {
            const msg = data.toString()
            mongo.new_message(msg)
              client.send(msg);                     
              console.log("sent to another")
                    
            });
          break; // Stop broadcasting to other setted_rooms
        }
      }


    } else {
      // Broadcast the message to the appropriate room_d(s)
      for (const room_d of setted_rooms) {
        broadcast(message, room)
        if (room_d.clients.has(ws)) {
          console.log('ws find room')
          room_d.clients.forEach((client) => {
            client.send(message);
            
            console.log("sent to another")
            console.log(room_d, client)
          });
          break; // Stop broadcasting to other setted_rooms
        }
      }
    }

    console.log(`Received message from client: ${data}`);
    ////  {"action":"joinRoom_d","room":"64f9ce04ba8e3b836ba02186"}
    ////{"message":"sdfg","from":"64f8d33b9b1734eac643473f","to":"64f8d41c9b1734eac6434740","room_d":"64f9ce04ba8e3b836ba02186"}
  });
});
 
 
 */

httpServer.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

httpServer.listen(port, () => {
  console.log("Server started on", port);
});

console.log("nodemon started");
