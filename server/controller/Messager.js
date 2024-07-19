const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
require("dotenv");
const Redis = require("ioredis");
const { default: axios } = require("axios");

/*

db`s tabs:
|users| <= | conversations  | <= |rooms| <= |messages|
|id   |    |id  u_id room_id|    | id  |    | room_id|  

|users|  <= |     channel_followers     |<=  |channels      |
|id   |     |follower_id   channel_id   |    | admins json{}|




*/
class Messager {
  async global_notify(req, res) {
    const { message } = req.body;
    const date = new Date();
    const users_id = await db.query("SELECT id from public.users"); /// add limit 1000
    /// can i notify all arr in one query?
    const notify_all = await db.query(
      `INSERT INTO notify (users_id, notification, created_at) SELECT id, '${message}', '${date}' FROM users RETURNING *`
    );
    /// notify tab  |user_id|notification|createdAT|status(boolean)|
    res.json({ responce: 200 });
  }
  async target_user_notify(req, res) {
    const { message, id } = req.body;
    const date = new Date();
    const notify_all = await db.query(
      "INSERT INTO notify (user_id, notification, created_at, status) values $1, $2,$3,$4",
      [id, message, date, false]
    );
    /// notify tab  |user_id|notification|createdAT|status(boolean)|
    res.json({ responce: 200 });
  }
  async get_notifies(req, res) {
    const { id } = req.body;
    const responce = await db.query(
      "SELECT notification, created_at FROM public.notify WHERE users_id = $1",
      [id]
    );
    res.json(responce.rows);
  }

  async get_rooms_list(id) {
    try {
      const rooms = await db.query(
        "SELECT c.id AS conversation_id, c.user_id, c.room_id AS room_id, r.type FROM public.conversations c LEFT JOIN public.rooms r ON c.room_id = r.id WHERE c.user_id = $1",
        [id]
      );
      const rooms_data = [
        {
          event: "chats",
          rooms: [],
        },
      ];

      for (const r of rooms.rows) {
        console.log(r.type);
        if (r.type == "private messages") {
          const user = await db.query(
            "WITH subquery AS ( SELECT user_id FROM conversations WHERE room_id = $1 AND user_id != $2 ) SELECT id, username, avatar FROM users WHERE id IN (SELECT user_id FROM subquery)",
            [r.room_id, id]
          );

          const data = {
            id: user.rows[0].id,
            username: user.rows[0].username,
            type: "private",
            rooms_id: r.room_id,
          };

          rooms_data[0].rooms.push(data);
        } else if (r.type == "channel") {
          const channel = await db.query(
            "SELECT id, title, avatars FROM channels WHERE room_id =$1",
            [r.room_id]
          );
          console.log("channel =", channel.rows);
          console.log("room id =", r.room_id);

          const data = {
            id: channel.rows[0].id,
            username: channel.rows[0].title,
            type: "channel",
            rooms_id: r.room_id,
          };

          rooms_data[0].rooms.push(data);
        } else {
          continue;
          const user = await db.query(
            "WITH subquery AS ( SELECT user_id FROM conversations WHERE room_id = $1 AND user_id != $2 ) SELECT id, username, avatar FROM users WHERE id IN (SELECT user_id FROM subquery)",
            [r.room_id, id]
          );
          console.log(user);
          const data = {
            id: user.rows[0].id,
            username: user.rows[0].username,
            type: "chat",
            rooms_id: r.room_id,
          };

          rooms_data[0].rooms.push(data);
        }
      }

      console.log("rdata_______:", rooms_data);
      return rooms_data;
    } catch (err) {
      console.warn(err);
    }
  }

