// app.js
const express = require('express');
// const route = require('./router');
const cors = require('cors');
const bodyParser = require('body-parser'); // doc duoc du lieu gui tu FE ve
const app = express();
const db = require('./config/database')

// Connect to database
db.connect()


const port = 3000 || process.env.PORT

// Limit data
app.use(bodyParser.json({ limit: '50mb' }))

app.get('/',(req,res)=>{
    res.send("hello word")
})

// Allow access
// app.use(cors(
// // {
// //     origin: process.env.URL_CLIENT,
// //     credentials: true
// // }
// ));
app.use(cors())
// route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
