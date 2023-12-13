const express = require('express')
const { sample } = require('../controllers/authController')


const app = express.Router()

app.get('/', sample)