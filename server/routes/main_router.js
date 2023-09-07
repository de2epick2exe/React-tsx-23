const Router = require('express')
const router = new Router()
const userRouter = require('./user_routes')
const wordsRouter = require('./word_routes')
const messagerRouter = require('./messager_routes')
 
router.use('/user', userRouter)
router.use('/en', wordsRouter)
router.use('/room', messagerRouter)
  
module.exports = router