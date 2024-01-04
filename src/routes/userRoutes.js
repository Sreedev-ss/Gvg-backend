const express = require('express');
const { updateUser, deleteUser } = require('../controllers/userController');

const app = express.Router()

app.put('/edit-user/:id', updateUser)
app.put('/delete-user/:id', deleteUser)

module.exports = app;