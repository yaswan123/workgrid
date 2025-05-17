const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const { getTasks, getUserTasks, createTask, editTask, addMention, deleteTask, getDayWiseTaskCount } = require('../controllers/task.controller')

router.get('/', getTasks)
router.get('/user/:id', getUserTasks)
router.post('/create/:id?', upload.array('files', 5), createTask)
router.put('/update/:id', editTask)
router.delete('/delete/:id', deleteTask)
router.put('/addMention/:id', addMention)
router.get('/getDayWiseTaskCount/:id', getDayWiseTaskCount)

module.exports = router