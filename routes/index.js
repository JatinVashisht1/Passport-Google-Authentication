const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/user', require('./user'))
router.use('/local', require('./local'))
module.exports = router