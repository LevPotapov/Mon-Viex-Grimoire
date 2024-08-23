const mongoose = require('mongoose')

const connectingToMongoDB = (mongoKey) => {
    mongoose
        .connect(mongoKey)
        .then(() => console.log('Successful connection to MongoDB !'))
        .catch(() => console.log('Connection to MongoDB failed !'))
}

module.exports = connectingToMongoDB
