const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const authRoutes = require('../routes/auth')
const booksRoutes = require('../routes/books')

const app = express()

const MONGODB_KEY = dotenv.config().parsed.MONGODB_KEY

mongoose
    .connect(MONGODB_KEY)
    .then(() => console.log('Successful connection to MongoDB !'))
    .catch(() => console.log('Connection to MongoDB failed !'))

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
