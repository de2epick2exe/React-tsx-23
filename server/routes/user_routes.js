const Router = require('express')
const router = new Router()

const UserController = require('../controller/UserController')
 
router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/geta', UserController.getAll)
router.post('/gettotal', UserController.get_total_users_count)
router.post('/getperday', UserController.get_perday_users_count)
router.post('/setonline', UserController.set_status_online)
router.post('/getonline', UserController.get_status_online)
router.post('/lo', UserController.get_last_online)
router.post('/lr', UserController.get_last_registered)
router.post('/ban', UserController.ban)



module.exports = router