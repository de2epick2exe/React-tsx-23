const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
require("dotenv");

const generate_jwt = (date, username, secret) => {
  data = { date, username };
  const token = jwt.sign(data, secret);
  return token;
};

class UserController {
  async registration(req, res) {
    const { email, username, password } = req.body;
    const createdat = new Date();
    console.log(createdat);
    const hashPassword = await bcrypt.hash(password, 5);
    const newUser = await db.query(
      "INSERT INTO public.users (email, username, password, createdat, updatedat) values ($1, $2, $3, $4, $5) RETURNING *",
      [email, username, hashPassword, createdat, createdat]
    );
 
    res.json(newUser);
  }

  async login(req, res, next) {
    const { email, username, password } = req.body;
    
    console.log(email, username, password);
    let user;
    const createdat = new Date();
    if (email === "") {
      console.log("log with username");
      user = await db.query(
        "select id, email, username, password, role  from users where username = $1",
        [username]
      );
      if (user.rows[0] === undefined) {
        return next("user not found");
      }
    }
    if (username === "") {
      console.log("log with em");
      user = await db.query(
        "select id, email, username, password from users where email = $1",
        [email]
      );
    }

    let comparePassword = bcrypt.compareSync(password, user.rows[0].password);
    const secret = process.env.SECRET_JWT;
    const token = generate_jwt(createdat, username, secret);
    const log_user = user.rows[0].username;
    const log_email = user.rows[0].email;
    const data = {
      token,
      log_user,
      log_email,
    };

    
    
    console.log(user.rows[0].password);
    comparePassword ? res.json(data) : res.json("invalid pass");
  }
  async check(req, res) {}
  async getAll(req, res) {
    const users = await db.query("SELECT * FROM public.users");
    res.json(users.rows);
  }
}
module.exports = new UserController();
