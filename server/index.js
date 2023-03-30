
const express = require('express')

require('dotenv').config({path: './.env.server'})

const routes = require('./routes/main_router')
const cors = require('cors')
const morgan = require('morgan')
const port = process.env.PORT 

const server = express()

function logResponse(req, res, next) {
    const originalJson = res.json;
      
    res.json = function() {
      console.log('Response:', arguments[0]);
      originalJson.apply(res, arguments);
    };
  
    next();
  }
  
  server.use(logResponse);

server.use(morgan('dev'))
server.use(cors({origin:"http://localhost:3000"}))
server.use(express.json());
server.use('/requests', routes)

server.listen(port, ()=>{
    console.log('server started on', port)
})
  
console.log('nodemon started')
 
 