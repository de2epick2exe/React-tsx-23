const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
require("dotenv");
const Redis = require ('ioredis');
 



/*

db`s tabs:
|users| <= | conversations  | <= |rooms| <= |messages|
|id   |    |id  u_id room_id|    | id  |    | room_id|  

*/
class Messager{
    async global_notify(req, res){
        const {message} = req.body
        const date = new Date()
        const users_id = await db.query('SELECT id from public.users')/// add limit 1000
        /// can i notify all arr in one query?
        const notify_all = await db.query(`INSERT INTO notify (users_id, notification, created_at) SELECT id, '${message}', '${date}' FROM users RETURNING *`)
        /// notify tab  |user_id|notification|createdAT|status(boolean)| 
        res.json({responce: 200})
    }
    async target_user_notify(req, res){
        const {message, id} = req.body
        const date = new Date()
        const notify_all = await db.query('INSERT INTO notify (user_id, notification, created_at, status) values $1, $2,$3,$4',[id, message,date, false])
        /// notify tab  |user_id|notification|createdAT|status(boolean)| 
        res.json({responce: 200})
    }
    async get_notifies(req,res){
        const {id} = req.body
         const responce = await db.query('SELECT notification, created_at FROM public.notify WHERE users_id = $1', [id])
        res.json(responce.rows)
        
    }

    

    async get_rooms_list(id){
        try{        
       const rooms = await db.query('SELECT c.id AS conversation_id, c.user_id, c.room_id AS room_id, r.type FROM public.conversations c LEFT JOIN public.rooms r ON c.room_id = r.id WHERE c.user_id = $1', [id])
       const rooms_data = []
       for (const r of rooms.rows) {
            if(r.type == 'private messages'){
                const user = await db.query('WITH subquery AS ( SELECT user_id FROM conversations WHERE room_id = $1 AND user_id != $2 ) SELECT id, username FROM users WHERE id IN (SELECT user_id FROM subquery)', [r.room_id, id])
               
                const data = {
                    id : user.rows[0].id,
                    username: user.rows[0].username,
                    rooms_id: r.room_id
                }
                rooms_data.push( data)
                }
            else{
                console.log('chat')
            }}     
       
       console.log('rdata_______:',rooms_data)
        return rooms_data
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
            return JSON.stringify(data)

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

    async rooms_messages(data){
        try{
            const {room_id} = data
            const res = await db.query("SELECT * FROM messages WHERE room_id = $1", [room])
            res.json(res)}
            catch(error){
                res.json(error)
            }
    }

    async send_message(msg){
        try{
            
        const {to_id, from_id, message, media_url, room_id} = msg
        const res = await db.query("INSERT INTO messages( to_id, from_id, message, media_url, room_id) VALUES($1, $2, $3, $4,$5 RETURNING message_id", [to_id, from_id, message, media_url, room_id])
        res.json(res)}
        catch(error){
            res.json(error)
        }
    }

 
}
module.exports = new Messager()