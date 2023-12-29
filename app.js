const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan')
const serverConfig = require('./src/config/serverConfig')
const { httpStatus } = require('./src/constants/constants')
const authRoutes = require('./src/routes/authRoutes');
const assetsRoutes = require('./src/routes/assetsRoute');
const connectDB = require('./src/config/db');

require('dotenv').config();
connectDB();

const server = serverConfig()
const httpMsg = httpStatus()
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'))


app.use(`${server.baseUrl}/auth`, authRoutes);
app.use(`${server.baseUrl}/assets`, assetsRoutes);
app.get('/', (req, res) => {
    res.send("HI from server")
})

app.use((req, res) => {
    res.status(404).json({ code: 404, error: httpMsg[404] })
})

app.listen(server.port, () => {
    console.log(`GVG server running on port ${server.port}`)
})