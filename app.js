require('dotenv').config()

const express = require('express')
const tasks = require('./routes/tasks')
const cors = require('cors')
const morgan = require('morgan')

const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

//Security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const app = express()

//middlewares
app.set('trust proxy', 1)
// app.use(rateLimiter({
//   windowMs: 15*60*1000,
//   max: 100,
// }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    next()
})

//routes
app.use('/api/v1/tasks', tasks)
app.use(notFound)
app.use(errorHandler)

const port  = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (err) {
        console.log(err)
    }
}

start()