const mongoose = require('mongoose')
const { MONGODB_URI } = require('../utils/helpers')

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('🔥 MongoDB Connected')
    })
    .catch((error) => {
        console.log('❌ MongoDB Connection Error:', error)
    })

module.exports = mongoose