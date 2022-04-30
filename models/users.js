const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    }
})

mongoose.model('User', UserSchema)