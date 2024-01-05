const express = require('express');
const { createPlant, allPlant, deletePlant, updatePlant } = require('../controllers/plantController');

const app = express.Router()

app.get('/all-plant', allPlant)
app.post('/create-plant', createPlant)
app.delete('/delete-plant/:id', deletePlant)
app.put('/update-plant/:id', updatePlant)

module.exports = app;