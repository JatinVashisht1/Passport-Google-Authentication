const passport = require('passport')
const router = require('express').Router()

router.get('/home', (req, res, next)=>{
    res.status(200).json({status: "Success"})
})

module.exports = router