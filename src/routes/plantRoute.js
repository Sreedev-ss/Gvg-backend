const express = require('express');
const { createPlant, allPlant, deletePlant } = require('../controllers/plantController');

const app = express.Router()

app.get('/all-plant',allPlant)
app.post('/create-plant',createPlant)
app.delete('/delete-plant/:id',deletePlant)

module.exports = app;