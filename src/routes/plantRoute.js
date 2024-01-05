const express = require('express');
const { createPlant, allPlant, deletePlant, updatePlant, clonePlant } = require('../controllers/plantController');

const app = express.Router()

app.get('/all-plant', allPlant)
app.post('/create-plant', createPlant)
app.delete('/delete-plant/:id', deletePlant)
app.put('/update-plant/:id', updatePlant)
app.post('/clone-plant/:id',clonePlant)

module.exports = app;