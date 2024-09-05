const Router = require('express')
const Messager = require('../controller/Messager')
const multer = require('multer');


const router = new Router()
/// all of it must be in ws
router.post('/users_rooms', Messager.get_rooms_list)
router.post('/new_private_room', Messager.create_private_room)
router.post('/notify', Messager.target_user_notify)
router.post('/notify_all', Messager.global_notify)
router.post('/get_notify',Messager.get_notifies)
//router.post('/rmsg', Messager.rooms_messages)
router.post('/msg', Messager.send_message)

 
// files request
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

router.post('/save_file', upload.single('img'), Messager.save_file)

module.exports = router