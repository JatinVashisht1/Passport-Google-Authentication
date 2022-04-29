const express = require('express')
const port = 4000
const app = express()

app.use(require('./routes'))

app.listen(port, ()=>{
    console.log(`app listening at http://localhost:${port}`)
})