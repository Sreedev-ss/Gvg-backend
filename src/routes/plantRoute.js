const express = require('express');
const { createPlant, allPlant } = require('../controllers/plantController');

const app = express.Router()

app.get('/all-plant',allPlant)
app.post('/create-plant',createPlant)

module.exports = app;