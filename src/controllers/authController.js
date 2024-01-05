const { httpStatus } = require('../constants/constants');
const AdminModel = require('../model/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../model/user');
const ReportModel = require('../model/history');
const httpMsg = httpStatus()

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { email, password, zone } = req.body;
        const existingAdmin = await AdminModel.findOne({ email });
        const existingUser = await UserModel.findOne({ email });
        if (existingAdmin || existingUser) {
            return res.status(409).json({ message: "Email already exist" });
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
        const admin = await AdminModel.findOne({ email });
        const user = await UserModel.findOne({ email });
        if (!admin && !user) {
            return res.status(401).json({ message: 'Invalid Email' });
        }

        console.log(admin, user, password)

        if (admin && bcrypt.compareSync(password, admin.password)) {
            const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });
            const report = new ReportModel({
                name: admin.name,
                email: admin.email,
                lastLogin: new Date(),
                user:'Admin'
            })
            await report.save()
            res.json({ token, role: 'admin', status: 'Success' });
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            const report = new ReportModel({
                name: user.name,
                email: user.email,
                lastLogin: new Date(),
                user:'User'
            })
            await report.save()
            res.json({ token, role: 'user', plant: user.plant, status: 'Success' });
        } else {
            res.status(401).json({ message: 'Invalid Password' });
        }
    } catch (error) {
        res.status(500).json({ message: httpMsg[500], error: error });
    }
}

const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingUser || existingAdmin) {
            return res.status(409).json({ message: "Email already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserModel({
            name: name,
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