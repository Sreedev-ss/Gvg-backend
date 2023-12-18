const express = require('express')
const { addData, getData, allData, drillData } = require('../controllers/assetController')

const app = express.Router()

app.post('/add-assets', addData)
app.get('/children/:parentId', getData)
app.get('/drill-allData', drillData)
app.get('/allData', allData)
module.exports = app