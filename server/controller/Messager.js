const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
require("dotenv");
const Redis = require ('ioredis');

class Messager{

    async add_room(req, res){
        try{
        const {roomid} = req.params
        console.log(roomid)
        res.json({mess:'room chek', roomid})
    }
        catch(err){
            console.log(err)
        }
    }
 

}
module.exports = new Messager()