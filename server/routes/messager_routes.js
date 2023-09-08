const Router = require('express')
const Messager = require('../controller/Messager')
const router = new Router()

router.post('/g/:roomid', Messager.get_room)
router.post('/new_private_room', Messager.create_private_room)


module.exports = router