const express = require('express');
const { updateUser, deleteUser, getUser } = require('../controllers/userController');

const app = express.Router()

app.put('/edit-user/:id', updateUser)
app.put('/delete-user/:id', deleteUser)
app.get('/all-user',getUser)

module.exports = app;