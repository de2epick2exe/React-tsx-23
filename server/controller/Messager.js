const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
require("dotenv");
const Redis = require ('ioredis');
 
class Messager{

    async get_room(req, res){
        try{
        const {roomid, id} = req.params
        console.log(roomid)
        res.json({message:'room chek', roomid})
    }
        catch(err){
            console.log(err)
        }
    }
    

    async create_private_room(req, res){
        try {
            const {id_1, id_2} = req.body
            const room = await db.query("INSERT INTO rooms (type) VALUES ($1) RETURNING id",['PRIVATE'] )
            const room_id = room.rows[0].id
            
            const room_u1 = await db.query("INSERT INTO conversations (user_id, room_id) VALUES ($1, $2)", [id_1, room_id])
            const room_u2 = await db.query("INSERT INTO conversations (user_id, room_id) VALUES ($1, $2)", [id_2, room_id])
            
            const u1 = room_u1.rows[0]
            const u2 = room_u2.rows[0]
            
            const data = {
                status : 200,
                room: "created",
                id_room: room_id
            }
            res.json(data)

        } catch (error) {
            console.log(error)
        }
    }
    async users_messages_tab(req, res){
        /*SELECT
    c.id AS conversation_id,
    r.type AS room_type,
    m.content AS last_message_content,
    m.date AS last_message_date
FROM
    public.conversations c
RIGHT JOIN
    public.rooms r
ON
    c.room_id = r.id
LEFT JOIN (
    SELECT
        room_id,
        MAX(date) AS max_date
    FROM
        public.messages
    GROUP BY
        room_id
) AS latest_message
ON
    r.id = latest_message.room_id
LEFT JOIN
    public.messages m
ON
    latest_message.room_id = m.room_id
    AND latest_message.max_date = m.date
WHERE
    c.user_id = 96; */
    }
    async send_message(req, res){
        try{
        const {to_id, from_id, message, media_url, room_id} = req.body
        const res = await db.query("INSERT INTO messages( to_id, from_id, message, media_url, room_id) VALUES($1, $2, $3, $4,$5 RETURNING message_id", [to_id, from_id, message, media_url, room_id])
        res.json(res)}
        catch(error){
            res.json(error)
        }
    }
 
}
module.exports = new Messager()