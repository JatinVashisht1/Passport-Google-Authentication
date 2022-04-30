const mongoose = require('mongoose')

require('dotenv').config()

// const CONNECTION_STRING = "mongodb://localhost:27017/demo_project_bp_db"
const CONNECTION_STRING = process.env.CONNECTION_STRING

mongoose.connect(CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
    console.log('\n-------> Database Connected\n');
})
