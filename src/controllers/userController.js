const { httpStatus } = require('../constants/constants');
const UserModel = require('../model/user');
const httpMsg = httpStatus()
const bcrypt = require('bcrypt')

require('dotenv').config();

const getUser = async (req, res) => {
    try {
        const data = await UserModel.find({})
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const { name, email, password, plant } = req.body;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, email, password, plant },
            { new: true }
        )
        res.json(updatedUser)

    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const documentId = req.params.id
        const deletedUser = await UserModel.findByIdAndDelete(documentId)
        if (deletedUser) {
            res.json(`Document with ID ${documentId} has been deleted:`, deletedUser);
        } else {
            res.json(`Document with ID ${documentId} not found.`);
        }
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}


module.exports = {
    getUser,
    updateUser,
    deleteUser
}