const express = require('express')
const app = express()
const passport = require('passport')
require('dotenv').config()
const strategy = require('./config/passport').strategy
const session = require('express-session')
const port = 3000
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./config/database')
require('./models/users')

app.use(session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())


passport.use(strategy)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})


showLogs = (req, res, next) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session.passport)

    console.log(`\n req.user -------> `)
    console.log(req.user)

    console.log("\n Session and Cookie")
    console.log(`req.session.id -------> ${req.session.id}`)
    console.log(`req.session.cookie -------> `)
    console.log(req.session.cookie)

    console.log("===========================================\n")

    next()
}

let count = 1
app.use(showLogs)
app.use(require('./routes'))
// app.get('/', (req, res, next)=>{
//     res.render('homepage.ejs')
// })
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})