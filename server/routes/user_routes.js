const Router = require('express')
const router = new Router()

const UserController = require('../controller/UserController')
 
router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/geta', UserController.getAll)

module.exports = router