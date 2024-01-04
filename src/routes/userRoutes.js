const express = require('express');
const { updateUser, deleteUser, getUser, createUser } = require('../controllers/userController');

const app = express.Router()

app.get('/all-user',getUser)
app.put('/edit-user/:id', updateUser)
app.put('/delete-user/:id', deleteUser)

module.exports = app;