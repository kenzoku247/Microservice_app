const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

mongoose
.connect(
    process.env.MONGODB_URL
).then(() => console.log("Database is connected successfully!")).catch((err) => { console.log(err) });

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/api_user', require('./route/userRouter'))

app.listen(process.env.PORT || 5001, () => {
    console.log(`User service is running on port 5001!`);
})

module.exports = app


