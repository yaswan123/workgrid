const express = require('express')
const router = express.Router()

const { getGroups, createGroup, addPeople, addTask, editGroup, getTasks } = require('../controllers/group.controller')

router.get('/', getGroups)
router.post('/create/:id', createGroup)
router.put('/addPeople/:id', addPeople)
router.put('/addTask/:id', addTask)
router.get('/getTasks/:id', getTasks)
router.put('/edit/:id', editGroup)

module.exports = router