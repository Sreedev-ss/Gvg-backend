const express = require('express');
const { lastLogin } = require('../controllers/reportController');

const app = express.Router()

app.get("/last-login", lastLogin)

module.exports = app;