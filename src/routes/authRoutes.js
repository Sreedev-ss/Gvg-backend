const express = require('express')
const {register, login, signUpUser, loginUser } = require('../controllers/authController')


const app = express.Router()

app.post('/login', login)
app.post('/register', register)

app.post('/user/signup',signUpUser)
app.post('/user/login',loginUser)

module.exports = app
