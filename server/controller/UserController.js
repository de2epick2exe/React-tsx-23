const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
require("dotenv");
const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
  // docker run -d --name <CONTAINER_NAME> -p 127.0.0.1:6379:6379 redis
});

const set_new_today = async () => {
  const total = await redis.get("users_per_day");

  await redis.set("users_per_day", Number(total) + 1);
};
const set_online = async (id) => {
  try {
    const response = await redis.set(id, "online");
    if (response) {
      console.log("new online", id);
    }
  } catch (e) {
    console.log(e);
  }
};

try {
  async function set() {
    await redis.config("SET", "save", "");
    await redis.set("users_per_day", "0");
  }
  async function get() {
    const val = await redis.get("users_per_day");
    console.log("testing users-per-day get:", val);
  }
  set();
  get();
} catch (error) {
  console.log("error", error);
}

const generate_jwt = (date, username, role, secret) => {
  data = { date, username, role };
  const token = jwt.sign(data, secret);
  return token;
};

const test_db_connection = async () => {
  const query = await db.query("SELECT * FROM global_info");
  if (!query) {
    console.log("database error");
  }
  console.log("TESTING DB QUERY is: ", query.rows[0]);
};

test_db_connection();

class UserController {
  async registration(req, res) {
    const { email, username, password } = req.body;
    const createdat = new Date();
    console.log(createdat);
    const hashPassword = await bcrypt.hash(password, 5);
    console.log(hashPassword);
    try {
      const newUser = await db.query(
        "INSERT INTO users (email, username, password, createdat, updatedat, avatar) values ($1, $2, $3, $4, $5) RETURNING *",
        [email, username, hashPassword, createdat, createdat, "default.png"]
      );
      console.log(newUser);
      const secret = process.env.SECRET_JWT;
      const user = await db.query(
        "SELECT id, role, createdAt FROM users WHERE username = $1",
        [newUser.rows[0].username]
      );
      const id = user.rows[0].id;
      const user_date = user.rows[0].createdat;
      const user_role = user.rows[0].role;
      const token = generate_jwt(user_date, username, user_role, secret);

      console.log(user_date, user_role, token);
      const data = {
        id,
        token,
        username,
        email,
        user_role,
      };
      set_online(id);
      res.json(data);
    } catch (e) {
      if (e.code == 23505) {
        return res.json({ error: "user already created" });
      }
      return console.log(e);
    }
  }

  async login(req, res, next) {
    const { email, username, password } = req.body;

    console.log(email, username, password);
    let user;

    if (email === "") {
      console.log("log with username");
      user = await db.query(
        "select id, email, username, password, role, createdAt, avatar from users where username = $1",
        [username]
      );
      if (user.rows[0] === undefined) {
        return res.status(403).json({ error_user: "user not found" });
      }
    }
    if (username === "") {
      console.log("log with em");
      user = await db.query(
        "select id, email, username, password, role, createdAt, avatar from users where email = $1",
        [email]
      );
      if (user.rows[0] === undefined) {
        return res.status(403).json({ error_user: "error user not found" });
      }
    }

    let comparePassword = bcrypt.compareSync(password, user.rows[0].password);
    if (!comparePassword) {
      return res.status(403).json({ error_password: " incorrect password" });
    }
    const secret = process.env.SECRET_JWT;

    const token = generate_jwt(
      user.rows[0].createdat,
      username,
      user.rows[0].role,
      secret
    );
    console.log(user.rows[0].createdat);
    const id = user.rows[0].id;
    const log_user = user.rows[0].username;
    const log_email = user.rows[0].email;
    const role = user.rows[0].role;
    const avatar = user.rows[0].avatar;
    const data = {
      id,
      token,
      log_user,
      log_email,
      role,
      avatar,
    };
    set_online(id);
    console.log(user.rows[0].password);
    res.json(data);

    // need a exception cheker
    const query =
      'UPDATE global_info SET "USERS_PER_DAY" = "USERS_PER_DAY"::integer + 1';
    const updt_login = await db.query(query);
    set_new_today();
  }

