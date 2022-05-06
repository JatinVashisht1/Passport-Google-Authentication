const router = require('express').Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const utils = require('../lib/utils')

router.get('/createAccount', (req, res, next) => {
    res.render("createAccount.html")
})

router.post('/confirmAccount', async (req, res, next) => {
    console.log("endpoint hit\n")
    const username = req.body.username
    User.findOne({username: username})
    .then(data=>{
        if(!data){
            console.log('data is ', data)
            console.log('username is ', req.body.username)
            const hashPassword = utils.genPassword(req.body.password)
            const hash = hashPassword.hash
            const salt = hashPassword.salt

            const newUser = new User({
                username: username,
                hash: hash,
                salt: salt
            })
            console.log('new user is ', newUser)
            newUser.save()
            .then(user => {
                const jwt = utils.isssueJWT(user)
                res.json({success: 'true', user: user, token: jwt.token, expiresIn: jwt.expiresIn})
            })
            .catch(err => {console.log('user not saved')})
        }else{
            console.log('user not saved')
            res.json({success: 'false'})
        }
    })
    console.log("==========> endpoint hit")
})


let protectLogin = (req, res, next)=>{
    console.log('req.isAuth is ', req.isAuthenticated())
    if(req.isAuthenticated()){
        return res.redirect('/user/dashboard')
    }
    next()
}

router.get('/login', protectLogin, async (req, res, next)=>{
    res.render('loginWithUsernamePassword')
})

router.post('/login', utils.prtLoginRoute ,async (req, res, next)=>{
    const username = req.body.username;
    if(utils.validateUsername(username)){
        await User.findOne({username: username})
        .then(data => {
            hash = data.hash
            salt = data.salt
        })

        console.log('hash is ', hash)
        console.log('salt is ', salt)
        if(utils.validPassword(req.body.password, hash, salt)){
            res.status(200).json({success: "true", url: "http://localhost:3000/user/dashboard"})
        }

    }else{
        return res.status(401).json({success: "false", message: "invalid username and password"})
    }
})

module.exports = router