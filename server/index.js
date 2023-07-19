const express = require("express");
require("dotenv").config({ path: "./.env.server" });
const routes = require("./routes/main_router");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const WebSocket = require("ws");


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


httpServer.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

httpServer.listen(port, () => {
  console.log("Server started on", port);
});

console.log("nodemon started");
