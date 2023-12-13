const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const logger = require('morgan')
const serverConfig = require('./src/config/serverConfig')
const { httpStatus } = require('./src/constants/constants')

dotenv.config();

const server = serverConfig()
const httpMsg = httpStatus()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'))
app.use(cors());

app.get(`${server.baseUrl}/`, (req, res) => {
    res.send('Hello, World!');
});

app.use((req, res) => {
    res.status(404).json({ code: 404, error: httpMsg[404] })
})

app.listen(server.port, () => {
    console.log(`GVG server running on port ${server.port}`)
})