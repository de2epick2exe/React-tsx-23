const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
require("dotenv");

const generate_jwt = (date, username, role, secret) => {
  data = { date, username, role };
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
      /*      generate a jwt token in responce */
    res.json(newUser);
  }

  async login(req, res, next) {
    const { email, username, password } = req.body;
    
    console.log(email, username, password);
    let user;
    
    if (email === "") {
      console.log("log with username");
      user = await db.query(
        "select id, email, username, password, role, createdAt from users where username = $1",
        [username]
      );
      if (user.rows[0] === undefined) {
        return next("user not found");
      }
    }
    if (username === "") {
      console.log("log with em");
      user = await db.query(
        "select id, email, username, password, role, createdAt from users where email = $1",
        [email]
      );
    }
 
    let comparePassword = bcrypt.compareSync(password, user.rows[0].password);
    const secret = process.env.SECRET_JWT;
    
    const token = generate_jwt(user.rows[0].createdat, username,user.rows[0].role, secret);
    console.log(user.rows[0].createdat)
    const log_user = user.rows[0].username;
    const log_email = user.rows[0].email;
    const role = user.rows[0].role;
    const data = {
      token,
      log_user,
      log_email,
      role
    };

    
    
    console.log(user.rows[0].password);
    comparePassword ? res.json(data) : res.json("invalid pass");
  }
  async check(req, res) {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, secret);
      res.json(decoded);
    } catch (error) {
      res.json('Error decoding JWT:', error.message);
    }

  }
  async getAll(req, res) {     
    const {token, username} = req.body
    const user_db = await db.query("SELECT createdAt, role FROM users WHERE username = $1 ", [username])
    console.log("user data is", user_db.rows[0])
    const date = user_db.rows[0].createdat
    const role = user_db.rows[0].role
    const data = {
      date,
      username,
      role
    }
    const secret = process.env.SECRET_JWT;
    const decode = jwt.verify(token, secret)
    const verify = decode.role == "ADMIN"
    if (verify){
    const users = await db.query("SELECT id, email, username, role FROM public.users");
    
    res.json(users.rows);
    }
    else {res.json('ACCESS DENIED')}
  
  }
  
}
module.exports = new UserController();
