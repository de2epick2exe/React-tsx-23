const Router = require('express')
const router = new Router()

const UserController = require('../controller/UserController')
 

router.get('/profile', UserController.get_target_user)


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
router.post('/unban',UserController.unban)
router.post('/room:id', UserController.ban)
router.post('/update_avatar', UserController.update_avatar)



module.exports = router