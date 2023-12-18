const express = require('express')
const {register, login } = require('../controllers/authController')


const app = express.Router()

app.post('/login', login)
app.post('/register', register)


module.exports = app
