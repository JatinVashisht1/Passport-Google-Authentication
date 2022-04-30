const passport = require('passport')
const googleStrategy = require('passport-google-oauth2').Strategy
require('dotenv').config()

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET

authUser = (request, accessToken, refreshToken, profile, done)=>{
    return done(null, profile);
}

const strategy = new googleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
    },
    authUser
)

module.exports.strategy = strategy