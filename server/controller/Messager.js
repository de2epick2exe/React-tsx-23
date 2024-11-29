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
            "SELECT id, title, avatars, admins FROM channels WHERE room_id =$1",
            [r.room_id]
          );
          console.log("channel =", channel.rows);
          console.log("room id =", r.room_id);

          const data = {
            id: channel.rows[0].id,
            username: channel.rows[0].title,
            admins: channel.rows[0].admins,
            is_follow: true,
            type: "channel",
            room_id: r.room_id,
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
  async create_post(req, res) {
    try {
      console.log(req.body, req);
      const { room, message, user_id, date } = req.body;
      const id = room;
      const content = message;
      console.log("types before check:", typeof user_id);
      const check = await db.query(
        "SELECT id  FROM channels  WHERE $1 = ANY(admins) AND room_id = $2 ",
        [user_id.toString(), id]
      );
      console.log("check is:", check.rows, typeof user_id);
      if (check) {
        const post = await db.query(
          "INSERT INTO post (content, channel_id, user_id, date) VALUES ($1, $2, $3, $4) RETURNING *",
          [content, check.rows[0].id, user_id, date]
        );
        const data = {
          event: "message",
          status: 200,
          [id]: { ...post.rows[0] },
        };
        return [data];
      }
      return [
        {
          event: "create_post",
          status: 404,
        },
      ];
    } catch (error) {
      console.log(error);
    }
  }
  async create_comment(req, res) {
    console.log(req.body, req);
    const { post_id, comment, date, type, user_id } = req.body;
    console.log("create comment data: ", post_id, comment, date, type);
    const content = await db.query(
      "INSERT INTO comments(type, comment, post_id, date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [type, comment, post_id, date, user_id]
    );
    const data = {
      status: 200,
      comment: content.rows,
      event: "create_comment",
    };

    return [data];
  }
  async create_self_post(req, res) {
    console.log(req.body, req);
    const { user_id, post, date, type } = req.body;
    console.log("create post data: ", user_id, post, date, type);
    if (type == "self_closed") {
      const content = await db.query(
        "INSERT INTO self_posts_closed VALUES ($1, $2, $3) RETURNING *",
        [user_id, post, date]
      );
      const data = {
        status: 200,
        post: content.rows,
        event: "self_post",
      };
      return [data];
    }
    const content = await db.query(
      "INSERT INTO self_posts_open(user_id, post, date) VALUES ($1, $2, $3) RETURNING *",
      [user_id, post, date]
    );
    const data = {
      status: 200,
      post: content.rows,
      event: "user_post",
    };
    return [data];
  }
  async get_rooms_messages(id) {
    try {
      //need to add limiter*
      console.log("rooms_messages for id: ", id);
      const room_type = await db.query("SELECT type from rooms where id = $1", [
        id,
      ]);
      let res;
      let type;
      console.log(room_type.rows[0].type);
      if (room_type.rows[0].type == "channel") {
        console.log("type channel");
        res = await db.query(
          "SELECT * FROM post WHERE channel_id IN ( SELECT channels.id FROM channels JOIN rooms ON channels.room_id = rooms.id WHERE rooms.id = $1 );",
          [id]
        );
        type = "channel";
      } else {
        console.log("type private");
        res = await db.query("SELECT * FROM messages WHERE room_id = $1", [id]);
        type = "chat";
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
  async get_profile_posts(req, res) {
    const { user_id } = req.body;
    console.log("Profile posts for id:", user_id);
    const profile_posts = await db.query(
      `SELECT self_posts_open.*, users.username, users.avatar, COALESCE( (SELECT json_agg(json_build_object( 'id', comments.id, 'type', comments.type, 'comment',comments.comment, 'date', comments.date, 'user_id', comments.user_id, 'avatar', comments_users.avatar, 'username', comments_users.username )) FROM comments LEFT JOIN users AS comments_users ON comments.user_id = comments_users.id WHERE comments.post_id = self_posts_open.id ),'[]'::json )AS comments FROM self_posts_open LEFT JOIN users on self_posts_open.user_id = users.id WHERE self_posts_open.user_id = $1`,
      [user_id]
    );
    console.log("Profile posts: ", profile_posts.rows[0]);

    return [
      {
        event: "profile_posts",
        data: profile_posts.rows,
      },
    ];
  }
  async get_profile_post(req, res) {
    const { id } = req.body;
    console.log("Profile post  id:", id);
    const profile_post = await db.query(
      "SELECT self_posts_open.*, users.username, users.avatar FROM self_posts_open LEFT JOIN users ON self_posts_open.user_id = users.id WHERE self_posts_open.id = $1",
      [id]
    );
    const comments = await db.query(
      "SELECT comments.*, users.avatar, users.username FROM comments RIGHT JOIN users ON comments.user_id = users.id WHERE post_id = $1",
      [profile_post.rows[0].id]
    );
    console.log("comments:", comments.rows)

    console.log("Profile all data:", {
      ...profile_post.rows,
      comments: [comments.rows],
    });
    return [
      {
        event: "profile_post",
        data: [
          {
            ...profile_post.rows[0],
            comments: [comments.rows],
          },
        ],
      },
    ];
  }
  async get_self_posts(req, res) {
    const { id } = req.body;
    const closed_posts = await db.query(
      "SELECT * FROM self_posts_closed WHERE user_id = $1",
      [id]
    );
    return [
      {
        event: "self_closed_posts",
        data: closed_posts.rows,
      },
    ];
  }
  async get_recomends(req, res) {
    try {
      const { offset, lim } = req.body;
      console.log("get recomentds");
      const recomends = await db.query(
      `SELECT self_posts_open.*, users.username, users.avatar, COALESCE( (SELECT json_agg(json_build_object( 'id', comments.id, 'type', comments.type, 'comment',comments.comment, 'date', comments.date, 'user_id', comments.user_id, 'avatar', comments_users.avatar, 'username', comments_users.username )) FROM comments LEFT JOIN users AS comments_users ON comments.user_id = comments_users.id WHERE comments.post_id = self_posts_open.id ),'[]'::json )AS comments FROM self_posts_open LEFT JOIN users on self_posts_open.user_id = users.id OFFSET $1 LIMIT $2`,
        [offset, lim]
      );
      return [
        {
          event: "recomends_posts",
          data: recomends.rows,
        },
      ];
    } catch (e) {
      console.log("get recomends posts error", e.message);
    }
  }

  async get_latest_messaging_content(req, res) {
    try {
      console.log(req, req.body);
      console.log(req.body);

      const { id } = req.body;

      const last_messages = await db.query(
        "SELECT DISTINCT ON (room_id) * FROM messages WHERE room_id IN (SELECT room_id FROM conversations WHERE user_id = $1) ORDER BY room_id, message_id DESC;",
        [id]
      );

      const last_posts = await db.query(
        "SELECT DISTINCT ON (post.channel_id) post.*, channels.room_id FROM post RIGHT JOIN channels ON channels.id = post.channel_id WHERE channels.id IN ( SELECT channel_id FROM post WHERE channel_id IN ( SELECT channels.id FROM channels WHERE room_id IN ( SELECT room_id FROM conversations WHERE user_id = $1 ) ) )",
        [id]
      );
      console.log(
        "latest_messaging_content",
        last_messages.rows /*last_posts.rows*/
      );
      console.log("latest_post_content", last_posts.rows);

      const data = [
        {
          event: "get_latest_messaging",
          status: 200,
        },
      ];
      last_messages.rows.forEach((room) => {
        data[0][room.room_id] = room;
      });
      last_posts.rows.forEach((room) => {
        data[0][room.room_id] = room;
      });
      console.log(data);
      ///data[0][id].push(...last_posts.rows)
      return data;
    } catch (error) {
      console.log("latest messaging content error:", error);
    }
  }

  async follow_onChannel(req, res) {
    try {
      const { channel_id, user_id, room_id } = req.body;
      const check = await db.query(
        "SELECT * from channels_followers WHERE follower_id = $1 AND channel_id = $2",
        [user_id, channel_id]
      );
      console.log("event",check.rows.length == 0? "follow": "unfollow" )
      if (check.rows.length == 0) {        
        
        const room_conversation = await db.query(
          "INSERT INTO conversations (user_id, room_id) VALUES ($1, $2)",
          [user_id, room_id]
        );
        const follow = await db.query("INSERT INTO channels_followers (follower_id, channel_id) VALUES ($1, $2)", [
          user_id,
          channel_id,
        ]);
        
        const data = {
          status: 200,
          event: "follow",
          id_room: follow.rows[0],
        };
        return data;
      }
      const del_room_conversation = await db.query(
        "DELETE FROM conversations WHERE user_id = $1 AND room_id = $2",
        [user_id, room_id]
      );
      const unfollow = await db.query(
        "DELETE FROM channels_followers WHERE follower_id = $1 AND channel_id = $2",
        [user_id, channel_id]
      );
      const data = {
        status: 200,
        event: "unfollow ",
        id_room: unfollow.rows[0],
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async search_channel(req, res) {
    const {title, user_id} = req.body
    console.log(title, user_id)
    try {
      const search_res = await db.query(
        "select channels.*, CASE WHEN channels_followers.follower_id IS NOT NULL THEN true ELSE false END AS isfollowed from channels LEFT join channels_followers on channels.id = channels_followers.channel_id AND channels_followers.follower_id = $1  where channels.title = $2", 
        [user_id, title]
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
        console.log("entity in searching res:", ent);
        data[0].data.push({
          id: ent.id,
          username: ent.title,
          channel_name: ent.title,
          rooms_id: ent.room_id,
          type: "channel",
          ...ent,
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
  async update_self_post(req, res) {
    try {
      const { id, post, type } = req.body;
      if (type == "open") {
        const updated_post = await db.query(
          "UPDATE self_posts_open SET post = $1 WHERE id = $2 RETURNING *",
          [post, id]
        );
        const data = {
          event: "update_user_post",
          status: 200,
          post: updated_post.rows[0],
        };
        return data;
      }
      const updated_post = await db.query(
        "UPDATE self_posts_closed SET post = $1 WHERE id = $2 RETURNING *",
        [post, id]
      );
      const data = {
        event: "update_self_post",
        status: 200,
        post: updated_post.rows[0],
      };
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async update_comment(req, res) {
    try {
      const { id, post, type } = req.body;
      const updated_post = await db.query(
        "UPDATE comments SET post = $1 WHERE id = $2 RETURNING *",
        [post, id]
      );
      const data = {
        event: "update_user_comment",
        status: 200,
        post: updated_post.rows[0],
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
  async delete_self_post(req, res) {
    try {
      const { id, type } = req.body;
      console.log("delete self post", type, id);
      if (type == "open") {
        const post = await db.query(
          "DELETE FROM self_posts_open WHERE id = $1 RETURNING id",
          [id]
        );
        const data = {
          event: "delete_user_post",
          status: 200,
          post: post.rows[0],
        };
        return [data];
      }
      const post = await db.query(
        "DELETE FROM self_posts_closed WHERE id = $1 RETURNING id",
        [id]
      );
      const data = {
        event: "delete_self_post",
        status: 200,
        post: post.rows[0],
      };
      return [data];
    } catch (error) {
      console.log(error);
    }
  }
  async delete_comment(req, res) {
    try {
      const { id, type } = req.body;
      console.log("delete comment", type, id);
      const post = await db.query(
        "DELETE FROM comments WHERE id = $1 RETURNING id",
        [id]
      );
      const data = {
        event: "delete_comment",
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
