require('dotenv').config({ path: '.env' })
const express = require('express')
const path = require('path')
const connectingToMongoDB = require('./connections/connecting-to-mongodb')
const authRoutes = require('./routes/auth')
const booksRoutes = require('./routes/books')

const app = express()

connectingToMongoDB(process.env.MONGODB_KEY)

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.use('/api/auth', authRoutes)
app.use('/api/books', booksRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
