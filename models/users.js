const mongoose = require('mongoose')
const { stringify } = require('nodemon/lib/utils')

const contentEntity = {
    title: String,
    content: String,
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    hash: {
        type: String,
        required: false,
    },
    salt: {
        type: String,
        required: false,
    },
    firstName:{
        type: String,
        required: false,
        trim: true,
    },
    lastName:{
        type: String,
        required: false,
        trim: true,
    },
    blogs: [{
        type: contentEntity
    }]
})

mongoose.model('User', UserSchema)