const { httpStatus } = require('../constants/constants');
const AdminModel = require('../model/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../model/user');
const httpMsg = httpStatus()

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { email, password, zone } = req.body;
        const existingUser = await AdminModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Admin already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new AdminModel({
            email: email,
            password: hashedPassword,
            role: zone
        });
        await user.save();
        res.json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AdminModel.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, status: 'Success' });
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const signUpUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserModel({
            email: email,
            password: hashedPassword,
        });
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, status: 'Success' });
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

module.exports = {
    login,
    register,
    signUpUser,
    loginUser
}