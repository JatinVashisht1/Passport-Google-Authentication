const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const pathToPrivKey = path.join(__dirname, '..', 'id_rsa_priv.pem')
const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem')
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf-8')
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf-8')

checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() || verifyCredentials(req)) {
        // console.log(`value of isAuth is ${req.isAuthenticated}`)
        return next()
    }
    res.redirect('/user/login')
}

protectLoginRoute = (req, res, next) => {
    if (req.isAuthenticated() || verifyCredentials(req)) {
        console.log(`value of isAuthenticated is ${req.isAuthenticated()} value of verfityCredentials is ${verifyCredentials(req)}`)
        res.redirect('/user/dashboard',)
    }
    return next()
}

async function getHashSalt(username) {
    User.findOne({ username: username })
        .then(data => {
            return data
        })
}

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex')
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return {
        salt: salt,
        hash: genHash
    }
}

function issueJWT(user) {
    const _id = user._id;

    const expiresIn = '2d'

    const payload = {
        sub: _id,
        iat: Date.now()
    }

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: "RS256" })

    return {
        token: "Bearer " + signedToken,
        expiresIn: expiresIn
    }
}

function verifyCredentials(req) {

    if (req.headers.authorization != undefined) {
        const tokenParts = req.headers.authorization.split(' ')
        if (tokenParts[0] === "Bearer" && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
            try {
                const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
                    algorithms: ['RS256']
                })
                console.log('verification is ', verification)
                req.jwt = verification;
                return true;
            } catch (error) {
                console.log("error occured ", error.message)
                // return res.status(401).json({success: false, msg: "you are not authorized to visit this page"})
                return false;
            }
        } else {
            return false;
        }
    }else{
        false
    }
}

function authMiddleware(req, res, next) {

    if (req.isAuthenticated()) {
        next()
    }

    const tokenParts = req.headers.authorization.split(' ')

    if (tokenParts[0] === "Bearer" && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
        try {
            const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
                algorithms: ['RS256']
            })
            console.log('verification is ', verification)
            req.jwt = verification;
            next()
        } catch (error) {
            console.log("error occured ", error.message)
            return res.status(401).json({ success: false, msg: "you are not authorized to visit this page" })
        }
    } else {
        res.redirect('/user/login')
    }
}

async function validateUsername(username) {
    await User.findOne({ username: username })
        .then(data => {
            console.log(data.username)

            if (data.username === username) {
                console.log('returning true')
                return true
            }
        })
    console.log('returning false')
    return false
}

module.exports.chkAuthenticated = checkAuthenticated;
module.exports.prtLoginRoute = protectLoginRoute;
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.isssueJWT = issueJWT;
module.exports.authMiddleware = authMiddleware;
module.exports.validateUsername = validateUsername;
module.exports.getHashSalt = getHashSalt;