const express = require('express')
const router = express.Router()
const { getUser, getGrp, regUser, loginUser, modifyUser, deleteUser } = require('../controllers/user.controller')

router.get('/', getUser)
router.get('/getGrp/:id', getGrp)
router.post('/register', regUser)
router.post('/login', loginUser)
router.put('/:id', modifyUser)
router.delete('/:id', deleteUser)

module.exports = router