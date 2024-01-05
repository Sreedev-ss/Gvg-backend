const express = require('express');
const { createPlant, allPlant, deletePlant, updatePlant, clonePlant, getPlantById } = require('../controllers/plantController');

const app = express.Router()

app.get('/all-plant', allPlant)
app.get('/get-plant-byId/:id',getPlantById)
app.post('/create-plant', createPlant)
app.delete('/delete-plant/:id', deletePlant)
app.put('/update-plant/:id', updatePlant)
app.post('/clone-plant/:id',clonePlant)

module.exports = app;