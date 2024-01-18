const express = require("express");
require("dotenv").config({ path: "./.env.server" });
const routes = require("./routes/main_router");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const WebSocket = require("ws");
const Messager = require("./controller/Messager");
const Redis = require("ioredis");
const UserController = require("./controller/UserController");

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

const clients = {};
const setted_rooms = [];
wss.on("connection", (ws) => {
  console.log("user connected");
  const clientId = Date.now(); // neeed to Implement function to generate unique IDs
  clients[clientId] = ws;
  /*
  clients[clientId].send(JSON.stringify({"connection_true": "get_id"}))  
  */
  // ws send to  client get id and repalce this client id
  // delete clients[clientId];

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log("Received message:", parsedMessage);

      ///DO NOT LOST TO CHANGE MESSAGER FUNCTIONS/ ROUTES
      switch (parsedMessage.event) {
        case "message":
          for (const live_room of setted_rooms) {
            if (live_room.clients.has(ws)) {
              live_room.clients.forEach((client) => {
                console.log("finded room for user(current ws)");

                client.send(JSON.stringify([{ ...parsedMessage }]));
                //client.send(message);
                console.log(
                  "Number of clients in room:",
                  live_room.clients.size
                );
                console.log("event send message success");
                console.log("message sended to room");
              });
              break;
            }
          }

          break;
        case "geting_rooms":
          const rooms = await Messager.get_rooms_list(parsedMessage.rooms_for); /// change args in main messager
          console.log("getted rooms", parsedMessage.rooms_for);
          clients[clientId].send(JSON.stringify(rooms)); //JSON.stringify(rooms)
          break;
        case "rooms_messages":
          const msgs = await Messager.rooms_messages(parsedMessage.room_id); /// change args in main messager
          clients[clientId].send(JSON.stringify(msgs));
          break;
        case "connection_to_room":
          //add here to create a room
          const room = parsedMessage.room;
          console.log(room); //--------------------
          if (room) {
            const exist_room = setted_rooms.find(
              (room_id) => room_id.id === room
            );
            if (exist_room) {
              console.log("find room id exist"); ///--------------------
              exist_room.clients.add(ws);
              console.log("Client connected to room"); //-----------------
              clients[clientId].send(
                JSON.stringify([
                  { event: "conection_to_room", connected_to: room },
                ])
              );
            } else {
              const newRoom = {
                id: room,
                clients: new Set(),
              };
              newRoom.clients.add(ws);
              setted_rooms.push(newRoom);
              console.log("Created new room + client joined to room");
              clients[clientId].send(
                JSON.stringify([
                  { event: "connection_to_room", connected_to: room },
                ])
              );
            }
          }
          break;
        case "get_friends":
          const friends_list = await UserController.get_friends(
            parsedMessage.id
          );
          clients[clientId].send(JSON.stringify(friends_list));
          break;
        case "get_accept_list":
          const accept_list = await UserController.get_friends(
            parsedMessage.id
          );
          clients[clientId].send(JSON.stringify(accept_list));
          break;
        case "accept_friend":
          const accepted = await UserController.accept_friend(
            parsedMessage.id,
            parsedMessage.accept_id
          );
          clients[clientId].send(JSON.stringify(accepted));
          break;
        default:
          console.log("Unknown event:", parsedMessage.event);
      }
    } catch (e) {
      console.error("error:____________________________");
      console.warn(e);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

const brodcastMessage = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

function broadcast_room(message, roomID) {
  for (const room_d of setted_rooms) {
    if (room_d.id === roomID) {
      room_d.clients.forEach((client) => {
        client.send(message);
        console.log(message);
      });
      break; // Stop broadcasting to other rooms
    }
  }
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