  async create_private_room(req, res) {
    try {
      const { id_1, id_2 } = req.body;
      const room = await db.query(
        "INSERT INTO rooms (type) VALUES ($1) RETURNING id",
        ["PRIVATE"]
      );
      const room_id = room.rows[0].id;

      const room_u1 = await db.query(
        "INSERT INTO conversations (user_id, room_id) VALUES ($1, $2)",
        [id_1, room_id]
      );
      const room_u2 = await db.query(
        "INSERT INTO conversations (user_id, room_id) VALUES ($1, $2)",
        [id_2, room_id]
      );

      const u1 = room_u1.rows[0];
      const u2 = room_u2.rows[0];

      const data = {
        status: 200,
        room: "created",
        id_room: room_id,
      };
      return JSON.stringify(data);
    } catch (error) {
      console.log(error);
    }
  }
  /*
 
 |users|  <= |     channel_followers     |<=  |channels      |
 |id   |     |follower_id   channel_id   |    | admins json{}|
 
 */

  async create_channel(req, res) {
    try {
      console.log(req.body);
      const { id, title, desc } = req.body;

      const room = await db.query(
        "INSERT INTO rooms (type) VALUES ($1) RETURNING id",
        ["channel"]
      );
      const room_id = room.rows[0].id;
      const room_u1 = await db.query(
        "INSERT INTO conversations (user_id, room_id) VALUES ($1, $2)",
        [id, room_id]
      );

      const channel = await db.query(
        "INSERT INTO channels (title, admins, owner, avatars, description, room_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [title, [id], id, ["default.png"], desc, room_id]
      );
      console.log(channel.rows[0].id);
      if (channel) {
        await db.query(
          "INSERT INTO channels_followers (follower_id, channel_id) VALUES ($1, $2) RETURNING id",
          [id, channel.rows[0].id]
        );
      }

      const data = {
        event: "create_chat",
        status: 200,
        room: "created",
        id_room: channel.rows[0],
      };
      return JSON.stringify(data);
    } catch (error) {
      console.log(error);
    }
  }

