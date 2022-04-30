const router = require('express').Router()
const passport = require('passport')

router.get('/google', 
passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/user/login'
}))

module.exports = router