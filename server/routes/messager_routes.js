const Router = require('express')
const Messager = require('../controller/Messager')
const router = new Router()

router.post('/:roomid', Messager.add_room)



module.exports = router