const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController{
    async registration(req, res){
        const {email, username, password } = req.body 
        const  createdat = new Date()
        console.log(createdat)
        const hashPassword = await bcrypt.hash(password, 5)
        const newUser = await db.query(
            'INSERT INTO public.users (email, username, password, createdat, updatedat) values ($1, $2, $3, $4, $5) RETURNING *',
             [email, username, hashPassword, createdat, createdat])
          res.json(newUser)
         }
    async login(req, res, next){ 
        const {email, username, password } = req.body 
        let user;
        if(email === ''){
            console.log('log with username')
            user = await db.query('select id, email, username, password from users where username = $1', [username])
            if(user.rows[0] === undefined){
              return next('user not found') 
            }
           
             
        }
        if(username === ''){
            console.log('log with em')
            user = await db.query('select id, email, username, password from users where email = $1', [email])
        }
         
        //const pass = await db.query('select password from users where password = $1 ', [password])
       // res.json(user.rows)
        const o = user.rows
        const obj =o.reduce(
            (obj, item) => Object.assign(obj, { ['password']: item.password}), {});
        console.log(obj)
        console.log(Object.values(obj))
        const ps = Object.values(obj)
        const ts = ps.toString()
        console.log(ts)
        
        let comparePassword = bcrypt.compareSync(password, ts)
        comparePassword ? res.json('logined') : res.json('invalid pass')
       
    }
    async check(req, res){

    }
    async getAll(req, res){
        const users = await db.query('SELECT * FROM public.users')
        res.json(users.rows)
    }
   



}
module.exports = new UserController()