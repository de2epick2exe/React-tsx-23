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
              live_room.clients.forEach(async (client) => {
                console.log("finded room for user(current ws)");
                console.log(parsedMessage);
                const messagedb_res = await Messager.send_message(
                  parsedMessage
                );
                client.send(JSON.stringify(messagedb_res));
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
                  { event: "connection_to_room", connected_to: room },
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

        case "add_friend":
          const add_res = await UserController.add_friend(
            parsedMessage.id,
            parsedMessage.add_id
          );
          clients[clientId].send(JSON.stringify(add_res));
          break;
        case "accept_friend":
          const accepted = await UserController.accept_friend(
            parsedMessage.id,
            parsedMessage.accept_id
          );
          clients[clientId].send(JSON.stringify(accepted));
          break;

        case "reject_request":
          const rejected = await UserController.reject_request(
            parsedMessage.id,
            parsedMessage.reject_id
          );
          clients[clientId].send(JSON.stringify(rejected));
          break;
        case "check_status":
          const check_stat = await UserController.check_user_status(
            parsedMessage.id,
            parsedMessage.cid
          );
          clients[clientId].send(JSON.stringify(check_stat));
          break;
        case "follow_onChannel":
          const follow_onChan = await Messager.follow_onChannel(
            parsedMessage.id,
            parsedMessage.uid
          );
          clients[clientId].send(JSON.stringify(follow_onChan));
          break;
        case "search_channel":
          const search_Chan = await Messager.search_channel(
            parsedMessage.channel_name
          );
          clients[clientId].send(JSON.stringify(search_Chan));
          break;
        //----------------------creating events-----------------------------------

        case "create_channel":
          const create_channel = await Messager.create_channel(parsedMessage);
          clients[clientId].send(JSON.stringify(create_channel));
          break;
        case "create_post":
          const create_post = await Messager.create_post({
            body: { ...parsedMessage },
          });
          for (const live_room of setted_rooms) {
            if (live_room.clients.has(ws)) {
              live_room.clients.forEach(async (client) => {
                console.log("finded room for user(current ws)");
                console.log(parsedMessage);
                client.send(JSON.stringify(create_post));
                //client.send(message);
                console.log(
                  "Number of clients in room:",
                  live_room.clients.size
                );
                console.log("event send message success");
                console.log("post CREATED in CHANNEL room");
              });
              break;
            }
          }
          break;
        //---------------------------getting events------------------------------
        case "rooms_messages":
          const msgs = await Messager.rooms_messages(parsedMessage.room_id); /// change args in main messager
          console.log(`sent messages for ${parsedMessage.room_id}: `, message);
          clients[clientId].send(JSON.stringify(msgs));
          break;
        case "get_posts":
          const get_posts = await Messager.get_posts(parsedMessage.id);
          clients[clientId].send(JSON.stringify(get_posts));
          break;
        case "get_recomended_users":
          const recomended_users = await UserController.get_recomended_users(
            parsedMessage.page,
            parsedMessage.limit
          );
          clients[clientId].send(JSON.stringify(recomended_users));
          break;
        case "get_friends":
          const friends_list = await UserController.get_friends(
            parsedMessage.id
          );
          clients[clientId].send(JSON.stringify(friends_list));
          break;
        case "get_waiting_list":
          const waiting_list = await UserController.get_waiting_list(
            parsedMessage.id
          );
          clients[clientId].send(JSON.stringify(waiting_list));
          break;
        case "geting_rooms":
          const rooms = await Messager.get_rooms_list(parsedMessage.rooms_for); /// change args in main messager
          console.log("getted rooms", parsedMessage.rooms_for);
          clients[clientId].send(JSON.stringify(rooms)); //JSON.stringify(rooms)
          break;
        case "get_latest_messaging":
            const lmsg = await Messager.get_latest_messaging_content({
              body: { ...parsedMessage },
            }); /// change args in main messager
            console.log("latest messaging ws event return for:", parsedMessage.id);
            clients[clientId].send(JSON.stringify(lmsg)); //JSON.stringify(rooms)
        break;
              
        //-----------------------modifying-------------------------------
        case "update_post":
          const update_post = await Messager.update_post(
            parsedMessage.id,
            parsedMessage.content
          );
          for (const live_room of setted_rooms) {
            if (live_room.clients.has(ws)) {
              live_room.clients.forEach(async (client) => {
                console.log("finded room for user(current ws)");
                console.log(parsedMessage);
                client.send(JSON.stringify(update_post));
                //client.send(message);
                console.log(
                  "Number of clients in room:",
                  live_room.clients.size
                );
                console.log("event send message success");
                console.log("post UPDATED in CHANNEL room");
              });
              break;
            }
          }
          break;
        case "update_message":
          const update_msg = await Messager.update_message(
            parsedMessage.message_id,
            parsedMessage.content
          );
          for (const live_room of setted_rooms) {
            if (live_room.clients.has(ws)) {
              live_room.clients.forEach(async (client) => {
                console.log("finded room for user(current ws)");
                console.log(parsedMessage);
                client.send(JSON.stringify(update_msg));
                //client.send(message);
                console.log(
                  "Number of clients in room:",
                  live_room.clients.size
                );
                console.log("event send message success");
                console.log("message UPDATED in room");
              });
              break;
            }
          }
          break;
        //------- Delete commands ------
        case "delete_post":
          for (const live_room of setted_rooms) {
            if (live_room.clients.has(ws)) {
              live_room.clients.forEach(async (client) => {
                console.log("finded room for user(current ws)");
                console.log(parsedMessage);
                const del_post = await Messager.delete_post(parsedMessage.id);
                client.send(JSON.stringify(del_post));
                //client.send(message);
                console.log(
                  "Number of clients in room:",
                  live_room.clients.size
                );
                console.log("event send message success");
                console.log("post DELETED in room");
              });
              break;
            }
          }

          break;
        case "delete_message":
          for (const live_room of setted_rooms) {
            if (live_room.clients.has(ws)) {
              live_room.clients.forEach(async (client) => {
                console.log("finded room for user(current ws)");
                console.log(parsedMessage);
                const del_msg = await Messager.delete_message(
                  parsedMessage.message_id
                );
                client.send(JSON.stringify(del_msg));
                //client.send(message);
                console.log(
                  "Number of clients in room:",
                  live_room.clients.size
                );
                console.log("event send message success");
                console.log("message DELETED in room");
              });
              break;
            }
          }
          break;

        case "delete_friend":
          const deleted = await UserController.delete_friend(
            parsedMessage.id,
            parsedMessage.to_delete
          );
          clients[clientId].send(JSON.stringify(deleted));
          break;

        case "delete_file":
          const file = await Messager.follow_onChannel(
            parsedMessage.id,
            parsedMessage.uid
          );
          clients[clientId].send(JSON.stringify(file));
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