  async check(req, res) {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, secret);
      res.json(decoded);
    } catch (error) {
      res.json("Error decoding JWT:", error.message);
    }
  }

  async ban(req, res) {
    try {
      const { id } = req.body;
      const responce = await db.query(
        "UPDATE user_info SET status='BANNED' WHERE users_id = $1;",
        [id]
      );
      res.json({ status: "200" });
    } catch (error) {
      res.json(error);
    }
  }

  async unban(req, res) {
    try {
      const { id } = req.body;
      const responce = await db.query(
        "UPDATE user_info SET status='ACTIVE' WHERE users_id = $1;",
        [id]
      );
      res.json({ status: "200" });
    } catch (error) {
      res.json(error);
    }
  }

  async getAll(req, res) {
    try {
      const { token, username } = req.body;
      console.log(token, username);
      if (token == null || username == "") {
        return res.json({ err: "no data" });
      } else {
        const user_db = await db.query(
          "SELECT createdAt, role FROM users WHERE username = $1 ",
          [username]
        );
        console.log("user data is", user_db.rows[0]);
        const date = user_db.rows[0].createdat;
        const role = user_db.rows[0].role;
        const data = {
          date,
          username,
          role,
        };
        const secret = process.env.SECRET_JWT;
        const decode = jwt.verify(token, secret);
        const verify = decode.role == "ADMIN";
        if (verify) {
          console.log("verifyed");
          const users = await db.query(
            "SELECT id, email, username, role, status, avatar FROM public.users FULL OUTER JOIN public.user_info ON users.id = user_info.users_id;"
          );
          const users_online = [];
          console.log(users.rows);
          for (const obj of users.rows) {
            const id = obj.id;
            const status_red = await redis.get(id);
            if (obj.status == "BANNED") {
              users_online.push({ ...obj });
            } else {
              if (status_red == null) {
                users_online.push({ ...obj, status: "offline" });
              } else {
                users_online.push({ ...obj, status: status_red });
              }
            }
          }

          console.log("user online");
          res.json(users_online);
        } else {
          res.json("ACCESS DENIED");
        }
      }
    } catch (e) {
      res.json({ message: e });
    }
  }

  async get_target_user(req, res) {
    try {
      const { data } = req.query;
      console.log(data);
      /// add if data == number/uk/eng
      let isnum = /^\d+$/.test(data);
      let isEmailLike =
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(data);

      if (isEmailLike) {
        const user_data = await db.query(
          "SELECT username, role, avatar from public.users where LOWER(email) = LOWER($1)",
          [data]
        );
        console.log("tar em");
        return res.json(user_data.rows[0]);
      }
      if (isnum) {
        const user_data = await db.query(
          "SELECT username, role, avatar from public.users where id =$1",
          [data]
        );
        console.log("tar num");

        return res.json(user_data.rows[0]);
      } else {
        const user_data = await db.query(
          "SELECT username, role, avatar from public.users where username =$1",
          [data]
        );
        console.log("tar username");
        return res.json(user_data.rows[0]);
      }
    } catch (e) {
      res.json({ error: e });
    }
  }

  async get_recomended_users(page , limit){
    const offset = page * limit - limit
    const users = await db.query('SELECT id, username, role, avatar FROM users LIMIT $1 OFFSET $2',[limit, offset])
    console.log(users.rows)
    return {event: "recomended_users", data: users.rows}
  }


  async get_total_users_count(req, res) {
    try {
      const { token } = req.body;
      const secret = process.env.SECRET_JWT;
      const decode = jwt.verify(token, secret);

      const verify = decode.role == "ADMIN";
      if (verify) {
        const users = await db.query('SELECT "USERS_TOTAL" FROM global_info');
        res.json(users.rows);
      } else {
        res.json("ACCESS DENIED");
      }
    } catch (e) {
      res.json({ message: e });
    }
  }

  async get_perday_users_count(req, res) {
    try {
      const { token } = req.body;
      const secret = process.env.SECRET_JWT;
      const decode = jwt.verify(token, secret);
      const verify = decode.role == "ADMIN";
      if (verify) {
        const users = await redis.get("users_per_day");
        if (!users) {
          try {
            const users_pg = await db.query(
              'SELECT "USERS_PER_DAY" FROM global_info'
            );
            return res.json(users_pg.rows);
          } catch (error) {
            console.log(error);
          }
        }
        res.json([{ USERS_PER_DAY: users }]);
      } else {
        res.json("ACCESS DENIED");
      }
    } catch (e) {
      res.json({ message: e });
    }
  }

  /////-------------------------------------------------------------------------
  async set_status_online(req, res) {
    const { id } = req.body;
    const response = await redis.set(id, "online");
    res.json("ok");
  }

  async get_status_online(req, res) {
    try {
      //// update users from table with only 10 for req
      const idList = req.body;
      const users_online = [];
      for (const obj of idList) {
        const id = obj.id;
        const responce = await redis.get(id);
        if (responce == null) {
          users_online.push({ id, responce: "offline" });
        } else {
          users_online.push({ id, responce });
        }
      }
      res.json(users_online);
    } catch (error) {
      res.json(error);
    }
  }

  async get_last_online(req, res) {
    const { token } = req.body;
    const secret = process.env.SECRET_JWT;
    const decode = jwt.verify(token, secret);
    const verify = decode.role == "ADMIN";
    if (verify) {
      /// set hourly
      const count = await db.query(
        'SELECT "USERS_ONLINE_LAST_WEEK" FROM global_info'
      );
      res.json(count.rows[0]);
    } else {
      res.json({ message: "access denied" });
    }
  }

  async get_last_registered(req, res) {
    const { token } = req.body;
    const secret = process.env.SECRET_JWT;
    const decode = jwt.verify(token, secret);
    const verify = decode.role == "ADMIN";
    if (verify) {
      /// set hourly
      const count = await db.query(
        'SELECT "USERS_REGISTERED_PER_WEEK" FROM global_info'
      );
      res.json(count.rows[0]);
    } else {
      res.json({ message: "access denied" });
    }
  }

  async update_avatar(req, res) {
    try {
      const { filename, id } = req.body;
      const data = await db.query(
        "UPDATE users Set avatar = $1 WHERE id= $2 ",
        [filename, id]
      );
      res.json({ status: 200 });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
  /*

|user_id| friends_list[] | waiting_accept[] |hidden_not_accepted|

*/
  async get_friends(id) {
    try {
      const res = await db.query(
        "SELECT (friends_list) FROM public.friends WHERE user_id=$1",
        [id]
      );
      return { event: "get_friends", data: res.rows };
    } catch (error) {
      console.log(error);

      return { erro: error.message };
    }
  }
  async add_friend(id, add_id) {
    /* id wanted to add will add a sender (who want to add) id
  if id 7 adds id 2 :
  |user_id| friends_list[] | waiting_accept[] |hidden_not_accepted|
  | 2|      [...]     |        [7]       |                   |
    
  */
    try {
      console.log(add_id);

      const res = await db.query(
        "INSERT INTO public.friends (user_id, waiting_accept) VALUES ($1, ARRAY[$2]) ON CONFLICT (user_id) DO UPDATE SET waiting_accept = public.friends.waiting_accept || $2 WHERE public.friends.user_id = $1",
        [id, add_id]
      );
      return { event: "add_friend", data: res.rows[0] };
    } catch (error) {
      console.log(error);
      return { erro: error.message };
    }
  }
  async get_waiting_list(id) {
    try {
      const res = await db.query(
        "SELECT (waiting_accept) FROM public.friends WHERE user_id=$1",
        [id]
      );
      return { event: "get_waiting_list", data: res.rows };
    } catch (error) {
      console.log(error);

      return { erro: error.message };
    }
  }

  async accept_friend(id, accepted_id) {
    try {
      const res = await db.query(
        "UPDATE public.friends SET waiting_accept = array_remove(waiting_accept, $2), friends_list = friends_list || $2 WHERE user_id = $1",
        [id, accepted_id]
      );
      return { event: "accept_friend", data: res.rows };
    } catch (error) {
      console.log(error);
    }
  }
  async delete_friend(id, todelete_id) {
    try {
      const res = await db.query(
        "UPDATE public.friends SET friends_list = array_remove(friends_list, $2), hidden_not_accepted = hidden_not_accepted || $2 WHERE user_id = $1",
        [id, todelete_id]
      );
      return { event: "delete_friend", data: res.rows };
    } catch (error) {
      console.log(error);

      return { erro: error.message };
    }
  }
  async reject_request(id, rejected_id) {
    try {
      const res = await db.query(
        "UPDATE public.friends SET hidden_not_accepted = array_remove(hidden_not_accepted, $2), hidden_not_accepted = hidden_not_accepted || $2 WHERE id = $1",
        [id, rejected_id]
      );
      return { event: "reject_request", data: res.rows };
    } catch (error) {
      return { erro: error.message };
    }
  }
  async check_user_status(id, cid) {
    const res = await db.query(
      "SELECT CASE WHEN $2::varchar = ANY(friends_list) THEN 'friends_list' WHEN $2::varchar = ANY(waiting_accept) THEN 'waiting_accept' WHEN $2::varchar = ANY(hidden_not_accepted) THEN 'hidden_not_accepted' ELSE NULL END AS matched_column FROM public.friends WHERE user_id = $1;",
      [id,cid]
    );
    console.log('checked status', id, cid, res.rows)
    return { event: "check_user_status", data: res.rows };
  }
}
module.exports = new UserController();
