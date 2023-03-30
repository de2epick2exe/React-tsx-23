const Router = require('express')
const router = new Router()
const word_Controller = require('../controller/WordController')

router.get('/allw', word_Controller.select_all)
router.post('/insw', word_Controller.insert_word)
router.get('/rand', word_Controller.getrandom)
router.post('/search', word_Controller.find_word)
module.exports = router 