const express = require('express')
const { PORT } = require('./utils/helpers')
require('./config/mongoConfig')
require('./config/scheduler')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors({
    origin: 'https://workgrid-five.vercel.app'
}))

app.get('/', (req, res) => {
    res.send('🚀 WorkGrid API is running...')
})
app.use('/user', require('./routes/user.routes'))
app.use('/task', require('./routes/task.routes'))
app.use('/group', require('./routes/group.routes'))

// notifyBeforeDueDate()


app.listen(PORT || 4000, () => {
    console.log(`⚡ Server running on port ${PORT}`)
})