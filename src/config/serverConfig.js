const dotEnv = require('dotenv')

dotEnv.config()

const serverConfig = () => {
    return {
        name: "GVG",
        port: process.env.PORT || 7000,
        baseUrl: '/gvg',
        db: {
            url: process.env.MONGODB_URL
        },
    }
}

module.exports = serverConfig