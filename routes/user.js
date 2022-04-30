const req = require('express/lib/request')
const res = require('express/lib/response')
const passport = require('passport')
const router = require('express').Router()
const checkAuthenticated = require('../lib/utils').chkAuthenticated
const protectLoginRoute = require('../lib/utils').prtLoginRoute

router.get('/login', protectLoginRoute, (req, res, next)=>{
    res.render("login.ejs")
})

router.get('/dashboard', checkAuthenticated, (req, res, next)=>{
    res.render("dashboard.ejs", {name: req.user.displayName})
})

router.post('/logout', (req, res, next)=>{
    const displayName = req.user.displayName
    req.logOut()
    res.redirect("/user/login")
    console.log(`${displayName} is loggedOut`)
})

module.exports = router