  async rooms_messages(id) {
    try {
      //need to add limiter*
      console.log("rooms_messages for id: ", id);
      const room_type = await db.query("SELECT type from rooms where id = $1", [
        id,
      ]);
      let res;
      console.log(room_type.rows[0].type);
      if (room_type.rows[0].type == "channel") {
        console.log("type channel");
        res = await db.query(
          "SELECT * FROM post WHERE channel_id IN ( SELECT channels.id FROM channels JOIN rooms ON channels.room_id = rooms.id WHERE rooms.id = $1 );",
          [id]
        );
      } else {
        console.log("type private");
        res = await db.query("SELECT * FROM messages WHERE room_id = $1", [id]);
      }
      console.log(res.rows);
      const rooms_data = [
        {
          event: "rooms_messages",
          [id]: [],
        },
      ];
      rooms_data[0][id].push(...res.rows);
      /// console.log("rooms messages",rooms_data[0], res.rows);
      return rooms_data;
    } catch (error) {
      console.log("error getting rooms", error);
    }
  }
  async create_post(req, res) {
    try {
      console.log(req.body, req);
      const { id, content, userid } = req.body;

      const check = await db.query(
        "SELECT id  FROM channels  WHERE $1 = ANY(admins) AND room_id = $2 ",
        [userid, id]
      );
      const post = await db.query(
        "INSERT INTO post (content, channel_id, user_id) VALUES ($1, $2, $3) RETURNING *",
        [content, check.rows[0].id, userid]
      );
      const data = {
        event: "create_post",
        status: 200,
        post: post.rows[0],
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async get_posts(req, res) {
    try {
      const { id } = req.body;
      const posts = await db.query(
        "SELECT * FROM post WHERE channel_id IN ( SELECT channels.id FROM channels JOIN rooms ON channels.room_id = rooms.id WHERE rooms.id = $1 );",
        [id]
      );
      const data = {
        event: "get_posts",
        status: 200,
        posts: posts.rows,
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async follow_onChannel(req, res) {
    try {
      const { id, userid } = req.body;
      const follow = await db.query("INSERT INTO channels_follows $1, $2", [
        id,
        userid,
      ]);
      const data = {
        status: 200,
        event: "follow",
        id_room: follow.rows[0],
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async search_channel(title) {
    try {
      const search_res = await db.query(
        "SELECT * FROM channels WHERE title =$1",
        [title]
      );

      if (!search_res || search_res.rows.length == 0) {
        const data = {
          event: "searched_channel",
          status: 404,
        };
        console.log("channel =", search_res.rows);
        console.log("room id =", search_res.room_id);
        return [data];
      }
      console.log("channel =", search_res.rows);
      console.log("room id =", search_res.room_id);
      let data = [
        {
          event: "searched_channel",
          data: [],
        },
      ];
      for (const ent of search_res.rows) {     
        console.log('entity in searching res:', ent)
        data[0].data.push({
          id: ent.id,
          username: ent.title,
          channel_name: ent.title,
          rooms_id: title.room_id,
          ...ent
        });
      }
      return data;
    } catch (e) {
      console.log("search channel func error:", e);
    }
  }

  async send_message(msg) {
    try {
      const { from_id, message, media_url, room } = msg;
      console.log(from_id, message, media_url, room);
      const date = new Date();
      const res = await db.query(
        "INSERT INTO messages( to_id, from_id, content, media_url, date,  room_id) VALUES((select user_id from conversations where user_id != $1 and room_id = $5 ), $1, $2, $3, $4, $5) RETURNING *",
        [from_id, message, media_url, date, room]
      );
      ///res.json({res});
      console.log([
        {
          event: "message",
          [res.rows[0].room_id]: [{ ...res.rows[0] }],
        },
      ]);
      return [
        {
          event: "message",
          [res.rows[0].room_id]: { ...res.rows[0] },
        },
      ];
    } catch (error) {
      console.log("sending message error: ", error);
      //res.json(error);
    }
  }

  async save_file(req, res) {
    try {
      const img = req.file;
      console.log(img);
      // send to c++ store server
      const data_from_cpp = await axios.post(
        `http://localhost:${process.env.CDN}/save_file`,
        { img }
      );

      // res.json({status: 200, img})
      res.json(data_from_cpp.data);
    } catch (e) {
      console.log(e);
      res.json({ err: e.message });
    }
  }

  async update_post(req, res) {
    try {
      const { id, content } = req.body;
      const post = await db.query(
        "UPDATE posts SET content = $1 WHERE id = $2 RETURNING id, content",
        [content, id]
      );
      const data = {
        event: "update_post",
        status: 200,
        post: post.rows[0],
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async update_message(id, content) {
    try {
      // const { id, content } = req.body;
      const post = await db.query(
        "UPDATE messages SET content = $1 WHERE message_id = $2 RETURNING message_id, content",
        [content, id]
      );
      const data = {
        event: "update_post",
        status: 200,
        post: post.rows[0],
      };
      return [data];
    } catch (error) {
      console.log(error);
    }
  }

  async delete_post(id, date) {
    try {
      const post = await db.query(
        "DELETE FROM posts WHERE id = $1 RETURNING id, content",
        [id]
      );
      const data = {
        event: "delete_post",
        status: 200,
        post: post.rows[0],
      };
      return [data];
    } catch (error) {
      console.log(error);
    }
  }
  async delete_message(id, date) {
    try {
      const post = await db.query(
        "DELETE FROM messages WHERE message_id = $1 RETURNING message_id, content",
        [id]
      );
      const data = {
        event: "delete_message",
        status: 200,
        message: post.rows[0],
      };
      return [data];
    } catch (error) {
      console.log(error);
    }
  }

  async delete_file(req, res) {
    try {
      const fid = req.body.id;
      console.log(img);
      // send to c++ store server
      const data_from_cpp = await axios.delete(
        `http://localhost:${process.env.CDN}/${fid}`
      );

      // res.json({status: 200, img})
      res.json(data_from_cpp.data);
    } catch (e) {
      console.log(e);
      res.json({ err: e.message });
    }
  }
}
module.exports = new Messager();
